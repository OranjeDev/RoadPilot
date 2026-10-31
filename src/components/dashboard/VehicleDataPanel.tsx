import { Activity, Cog, Droplet, Engine, Fuel, Gauge, Truck, type LucideIcon } from "lucide-react";
import type { VehicleData } from "../../types/dashboard";
import { formatNumber, percentOf } from "../../utils/format";
import { Card } from "../ui/Card";
import { IconTile } from "../ui/IconTile";
import { ProgressBar } from "../ui/ProgressBar";
import "./VehicleDataPanel.css";

interface Metric {
  label: string;
  icon: LucideIcon;
  value: string;
  unit?: string;
  detail?: string;
  percent?: number;
}

function buildMetrics(vehicle: VehicleData): Metric[] {
  return [
    { label: "Speed", icon: Gauge, value: String(vehicle.speedKmh), unit: "km/h" },
    {
      label: "RPM",
      icon: Activity,
      value: formatNumber(vehicle.rpm),
      unit: "rpm",
      percent: percentOf(vehicle.rpm, vehicle.maxRpm),
    },
    {
      label: "Engine Load",
      icon: Engine,
      value: String(vehicle.engineLoadPercent),
      unit: "%",
      percent: vehicle.engineLoadPercent,
    },
    {
      label: "Fuel",
      icon: Fuel,
      value: formatNumber(vehicle.fuelLiters),
      unit: "L",
      detail: `${percentOf(vehicle.fuelLiters, vehicle.fuelCapacityLiters)}%`,
      percent: percentOf(vehicle.fuelLiters, vehicle.fuelCapacityLiters),
    },
    {
      label: "AdBlue",
      icon: Droplet,
      value: String(vehicle.adBluePercent),
      unit: "%",
      percent: vehicle.adBluePercent,
    },
    {
      label: "Transmission",
      icon: Cog,
      value: vehicle.gear,
      detail: vehicle.transmissionMode,
    },
  ];
}

interface VehicleDataPanelProps {
  vehicle: VehicleData;
}

export function VehicleDataPanel({ vehicle }: VehicleDataPanelProps) {
  const metrics = buildMetrics(vehicle);

  return (
    <Card title="Vehicle Data" icon={Truck}>
      <ul className="metric-list">
        {metrics.map((metric) => (
          <li key={metric.label} className="metric">
            <IconTile icon={metric.icon} variant="plain" />
            <div className="metric__body">
              <div className="metric__line">
                <span className="metric__label">{metric.label}</span>
                <span className="metric__value">
                  {metric.value}
                  {metric.unit && <span className="metric__unit">{metric.unit}</span>}
                  {metric.detail && <span className="metric__detail">{metric.detail}</span>}
                </span>
              </div>
              {metric.percent !== undefined && (
                <ProgressBar percent={metric.percent} label={metric.label} />
              )}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
