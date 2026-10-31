import type { DashboardData, NextStop } from "../types/dashboard";
import { formatDuration } from "../utils/format";

/**
 * Simulated demo drive. Pure functions only: the React hook in
 * useDemoDrive.ts owns the timer and calls stepDemoDrive on every tick.
 * Nothing here talks to the game.
 */

/** Demo time runs this many times faster than real time. */
export const DEMO_TIME_SCALE = 10;

/** Speed limits along the demo route, by distance from the route start. */
const SPEED_LIMITS: readonly { fromKm: number; limitKmh: number }[] = [
  { fromKm: 0, limitKmh: 50 },
  { fromKm: 8, limitKmh: 80 },
  { fromKm: 150, limitKmh: 60 },
  { fromKm: 158, limitKmh: 80 },
  { fromKm: 252, limitKmh: 60 }, // roadworks
  { fromKm: 260, limitKmh: 80 },
  { fromKm: 304, limitKmh: 50 },
];

const MAX_ACCEL_KMH_PER_S = 1.8; // about 0.5 m/s², a loaded truck
const MAX_DECEL_KMH_PER_S = 5.4; // about 1.5 m/s²
const PLANNING_DECEL_MS2 = 0.8; // gentle braking used to slow down for lower limits
const PLANNED_AVERAGE_KMH = 75; // used for "time remaining" estimates
const FUEL_PERCENT_PER_KM = 0.045;
const ADBLUE_PERCENT_PER_KM = 0.022;
const IDLE_RPM = 600;
const TOP_GEAR = 12;
const TOP_GEAR_RPM_PER_KMH = 16.5;
const GEAR_STEP = 1.25;
/** How long (demo seconds) the truck waits at the destination before the demo restarts. */
const ARRIVAL_HOLD_S = 8 * DEMO_TIME_SCALE;
/** Deadline at the start of the demo, in demo minutes. */
const START_DEADLINE_MIN = 90;

export interface DemoDriveState {
  drivenKm: number;
  speedKmh: number;
  /** Small random drift so the speed does not sit exactly on the target. */
  speedWobbleKmh: number;
  engineLoadPercent: number;
  fuelPercent: number;
  adBluePercent: number;
  deadlineMinutes: number;
  /** Demo seconds spent at the destination, or null while still driving. */
  arrivedForS: number | null;
}

export function createDemoDrive(base: DashboardData): DemoDriveState {
  return {
    drivenKm: base.route.drivenKm,
    speedKmh: base.vehicle.speedKmh,
    speedWobbleKmh: 0,
    engineLoadPercent: base.vehicle.engineLoadPercent,
    fuelPercent: base.vehicle.fuelPercent,
    adBluePercent: base.vehicle.adBluePercent,
    deadlineMinutes: START_DEADLINE_MIN,
    arrivedForS: null,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function limitAt(km: number): number {
  let limit = SPEED_LIMITS[0]?.limitKmh ?? 0;
  for (const section of SPEED_LIMITS) {
    if (km >= section.fromKm) limit = section.limitKmh;
  }
  return limit;
}

/**
 * Highest speed that still lets the truck slow down in time for every lower
 * limit ahead, including the stop at the destination.
 */
function allowedSpeedKmh(km: number, totalKm: number): number {
  const brakingSpeed = (limitKmh: number, distanceKm: number) => {
    const limitMs = limitKmh / 3.6;
    const distanceM = Math.max(0, distanceKm) * 1000;
    return Math.sqrt(limitMs * limitMs + 2 * PLANNING_DECEL_MS2 * distanceM) * 3.6;
  };

  let allowed = limitAt(km);
  for (const section of SPEED_LIMITS) {
    if (section.fromKm > km) {
      allowed = Math.min(allowed, brakingSpeed(section.limitKmh, section.fromKm - km));
    }
  }
  return Math.min(allowed, brakingSpeed(0, totalKm - km));
}

/** Road gradient in percent; rolling hills that repeat every few kilometres. */
function gradeAt(km: number): number {
  return 2.2 * Math.sin(km / 6.5) + 0.8 * Math.sin(km / 2.1);
}

/** Advances the simulation by dtS demo seconds. `random` returns values in [0, 1). */
export function stepDemoDrive(
  state: DemoDriveState,
  base: DashboardData,
  dtS: number,
  random: () => number,
): DemoDriveState {
  const totalKm = base.route.totalKm;
  const deadlineMinutes = Math.max(0, state.deadlineMinutes - dtS / 60);

  if (state.arrivedForS !== null) {
    const arrivedForS = state.arrivedForS + dtS;
    if (arrivedForS >= ARRIVAL_HOLD_S) return createDemoDrive(base);
    return { ...state, deadlineMinutes, arrivedForS };
  }

  const speedWobbleKmh = clamp(state.speedWobbleKmh + (random() - 0.5) * 0.8, -1.5, 1.5);
  const cruiseTarget = Math.min(base.settings.targetSpeedKmh, limitAt(state.drivenKm));
  const desired = Math.min(cruiseTarget + speedWobbleKmh, allowedSpeedKmh(state.drivenKm, totalKm));

  const grade = gradeAt(state.drivenKm);
  // Climbs slow the truck down; descents give a little extra pull.
  const maxAccel = clamp(MAX_ACCEL_KMH_PER_S - grade * 0.35, 0.3, 2.5);
  const speedChange = clamp(desired - state.speedKmh, -MAX_DECEL_KMH_PER_S * dtS, maxAccel * dtS);
  const speedKmh = Math.max(0, state.speedKmh + speedChange);

  const movedKm = ((state.speedKmh + speedKmh) / 2) * (dtS / 3600);
  const drivenKm = Math.min(totalKm, state.drivenKm + movedKm);

  const accelPerS = speedChange / dtS;
  const targetLoad =
    speedKmh < 1 ? 4 : clamp(32 + grade * 14 + accelPerS * 22 + (random() - 0.5) * 6, 0, 100);
  // Smooth the load so the bar does not jump on every tick.
  const engineLoadPercent = state.engineLoadPercent + (targetLoad - state.engineLoadPercent) * 0.5;

  const arrived = drivenKm >= totalKm - 0.02 && speedKmh < 2;

  return {
    drivenKm: arrived ? totalKm : drivenKm,
    speedKmh: arrived ? 0 : speedKmh,
    speedWobbleKmh,
    engineLoadPercent: arrived ? 4 : engineLoadPercent,
    fuelPercent: Math.max(0, state.fuelPercent - movedKm * FUEL_PERCENT_PER_KM),
    adBluePercent: Math.max(0, state.adBluePercent - movedKm * ADBLUE_PERCENT_PER_KM),
    deadlineMinutes,
    arrivedForS: arrived ? 0 : null,
  };
}

/** Picks the highest gear that keeps the engine above ~1100 rpm. */
function gearbox(speedKmh: number): { gear: string; rpm: number } {
  if (speedKmh < 1) return { gear: "N", rpm: IDLE_RPM };

  for (let gear = TOP_GEAR; gear >= 1; gear -= 1) {
    const rpm = speedKmh * TOP_GEAR_RPM_PER_KMH * GEAR_STEP ** (TOP_GEAR - gear);
    if (rpm >= 1100 || gear === 1) {
      return { gear: `D${gear}`, rpm: Math.max(IDLE_RPM, Math.round(rpm / 10) * 10) };
    }
  }
  return { gear: "N", rpm: IDLE_RPM };
}

function travelTime(distanceKm: number): string {
  return formatDuration((distanceKm / PLANNED_AVERAGE_KMH) * 60);
}

/** Merges the simulated values into the static demo data. */
export function toDashboardData(base: DashboardData, state: DemoDriveState): DashboardData {
  const { totalKm } = base.route;
  const remainingKm = Math.max(0, totalKm - state.drivenKm);
  const arrived = state.arrivedForS !== null;
  const speedKmh = Math.round(state.speedKmh);
  const { gear, rpm } = gearbox(state.speedKmh);
  const limitKmh = limitAt(state.drivenKm);
  const targetKmh = Math.min(base.settings.targetSpeedKmh, limitKmh);

  // The rest area sits at a fixed point on the route; after it, the destination is next.
  const restAreaKm = base.route.drivenKm + base.route.nextStop.distanceKm;
  const nextStop: NextStop =
    state.drivenKm < restAreaKm
      ? {
          name: base.route.nextStop.name,
          distanceKm: Math.round(restAreaKm - state.drivenKm),
          travelTime: travelTime(restAreaKm - state.drivenKm),
        }
      : {
          name: `${base.job.destination.city} (destination)`,
          distanceKm: Math.round(remainingKm),
          travelTime: arrived ? "Arrived" : travelTime(remainingKm),
        };

  const remainingTime = arrived ? "Arrived" : travelTime(remainingKm);

  return {
    ...base,
    speed: {
      currentKmh: speedKmh,
      targetKmh,
      ...(targetKmh < base.settings.targetSpeedKmh ? { limitKmh } : {}),
    },
    vehicle: {
      ...base.vehicle,
      speedKmh,
      rpm,
      gear,
      engineLoadPercent: Math.round(state.engineLoadPercent),
      fuelPercent: Math.round(state.fuelPercent),
      adBluePercent: Math.round(state.adBluePercent),
    },
    job: {
      ...base.job,
      timeLeft: formatDuration(state.deadlineMinutes),
    },
    route: {
      ...base.route,
      drivenKm: Math.round(state.drivenKm),
      remainingKm: Math.round(remainingKm),
      remainingTime,
      nextStop,
    },
  };
}
