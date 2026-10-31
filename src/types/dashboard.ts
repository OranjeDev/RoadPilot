/** Visual tone used by badges, dots and indicators. */
export type StatusTone = "success" | "warning" | "danger" | "neutral" | "accent";

export interface GameConnection {
  game: string;
  connected: boolean;
}

export interface AutopilotOverview {
  stateLabel: string;
  tone: StatusTone;
  detail: string;
}

export interface SpeedOverview {
  currentKmh: number;
  targetKmh: number;
  limitKmh: number;
}

export interface VehicleData {
  speedKmh: number;
  rpm: number;
  maxRpm: number;
  engineLoadPercent: number;
  fuelLiters: number;
  fuelCapacityLiters: number;
  adBluePercent: number;
  gear: string;
  transmissionMode: string;
}

export type FollowingDistance = "Short" | "Medium" | "Long";

export interface AutopilotSettings {
  autopilotEnabled: boolean;
  laneKeepingEnabled: boolean;
  followingDistance: FollowingDistance;
  followingDistanceOptions: readonly FollowingDistance[];
  cruiseControlEnabled: boolean;
  targetSpeedKmh: number;
  slowOvertakingEnabled: boolean;
}

export type AssistanceSystemId =
  | "laneChangeAssist"
  | "trafficLightRecognition"
  | "turningAssist"
  | "trafficRecognition"
  | "acousticWarnings"
  | "visualWarnings";

export interface AssistanceSystem {
  id: AssistanceSystemId;
  name: string;
  description: string;
  enabled: boolean;
}

export interface JobLocation {
  city: string;
  company: string;
}

export interface CurrentJob {
  cargo: string;
  weightTonnes: number;
  origin: JobLocation;
  destination: JobLocation;
  totalDistanceKm: number;
  income: string;
  deadline: string;
}

export interface RouteWaypoint {
  label: string;
  distanceKm: number;
  reached: boolean;
}

export interface RouteProgress {
  drivenKm: number;
  totalKm: number;
  remainingKm: number;
  eta: string;
  remainingTime: string;
  waypoints: readonly RouteWaypoint[];
}

export interface SystemCheck {
  name: string;
  status: string;
  tone: StatusTone;
}

export interface DashboardData {
  connection: GameConnection;
  autopilot: AutopilotOverview;
  speed: SpeedOverview;
  vehicle: VehicleData;
  settings: AutopilotSettings;
  assistance: readonly AssistanceSystem[];
  job: CurrentJob;
  route: RouteProgress;
  systemChecks: readonly SystemCheck[];
}
