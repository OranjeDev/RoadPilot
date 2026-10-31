import type { LucideIcon } from "lucide-react";
import type { Feature } from "../../types/dashboard";
import { Badge } from "./Badge";
import { Toggle } from "./Toggle";
import "./ToggleRow.css";

interface ToggleRowProps {
  icon: LucideIcon;
  feature: Feature;
}

/** One feature with its switch. Planned features are dimmed and their switch is disabled. */
export function ToggleRow({ icon: Icon, feature }: ToggleRowProps) {
  const planned = feature.availability === "planned";

  return (
    <li className={planned ? "toggle-row toggle-row--planned" : "toggle-row"}>
      <Icon className="toggle-row__icon" size={20} strokeWidth={2} aria-hidden="true" />
      <span className="toggle-row__label">
        {feature.label}
        {planned && <Badge variant="planned" />}
      </span>
      <Toggle checked={feature.enabled} label={feature.label} disabled={planned} />
    </li>
  );
}
