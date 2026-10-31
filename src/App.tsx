import { Dashboard } from "./components/dashboard/Dashboard";
import { Header } from "./components/layout/Header";
import { mockDashboard } from "./data/mockDashboard";
import "./App.css";

export function App() {
  return (
    <div className="app">
      <Header dataSource={mockDashboard.dataSource} />
      <main className="app__main">
        <Dashboard data={mockDashboard} />
      </main>
    </div>
  );
}
