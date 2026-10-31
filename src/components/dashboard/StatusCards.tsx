import { Gauge, Route, Truck } from "lucide-react";
import type {
  AutopilotOverview,
  CurrentJob,
  RouteProgress,
  SpeedOverview,
} from "../../types/dashboard";
import { SteeringWheel } from "../icons/SteeringWheel";
import { Badge } from "../ui/Badge";
import { StatCard } from "../ui/StatCard";

interface StatusCardsProps {
  autopilot: AutopilotOverview;
  speed: SpeedOverview;
  job: CurrentJob;
  route: RouteProgress;
}

export function StatusCards({ autopilot, speed, job, route }: StatusCardsProps) {
  return (
    <div className="dashboard__stats">
      <StatCard
        icon={SteeringWheel}
        accentIcon
        label="Autopilot"
        value={autopilot.stateLabel}
        valueTone={autopilot.tone}
        detail={autopilot.detail}
      />
      <StatCard
        icon={Gauge}
        label="Speed"
        badge={<Badge variant="demo" />}
        value={`${speed.currentKmh} km/h`}
        detail={`Target: ${speed.targetKmh} km/h`}
      />
      <StatCard
        icon={Truck}
        label="Current job"
        badge={<Badge variant="demo" />}
        value={`${job.origin.city} → ${job.destination.city}`}
        detail={`${job.cargo} (${job.weightTonnes} t)`}
      />
      <StatCard
        icon={Route}
        accentIcon
        label="Remaining"
        badge={<Badge variant="demo" />}
        value={`${route.remainingKm} km`}
        detail={route.remainingTime}
      />
    </div>
  );
}
