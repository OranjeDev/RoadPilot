import { Gauge, Milestone, Navigation, Package } from "lucide-react";
import type {
  AutopilotOverview,
  CurrentJob,
  RouteProgress,
  SpeedOverview,
} from "../../types/dashboard";
import { StatusDot } from "../ui/StatusDot";
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
        icon={Navigation}
        label="Autopilot"
        value={autopilot.stateLabel}
        detail={
          <>
            <StatusDot tone={autopilot.tone} />
            <span>{autopilot.detail}</span>
          </>
        }
      />
      <StatCard
        icon={Gauge}
        label="Speed"
        value={speed.currentKmh}
        unit="km/h"
        detail={
          <span>
            Target <strong>{speed.targetKmh} km/h</strong> · Limit {speed.limitKmh} km/h
          </span>
        }
      />
      <StatCard
        icon={Package}
        label="Current Job"
        value={`${job.origin.city} → ${job.destination.city}`}
        detail={
          <span>
            {job.cargo} · {job.weightTonnes} t
          </span>
        }
      />
      <StatCard
        icon={Milestone}
        label="Remaining Distance"
        value={route.remainingKm}
        unit="km"
        detail={
          <span>
            ETA <strong>{route.eta}</strong> · {route.remainingTime}
          </span>
        }
      />
    </div>
  );
}
