import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { StatusTone } from "../../types/dashboard";
import "./StatCard.css";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  /** Orange icon instead of the default dark one. */
  accentIcon?: boolean;
  /** Colors the value, e.g. green for "Ready". */
  valueTone?: StatusTone;
  badge?: ReactNode;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  detail,
  accentIcon = false,
  valueTone,
  badge,
}: StatCardProps) {
  const iconClass = accentIcon ? "stat-card__icon stat-card__icon--accent" : "stat-card__icon";
  const valueClass = valueTone
    ? `stat-card__value stat-card__value--${valueTone}`
    : "stat-card__value";

  return (
    <section className="stat-card" aria-label={label}>
      <Icon className={iconClass} size={40} strokeWidth={1.9} aria-hidden="true" />
      <div className="stat-card__text">
        <span className="stat-card__label">
          {label}
          {badge}
        </span>
        <span className={valueClass}>{value}</span>
        <span className="stat-card__detail">{detail}</span>
      </div>
    </section>
  );
}
