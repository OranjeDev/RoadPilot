import {
  ArrowLeftRight,
  ChevronsUp,
  CircleGauge,
  Gauge,
  Navigation,
  Road,
  SlidersHorizontal,
} from "lucide-react";
import type { AutopilotSettings } from "../../types/dashboard";
import { Card } from "../ui/Card";
import { SegmentedControl } from "../ui/SegmentedControl";
import { SettingRow } from "../ui/SettingRow";
import { Stepper } from "../ui/Stepper";
import { Toggle } from "../ui/Toggle";

interface AutopilotSettingsPanelProps {
  settings: AutopilotSettings;
}

export function AutopilotSettingsPanel({ settings }: AutopilotSettingsPanelProps) {
  return (
    <Card title="Autopilot Settings" icon={SlidersHorizontal}>
      <ul className="setting-list">
        <SettingRow
          icon={Navigation}
          label="Autopilot"
          description="Master switch for autonomous driving"
          control={<Toggle checked={settings.autopilotEnabled} label="Autopilot" />}
        />
        <SettingRow
          icon={Road}
          label="Lane Keeping"
          description="Keeps the truck centered in its lane"
          control={<Toggle checked={settings.laneKeepingEnabled} label="Lane Keeping" />}
        />
        <SettingRow
          icon={ArrowLeftRight}
          label="Following Distance"
          control={
            <SegmentedControl
              options={settings.followingDistanceOptions}
              value={settings.followingDistance}
              label="Following Distance"
            />
          }
        />
        <SettingRow
          icon={CircleGauge}
          label="Cruise Control"
          description="Holds the target speed"
          control={<Toggle checked={settings.cruiseControlEnabled} label="Cruise Control" />}
        />
        <SettingRow
          icon={Gauge}
          label="Target Speed"
          control={<Stepper value={settings.targetSpeedKmh} unit="km/h" label="Target Speed" />}
        />
        <SettingRow
          icon={ChevronsUp}
          label="Overtaking (Slow)"
          description="Passes slower vehicles carefully"
          control={<Toggle checked={settings.slowOvertakingEnabled} label="Overtaking (Slow)" />}
        />
      </ul>
    </Card>
  );
}
