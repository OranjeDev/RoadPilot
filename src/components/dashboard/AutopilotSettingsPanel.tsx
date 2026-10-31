import { ArrowLeftRight, CarFront, Gauge, Ruler } from "lucide-react";
import type { AutopilotSettings } from "../../types/dashboard";
import { SteeringWheel } from "../icons/SteeringWheel";
import { Card } from "../ui/Card";
import { Stepper } from "../ui/Stepper";
import { ToggleRow } from "../ui/ToggleRow";
import "./AutopilotSettingsPanel.css";

interface AutopilotSettingsPanelProps {
  settings: AutopilotSettings;
}

export function AutopilotSettingsPanel({ settings }: AutopilotSettingsPanelProps) {
  return (
    <Card title="Autopilot settings" icon={SteeringWheel}>
      <ul className="toggle-list">
        <ToggleRow icon={SteeringWheel} feature={settings.autopilotActive} />
        <ToggleRow icon={CarFront} feature={settings.laneKeeping} />
        <ToggleRow icon={Ruler} feature={settings.keepDistance} />
        <ToggleRow icon={Gauge} feature={settings.cruiseControl} />
      </ul>

      <div className="target-speed">
        <span className="target-speed__label">Target speed</span>
        <Stepper value={settings.targetSpeedKmh} unit="km/h" label="Target speed" />
      </div>

      <ul className="toggle-list">
        <ToggleRow icon={ArrowLeftRight} feature={settings.overtakingSlow} />
      </ul>
    </Card>
  );
}
