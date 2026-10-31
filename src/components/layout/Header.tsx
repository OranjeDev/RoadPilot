import { ClipboardList, MapPin, Settings, User, type LucideIcon } from "lucide-react";
import type { DataSource } from "../../types/dashboard";
import { SteeringWheel } from "../icons/SteeringWheel";
import { DataSourceSelector } from "./DataSourceSelector";
import { Logo } from "./Logo";
import "./Header.css";

interface NavItem {
  label: string;
  icon: LucideIcon;
}

const navItems: readonly NavItem[] = [
  { label: "Autopilot", icon: SteeringWheel },
  { label: "Route", icon: MapPin },
  { label: "Jobs", icon: ClipboardList },
  { label: "Profile", icon: User },
  { label: "Settings", icon: Settings },
];

/** Only the dashboard exists so far, so the first item is always active. */
const activeNavLabel = "Autopilot";

interface HeaderProps {
  dataSource: DataSource;
}

export function Header({ dataSource }: HeaderProps) {
  return (
    <header className="app-header">
      <Logo />

      <nav className="nav" aria-label="Main">
        {navItems.map(({ label, icon: Icon }) => {
          const isActive = label === activeNavLabel;
          return (
            <button
              key={label}
              type="button"
              className="nav__item"
              aria-current={isActive ? "page" : undefined}
              title={label}
            >
              <Icon size={24} strokeWidth={1.8} aria-hidden="true" />
              <span className="nav__label">{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="app-header__spacer" />

      <DataSourceSelector source={dataSource} />
    </header>
  );
}
