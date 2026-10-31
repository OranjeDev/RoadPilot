import { ClipboardList, Map, MapPin, Settings, User, type LucideIcon } from "lucide-react";
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
  { label: "Maps", icon: Map },
  { label: "Jobs", icon: ClipboardList },
  { label: "Profile", icon: User },
  { label: "Settings", icon: Settings },
];

interface HeaderProps {
  dataSource: DataSource;
  activePage: string;
  onNavigate: (page: string) => void;
}

export function Header({ dataSource, activePage, onNavigate }: HeaderProps) {
  return (
    <header className="app-header">
      <Logo />

      <nav className="nav" aria-label="Main">
        {navItems.map(({ label, icon: Icon }) => {
          const isActive = label === activePage;
          return (
            <button
              key={label}
              type="button"
              className="nav__item"
              aria-current={isActive ? "page" : undefined}
              title={label}
              onClick={() => onNavigate(label)}
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
