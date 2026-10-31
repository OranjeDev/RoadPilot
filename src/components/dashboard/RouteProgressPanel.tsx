import { Route } from "lucide-react";
import type { RouteProgress } from "../../types/dashboard";
import { percentOf } from "../../utils/format";
import { Card } from "../ui/Card";
import { ProgressBar } from "../ui/ProgressBar";
import "./RouteProgressPanel.css";

interface RouteProgressPanelProps {
  route: RouteProgress;
}

export function RouteProgressPanel({ route }: RouteProgressPanelProps) {
  const progress = percentOf(route.drivenKm, route.totalKm);

  return (
    <Card title="Route Progress" icon={Route}>
      <div className="route-summary">
        <span className="route-summary__percent">{progress}%</span>
        <span className="route-summary__caption">
          {route.drivenKm} of {route.totalKm} km driven
        </span>
      </div>

      <div className="route-track">
        <ProgressBar percent={progress} label="Route progress" size="md" />
        <ol className="route-track__waypoints">
          {route.waypoints.map((waypoint) => {
            const position = percentOf(waypoint.distanceKm, route.totalKm);
            return (
              <li
                key={waypoint.label}
                className={
                  waypoint.reached
                    ? "route-track__waypoint route-track__waypoint--reached"
                    : "route-track__waypoint"
                }
                style={{ left: `${position}%` }}
              >
                <span className="route-track__pin" aria-hidden="true" />
                <span className="route-track__label">{waypoint.label}</span>
                <span className="route-track__km">{waypoint.distanceKm} km</span>
              </li>
            );
          })}
        </ol>
      </div>

      <dl className="route-stats">
        <div>
          <dt>Remaining</dt>
          <dd>{route.remainingKm} km</dd>
        </div>
        <div>
          <dt>Time left</dt>
          <dd>{route.remainingTime}</dd>
        </div>
        <div>
          <dt>ETA</dt>
          <dd>{route.eta}</dd>
        </div>
      </dl>
    </Card>
  );
}
