import {
  Cog,
  Droplet,
  Fuel,
  Gauge,
  Settings,
  SquareActivity,
  Thermometer,
  type LucideIcon,
} from "lucide-react";
import type { VehicleData } from "../../types/dashboard";
import { formatNumber, percentOf } from "../../utils/format";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { ProgressBar } from "../ui/ProgressBar";
import "./VehicleDataPanel.css";

interface Metric {
  label: string;
  icon: LucideIcon;
  value: string;
  percent?: number;
  barVariant?: "accent" | "amber";
}

function buildMetrics(vehicle: VehicleData): Metric[] {
  return [
    {
      label: "Speed",
      icon: Gauge,
      value: `${vehicle.speedKmh} km/h`,
      percent: percentOf(vehicle.speedKmh, vehicle.speedScaleKmh),
    },
    {
      label: "Engine speed",
      icon: Thermometer,
      value: `${formatNumber(vehicle.rpm)} rpm`,
      percent: percentOf(vehicle.rpm, vehicle.maxRpm),
    },
    {
      label: "Engine load",
      icon: Cog,
      value: `${vehicle.engineLoadPercent} %`,
      percent: vehicle.engineLoadPercent,
      barVariant: "amber",
    },
    { label: "Fuel", icon: Fuel, value: `${vehicle.fuelPercent} %`, percent: vehicle.fuelPercent },
    {
      label: "AdBlue",
      icon: Droplet,
      value: `${vehicle.adBluePercent} %`,
      percent: vehicle.adBluePercent,
    },
    { label: "Gearbox", icon: Settings, value: vehicle.gear },
  ];
}

interface VehicleDataPanelProps {
  vehicle: VehicleData;
}

export function VehicleDataPanel({ vehicle }: VehicleDataPanelProps) {
  return (
    <Card title="Vehicle data" icon={SquareActivity} action={<Badge variant="demo" />}>
      <ul className="metrics">
        {buildMetrics(vehicle).map(({ label, icon: Icon, value, percent, barVariant }) => (
          <li key={label} className="metric">
            <Icon className="metric__icon" size={20} strokeWidth={2} aria-hidden="true" />
            <span className="metric__label">{label}</span>
            <span className="metric__bar">
              {percent !== undefined && (
                <ProgressBar percent={percent} label={label} variant={barVariant ?? "accent"} />
              )}
            </span>
            <span className="metric__value">{value}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
