import type { DashboardData } from "../types/dashboard";

/**
 * Static placeholder values for the Phase 1 dashboard.
 * Nothing here is read from the game; every value is fixed.
 */
export const mockDashboard: DashboardData = {
  connection: {
    game: "ETS2",
    connected: true,
  },
  autopilot: {
    stateLabel: "Standby",
    tone: "warning",
    detail: "Ready to engage",
  },
  speed: {
    currentKmh: 72,
    targetKmh: 80,
    limitKmh: 80,
  },
  vehicle: {
    speedKmh: 72,
    rpm: 1350,
    maxRpm: 2500,
    engineLoadPercent: 46,
    fuelLiters: 612,
    fuelCapacityLiters: 900,
    adBluePercent: 74,
    gear: "A10",
    transmissionMode: "Automatic",
  },
  settings: {
    autopilotEnabled: false,
    laneKeepingEnabled: true,
    followingDistance: "Medium",
    followingDistanceOptions: ["Short", "Medium", "Long"],
    cruiseControlEnabled: true,
    targetSpeedKmh: 80,
    slowOvertakingEnabled: false,
  },
  assistance: [
    {
      id: "laneChangeAssist",
      name: "Lane Change Assist",
      description: "Checks adjacent lanes before changing",
      enabled: true,
    },
    {
      id: "trafficLightRecognition",
      name: "Traffic Light Recognition",
      description: "Detects signals at intersections",
      enabled: true,
    },
    {
      id: "turningAssist",
      name: "Turning Assist",
      description: "Guides wide turns with a trailer",
      enabled: false,
    },
    {
      id: "trafficRecognition",
      name: "Traffic Recognition",
      description: "Tracks vehicles ahead and around",
      enabled: true,
    },
    {
      id: "acousticWarnings",
      name: "Acoustic Warnings",
      description: "Plays alert sounds for hazards",
      enabled: true,
    },
    {
      id: "visualWarnings",
      name: "Visual Warnings",
      description: "Shows on-screen hazard alerts",
      enabled: true,
    },
  ],
  job: {
    cargo: "Electronics",
    weightTonnes: 18,
    origin: { city: "Berlin", company: "Tradeaux" },
    destination: { city: "Hamburg", company: "Posped" },
    totalDistanceKm: 346,
    income: "€ 14,820",
    deadline: "Today, 18:40",
  },
  route: {
    drivenKm: 132,
    totalKm: 346,
    remainingKm: 214,
    eta: "16:52",
    remainingTime: "2 h 48 min",
    waypoints: [
      { label: "Berlin", distanceKm: 0, reached: true },
      { label: "Rest stop", distanceKm: 180, reached: false },
      { label: "Hamburg", distanceKm: 346, reached: false },
    ],
  },
  systemChecks: [
    { name: "Game Connection", status: "Connected", tone: "success" },
    { name: "Telemetry", status: "Receiving", tone: "success" },
    { name: "Lane Detection", status: "Standby", tone: "neutral" },
    { name: "Control Input", status: "Not configured", tone: "warning" },
  ],
};
