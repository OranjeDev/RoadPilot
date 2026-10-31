import type { StatusTone } from "../../types/dashboard";
import "./StatusDot.css";

interface StatusDotProps {
  tone: StatusTone;
  pulse?: boolean;
}

export function StatusDot({ tone, pulse = false }: StatusDotProps) {
  const classes = `status-dot status-dot--${tone}${pulse ? " status-dot--pulse" : ""}`;
  return <span className={classes} aria-hidden="true" />;
}
