import {
  CarFront,
  CornerUpRight,
  Eye,
  MoveHorizontal,
  ScanEye,
  ShieldCheck,
  Volume2,
  type LucideIcon,
} from "lucide-react";
import type { AssistanceSystem, AssistanceSystemId } from "../../types/dashboard";
import { Card } from "../ui/Card";
import { SettingRow } from "../ui/SettingRow";
import { Toggle } from "../ui/Toggle";

const systemIcons: Record<AssistanceSystemId, LucideIcon> = {
  laneChangeAssist: MoveHorizontal,
  trafficLightRecognition: ScanEye,
  turningAssist: CornerUpRight,
  trafficRecognition: CarFront,
  acousticWarnings: Volume2,
  visualWarnings: Eye,
};

interface AssistancePanelProps {
  systems: readonly AssistanceSystem[];
}

export function AssistancePanel({ systems }: AssistancePanelProps) {
  const activeCount = systems.filter((system) => system.enabled).length;

  return (
    <Card
      title="Assistance Systems"
      icon={ShieldCheck}
      action={
        <span className="card__meta">
          {activeCount} of {systems.length} active
        </span>
      }
    >
      <ul className="setting-list">
        {systems.map((system) => (
          <SettingRow
            key={system.id}
            icon={systemIcons[system.id]}
            label={system.name}
            description={system.description}
            control={<Toggle checked={system.enabled} label={system.name} />}
          />
        ))}
      </ul>
    </Card>
  );
}
