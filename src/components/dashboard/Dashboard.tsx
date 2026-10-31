import type { DashboardData } from "../../types/dashboard";
import { AssistancePanel } from "./AssistancePanel";
import { AutopilotSettingsPanel } from "./AutopilotSettingsPanel";
import { CurrentJobPanel } from "./CurrentJobPanel";
import { RouteProgressPanel } from "./RouteProgressPanel";
import { StatusCards } from "./StatusCards";
import { SystemStatusPanel } from "./SystemStatusPanel";
import { VehicleDataPanel } from "./VehicleDataPanel";
import "./Dashboard.css";

interface DashboardProps {
  data: DashboardData;
}

export function Dashboard({ data }: DashboardProps) {
  return (
    <main className="dashboard">
      <StatusCards
        autopilot={data.autopilot}
        speed={data.speed}
        job={data.job}
        route={data.route}
      />

      <div className="dashboard__main">
        <VehicleDataPanel vehicle={data.vehicle} />
        <AutopilotSettingsPanel settings={data.settings} />
        <AssistancePanel systems={data.assistance} />
      </div>

      <div className="dashboard__bottom">
        <CurrentJobPanel job={data.job} />
        <RouteProgressPanel route={data.route} />
        <SystemStatusPanel checks={data.systemChecks} />
      </div>
    </main>
  );
}
