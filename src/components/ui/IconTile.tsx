import type { LucideIcon } from "lucide-react";
import "./IconTile.css";

interface IconTileProps {
  icon: LucideIcon;
  variant?: "soft" | "plain";
  size?: "sm" | "lg";
}

export function IconTile({ icon: Icon, variant = "soft", size = "sm" }: IconTileProps) {
  return (
    <span className={`icon-tile icon-tile--${variant} icon-tile--${size}`} aria-hidden="true">
      <Icon size={size === "lg" ? 22 : 16} strokeWidth={2} />
    </span>
  );
}
