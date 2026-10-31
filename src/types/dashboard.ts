/** Visual tone for status values. */
export type StatusTone = "success" | "warning" | "danger" | "neutral";

/** "planned" features are shown dimmed with a "Planned" badge. */
export type Availability = "available" | "planned";

export interface Feature {
  label: string;
  enabled: boolean;
  availability: Availability;
}

export interface DataSource {
  title: string;
  detail: string;
}

export interface AutopilotOverview {
  stateLabel: string;
  tone: StatusTone;
  detail: string;
}

export interface SpeedOverview {
  currentKmh: number;
  targetKmh: number;
}

export interface VehicleData {
  speedKmh: number;
  /** Upper end of the speed bar. */
  speedScaleKmh: number;
  rpm: number;
  maxRpm: number;
  engineLoadPercent: number;
  fuelPercent: number;
  adBluePercent: number;
  gear: string;
}

export interface AutopilotSettings {
  autopilotActive: Feature;
  laneKeeping: Feature;
  keepDistance: Feature;
  cruiseControl: Feature;
  targetSpeedKmh: number;
  overtakingSlow: Feature;
}

export type AssistanceSystemId =
  "laneChangeAssist" | "trafficLightDetection" | "turningAssist" | "trafficDetection";

export type WarningId = "audibleAlerts" | "visualAlerts";

export interface AssistanceSettings {
  systems: readonly (Feature & { id: AssistanceSystemId })[];
  warnings: readonly (Feature & { id: WarningId })[];
}

export interface Place {
  city: string;
  countryCode: string;
}

export interface CurrentJob {
  origin: Place;
  destination: Place;
  cargo: string;
  weightTonnes: number;
  distanceKm: number;
  timeLeft: string;
  reward: string;
}

export interface NextStop {
  name: string;
  distanceKm: number;
  travelTime: string;
}

export interface RouteProgress {
  drivenKm: number;
  totalKm: number;
  remainingKm: number;
  remainingTime: string;
  nextStop: NextStop;
}

export type SystemCheckState = "ok" | "warning" | "off";

export interface SystemCheck {
  label: string;
  state: SystemCheckState;
  detail?: string;
}

export interface DashboardData {
  dataSource: DataSource;
  autopilot: AutopilotOverview;
  speed: SpeedOverview;
  vehicle: VehicleData;
  settings: AutopilotSettings;
  assistance: AssistanceSettings;
  job: CurrentJob;
  route: RouteProgress;
  systemChecks: readonly SystemCheck[];
}
