import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { IconTile } from "./IconTile";
import "./StatCard.css";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  unit?: string;
  detail: ReactNode;
  footer?: ReactNode;
}

export function StatCard({ icon, label, value, unit, detail, footer }: StatCardProps) {
  return (
    <section className="stat-card" aria-label={label}>
      <div className="stat-card__top">
        <IconTile icon={icon} size="lg" />
        <div className="stat-card__content">
          <span className="stat-card__label">{label}</span>
          <span className="stat-card__value">
            {value}
            {unit && <span className="stat-card__unit">{unit}</span>}
          </span>
        </div>
      </div>
      <div className="stat-card__detail">{detail}</div>
      {footer}
    </section>
  );
}
