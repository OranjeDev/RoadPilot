import type { ReactNode } from "react";
import type { StatusTone } from "../../types/dashboard";
import "./Badge.css";

interface BadgeProps {
  tone: StatusTone;
  children: ReactNode;
}

export function Badge({ tone, children }: BadgeProps) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}
