import type { DashboardData } from "../../types/dashboard";
import type { Updater } from "../../updates/useUpdater";
import { UpdateCard } from "../updates/UpdateCard";
import { AssistancePanel } from "./AssistancePanel";
import { AutopilotSettingsPanel } from "./AutopilotSettingsPanel";
import "./SettingsPage.css";

interface SettingsPageProps {
  data: DashboardData;
  updater: Updater;
}

export function SettingsPage({ data, updater }: SettingsPageProps) {
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

      <div className="settings-page__heading">
        <h1>Application</h1>
        <p>Version and updates of RoadPilot.</p>
      </div>
      <div className="settings-page__grid">
        <UpdateCard updater={updater} />
      </div>
    </div>
  );
}
