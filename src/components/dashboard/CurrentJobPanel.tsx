import { CalendarClock, Package, Wallet, Weight } from "lucide-react";
import type { CurrentJob } from "../../types/dashboard";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import "./CurrentJobPanel.css";

interface CurrentJobPanelProps {
  job: CurrentJob;
}

export function CurrentJobPanel({ job }: CurrentJobPanelProps) {
  const facts = [
    { label: "Cargo", value: job.cargo, icon: Package },
    { label: "Weight", value: `${job.weightTonnes} t`, icon: Weight },
    { label: "Income", value: job.income, icon: Wallet },
    { label: "Deadline", value: job.deadline, icon: CalendarClock },
  ];

  return (
    <Card title="Current Job" icon={Package} action={<Badge tone="accent">In progress</Badge>}>
      <ol className="job-route">
        <li className="job-route__stop">
          <span className="job-route__marker job-route__marker--origin" aria-hidden="true" />
          <div>
            <span className="job-route__city">{job.origin.city}</span>
            <span className="job-route__company">{job.origin.company}</span>
          </div>
        </li>
        <li className="job-route__stop">
          <span className="job-route__marker job-route__marker--destination" aria-hidden="true" />
          <div>
            <span className="job-route__city">{job.destination.city}</span>
            <span className="job-route__company">{job.destination.company}</span>
          </div>
          <span className="job-route__distance">{job.totalDistanceKm} km</span>
        </li>
      </ol>

      <dl className="job-facts">
        {facts.map(({ label, value, icon: Icon }) => (
          <div key={label} className="job-facts__item">
            <dt>
              <Icon size={13} strokeWidth={2} aria-hidden="true" />
              {label}
            </dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
