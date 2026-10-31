import { Clock, ClipboardList, Coins, Package, Waypoints } from "lucide-react";
import type { CurrentJob, Place } from "../../types/dashboard";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import "./CurrentJobPanel.css";

function formatPlace(place: Place): string {
  return `${place.city} (${place.countryCode})`;
}

interface CurrentJobPanelProps {
  job: CurrentJob;
}

export function CurrentJobPanel({ job }: CurrentJobPanelProps) {
  return (
    <Card title="Current job" icon={ClipboardList} action={<Badge variant="demo" />}>
      <dl className="job">
        <dt>From</dt>
        <dd>
          <span className="job__dot job__dot--from" aria-hidden="true" />
          {formatPlace(job.origin)}
        </dd>
        <dt>To</dt>
        <dd>
          <span className="job__dot job__dot--to" aria-hidden="true" />
          {formatPlace(job.destination)}
        </dd>

        <dt className="job__gap">Cargo</dt>
        <dd className="job__gap">
          <Package size={18} strokeWidth={2} aria-hidden="true" />
          {job.cargo} ({job.weightTonnes} t)
        </dd>
        <dt>Distance</dt>
        <dd>
          <Waypoints size={18} strokeWidth={2} aria-hidden="true" />
          {job.distanceKm} km
        </dd>
        <dt>Time left</dt>
        <dd>
          <Clock size={18} strokeWidth={2} aria-hidden="true" />
          {job.timeLeft}
        </dd>
        <dt>Reward</dt>
        <dd>
          <Coins size={18} strokeWidth={2} aria-hidden="true" />
          {job.reward}
        </dd>
      </dl>
    </Card>
  );
}
