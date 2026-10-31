import { useState } from "react";
import { Dashboard } from "./components/dashboard/Dashboard";
import { JobsPage } from "./components/dashboard/JobsPage";
import { MapsPage } from "./components/dashboard/MapsPage";
import { SettingsPage } from "./components/dashboard/SettingsPage";
import { Header } from "./components/layout/Header";
import { mockDashboard } from "./data/mockDashboard";
import { useDemoDrive } from "./demo/useDemoDrive";
import "./App.css";

export function App() {
  const [activePage, setActivePage] = useState("Autopilot");
  const data = useDemoDrive(mockDashboard);

  return (
    <div className="app">
      <Header dataSource={data.dataSource} activePage={activePage} onNavigate={setActivePage} />
      <main className="app__main">
        {activePage === "Settings" ? (
          <SettingsPage data={data} />
        ) : activePage === "Maps" ? (
          <MapsPage job={data.job} route={data.route} speedKmh={data.vehicle.speedKmh} />
        ) : activePage === "Jobs" ? (
          <JobsPage initialJob={mockDashboard.job} />
        ) : (
          <Dashboard data={data} />
        )}
      </main>
    </div>
  );
}
