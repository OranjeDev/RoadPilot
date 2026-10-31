import { useState } from "react";
import { Dashboard } from "./components/dashboard/Dashboard";
import { JobsPage } from "./components/dashboard/JobsPage";
import { MapsPage } from "./components/dashboard/MapsPage";
import { SettingsPage } from "./components/dashboard/SettingsPage";
import { Header } from "./components/layout/Header";
import { mockDashboard } from "./data/mockDashboard";
import "./App.css";

export function App() {
  const [activePage, setActivePage] = useState("Autopilot");

  return (
    <div className="app">
      <Header
        dataSource={mockDashboard.dataSource}
        activePage={activePage}
        onNavigate={setActivePage}
      />
      <main className="app__main">
        {activePage === "Settings" ? (
          <SettingsPage data={mockDashboard} />
        ) : activePage === "Maps" ? (
          <MapsPage job={mockDashboard.job} route={mockDashboard.route} />
        ) : activePage === "Jobs" ? (
          <JobsPage initialJob={mockDashboard.job} />
        ) : (
          <Dashboard data={mockDashboard} />
        )}
      </main>
    </div>
  );
}
