import {
  ArrowLeftRight,
  Bell,
  CarFront,
  CornerUpRight,
  Eye,
  Radar,
  TrafficCone,
  type LucideIcon,
} from "lucide-react";
import type { AssistanceSettings, AssistanceSystemId, WarningId } from "../../types/dashboard";
import { Card } from "../ui/Card";
import { ToggleRow } from "../ui/ToggleRow";

const systemIcons: Record<AssistanceSystemId, LucideIcon> = {
  laneChangeAssist: ArrowLeftRight,
  trafficLightDetection: TrafficCone,
  turningAssist: CornerUpRight,
  trafficDetection: Radar,
};

const warningIcons: Record<WarningId, LucideIcon> = {
  audibleAlerts: Bell,
  visualAlerts: Eye,
};

interface AssistancePanelProps {
  assistance: AssistanceSettings;
}

export function AssistancePanel({ assistance }: AssistancePanelProps) {
  return (
    <Card title="Assistance systems" icon={CarFront}>
      <ul className="toggle-list">
        {assistance.systems.map((system) => (
          <ToggleRow key={system.id} icon={systemIcons[system.id]} feature={system} />
        ))}
      </ul>

      <h3 className="card__subhead">Warnings</h3>
      <ul className="toggle-list">
        {assistance.warnings.map((warning) => (
          <ToggleRow key={warning.id} icon={warningIcons[warning.id]} feature={warning} />
        ))}
      </ul>
    </Card>
  );
}
