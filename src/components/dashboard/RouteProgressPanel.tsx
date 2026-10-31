import { Route, SquareParking } from "lucide-react";
import type { RouteProgress } from "../../types/dashboard";
import { percentOf } from "../../utils/format";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { ProgressBar } from "../ui/ProgressBar";
import "./RouteProgressPanel.css";

interface RouteProgressPanelProps {
  route: RouteProgress;
}

export function RouteProgressPanel({ route }: RouteProgressPanelProps) {
  const progress = percentOf(route.drivenKm, route.totalKm);
  const { nextStop } = route;

  return (
    <Card title="Route progress" icon={Route} action={<Badge variant="demo" />}>
      <div className="route-progress">
        <div className="route-progress__scale">
          <span>{route.drivenKm} km</span>
          <span className="route-progress__percent">{progress} %</span>
          <span>{route.totalKm} km</span>
        </div>
        <ProgressBar percent={progress} label="Route progress" size="lg" />
      </div>

      <div className="route-fact">
        <span className="route-fact__label">Remaining</span>
        <span className="route-fact__value">
          {route.remainingKm} km · {route.remainingTime}
        </span>
      </div>

      <div className="route-fact">
        <span className="route-fact__label">Next stop</span>
        <div className="next-stop">
          <SquareParking size={22} strokeWidth={2} aria-hidden="true" />
          <span className="next-stop__text">
            <span className="route-fact__value">{nextStop.name}</span>
            <span className="next-stop__meta">
              {nextStop.distanceKm} km · {nextStop.travelTime}
            </span>
          </span>
        </div>
      </div>
    </Card>
  );
}
