import type { DashboardData } from "../types/dashboard";

/**
 * Placeholder values for the dashboard and the starting point of the
 * simulated demo drive (src/demo). Nothing here is read from the game.
 */
export const mockDashboard: DashboardData = {
  dataSource: {
    title: "Demo mode",
    detail: "Sample data",
  },
  autopilot: {
    stateLabel: "Ready",
    tone: "success",
    detail: "Ready to start",
  },
  speed: {
    currentKmh: 74,
    targetKmh: 80,
  },
  vehicle: {
    speedKmh: 74,
    speedScaleKmh: 130,
    rpm: 1631,
    maxRpm: 2500,
    engineLoadPercent: 68,
    fuelPercent: 62,
    adBluePercent: 78,
    gear: "D10",
  },
  settings: {
    autopilotActive: { label: "Autopilot active", enabled: false, availability: "available" },
    laneKeeping: { label: "Lane keeping", enabled: true, availability: "available" },
    keepDistance: { label: "Keep distance", enabled: false, availability: "planned" },
    cruiseControl: { label: "Cruise control", enabled: true, availability: "available" },
    targetSpeedKmh: 80,
    overtakingSlow: { label: "Overtaking (slow)", enabled: false, availability: "planned" },
  },
  assistance: {
    systems: [
      {
        id: "laneChangeAssist",
        label: "Lane change assist",
        enabled: false,
        availability: "planned",
      },
      {
        id: "trafficLightDetection",
        label: "Traffic light detection",
        enabled: false,
        availability: "planned",
      },
      { id: "turningAssist", label: "Turning assist", enabled: false, availability: "planned" },
      {
        id: "trafficDetection",
        label: "Traffic detection",
        enabled: false,
        availability: "planned",
      },
    ],
    warnings: [
      { id: "audibleAlerts", label: "Audible alerts", enabled: true, availability: "available" },
      { id: "visualAlerts", label: "Visual alerts", enabled: true, availability: "available" },
    ],
  },
  job: {
    origin: { city: "Munich", countryCode: "DE" },
    destination: { city: "Linz", countryCode: "AT" },
    cargo: "Construction materials",
    weightTonnes: 24,
    distanceKm: 312,
    timeLeft: "1 h 0 min",
    reward: "€34,200",
  },
  route: {
    drivenKm: 237,
    totalKm: 312,
    remainingKm: 75,
    remainingTime: "1 h 0 min",
    nextStop: {
      name: "Haag am Hausruck rest area",
      distanceKm: 45,
      travelTime: "36 min",
    },
  },
  systemChecks: [
    { label: "Demo mode", state: "warning", detail: "no game" },
    { label: "Telemetry active (sample data)", state: "ok" },
    { label: "Controls ready", state: "ok", detail: "demo" },
    { label: "Map data", state: "off", detail: "not implemented yet" },
    { label: "Autopilot ready", state: "ok" },
  ],
};
