import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import "./Card.css";

interface CardProps {
  title?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Card({ title, icon: Icon, action, className, children }: CardProps) {
  const classes = className ? `card ${className}` : "card";

  return (
    <section className={classes}>
      {title && (
        <header className="card__header">
          <div className="card__title">
            {Icon && (
              <span className="card__title-icon" aria-hidden="true">
                <Icon size={16} strokeWidth={2} />
              </span>
            )}
            <h2>{title}</h2>
          </div>
          {action}
        </header>
      )}
      <div className="card__body">{children}</div>
    </section>
  );
}
