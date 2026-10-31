import {
  Activity,
  CircleCheck,
  CircleDashed,
  Play,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import type { SystemCheck, SystemCheckState } from "../../types/dashboard";
import { Card } from "../ui/Card";
import "./SystemStatusPanel.css";

const stateIcons: Record<SystemCheckState, LucideIcon> = {
  ok: CircleCheck,
  warning: TriangleAlert,
  off: CircleDashed,
};

interface SystemStatusPanelProps {
  checks: readonly SystemCheck[];
}

export function SystemStatusPanel({ checks }: SystemStatusPanelProps) {
  return (
    <Card title="System status" icon={Activity} className="card--system">
      <ul className="status-list">
        {checks.map(({ label, state, detail }) => {
          const Icon = stateIcons[state];
          return (
            <li key={label} className={`status-row status-row--${state}`}>
              <Icon className="status-row__icon" size={20} strokeWidth={2} aria-hidden="true" />
              <span className="status-row__label">{label}</span>
              {detail && <span className="status-row__detail">{detail}</span>}
            </li>
          );
        })}
      </ul>

      {/* Always disabled: driving functions do not exist yet. */}
      <button
        type="button"
        className="start-button"
        disabled
        title="Driving functions are not available yet"
      >
        <Play size={20} strokeWidth={2.2} fill="currentColor" aria-hidden="true" />
        Start autopilot
      </button>
    </Card>
  );
}
