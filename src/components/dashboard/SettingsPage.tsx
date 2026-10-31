import type { DashboardData } from "../../types/dashboard";
import { AssistancePanel } from "./AssistancePanel";
import { AutopilotSettingsPanel } from "./AutopilotSettingsPanel";
import "./SettingsPage.css";

interface SettingsPageProps {
  data: DashboardData;
}

export function SettingsPage({ data }: SettingsPageProps) {
  return (
    <div className="settings-page">
      <div className="settings-page__heading">
        <h1>Driving systems</h1>
        <p>Configure autopilot behavior and driver assistance features.</p>
      </div>
      <div className="settings-page__grid">
        <AutopilotSettingsPanel settings={data.settings} />
        <AssistancePanel assistance={data.assistance} />
      </div>
    </div>
  );
}
