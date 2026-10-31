import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import "./Card.css";

interface CardProps {
  title: string;
  icon: LucideIcon;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Card({ title, icon: Icon, action, className, children }: CardProps) {
  const classes = className ? `card ${className}` : "card";

  return (
    <section className={classes}>
      <header className="card__header">
        <Icon className="card__icon" size={22} strokeWidth={2} aria-hidden="true" />
        <h2 className="card__title">{title}</h2>
        {action && <div className="card__action">{action}</div>}
      </header>
      <div className="card__body">{children}</div>
    </section>
  );
}
