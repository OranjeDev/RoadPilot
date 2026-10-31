import { Activity, Info, Play } from "lucide-react";
import type { SystemCheck } from "../../types/dashboard";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { StatusDot } from "../ui/StatusDot";
import "./SystemStatusPanel.css";

interface SystemStatusPanelProps {
  checks: readonly SystemCheck[];
}

export function SystemStatusPanel({ checks }: SystemStatusPanelProps) {
  return (
    <Card title="System Status" icon={Activity}>
      <ul className="status-list">
        {checks.map((check) => (
          <li key={check.name} className="status-list__item">
            <StatusDot tone={check.tone} />
            <span className="status-list__name">{check.name}</span>
            <Badge tone={check.tone}>{check.status}</Badge>
          </li>
        ))}
      </ul>

      <div className="start-autopilot">
        {/* Always disabled: driving functions do not exist in this phase. */}
        <button type="button" className="start-autopilot__button" disabled>
          <Play size={16} strokeWidth={2.4} aria-hidden="true" />
          Start Autopilot
        </button>
        <p className="start-autopilot__note">
          <Info size={13} strokeWidth={2} aria-hidden="true" />
          Driving functions are not available yet.
        </p>
      </div>
    </Card>
  );
}
