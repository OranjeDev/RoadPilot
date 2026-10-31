import { Briefcase, CircleGauge, Route, Settings, User, type LucideIcon } from "lucide-react";
import type { GameConnection } from "../../types/dashboard";
import { StatusDot } from "../ui/StatusDot";
import { Logo } from "./Logo";
import "./Header.css";

interface NavItem {
  label: string;
  icon: LucideIcon;
}

const navItems: readonly NavItem[] = [
  { label: "Autopilot", icon: CircleGauge },
  { label: "Route", icon: Route },
  { label: "Jobs", icon: Briefcase },
  { label: "Profile", icon: User },
  { label: "Settings", icon: Settings },
];

/** Phase 1 shows only the dashboard, so the first item is always active. */
const activeNavLabel = "Autopilot";

interface HeaderProps {
  connection: GameConnection;
}

export function Header({ connection }: HeaderProps) {
  const statusText = connection.connected ? "Connected" : "Not connected";

  return (
    <header className="app-header">
      <div className="app-header__brand">
        <Logo />
        <div className="app-header__titles">
          <span className="app-header__name">RoadPilot</span>
          <span className="app-header__subtitle">Autonomous Driving for ETS2</span>
        </div>
      </div>

      <nav className="app-header__nav" aria-label="Main">
        {navItems.map(({ label, icon: Icon }) => {
          const isActive = label === activeNavLabel;
          return (
            <button
              key={label}
              type="button"
              className={isActive ? "nav-item nav-item--active" : "nav-item"}
              aria-current={isActive ? "page" : undefined}
              title={label}
            >
              <Icon size={16} strokeWidth={2} aria-hidden="true" />
              <span className="nav-item__label">{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="app-header__status">
        <div className="connection-pill" title={`${connection.game} ${statusText}`}>
          <StatusDot
            tone={connection.connected ? "success" : "danger"}
            pulse={connection.connected}
          />
          <span className="connection-pill__game">{connection.game}</span>
          <span className="connection-pill__state">{statusText}</span>
        </div>
      </div>
    </header>
  );
}
