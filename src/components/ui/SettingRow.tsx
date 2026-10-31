import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { IconTile } from "./IconTile";
import "./SettingRow.css";

interface SettingRowProps {
  icon?: LucideIcon;
  label: string;
  description?: string;
  control: ReactNode;
}

/** One labelled line in a settings list, with its control on the right. */
export function SettingRow({ icon, label, description, control }: SettingRowProps) {
  return (
    <li className="setting-row">
      {icon && <IconTile icon={icon} variant="plain" />}
      <div className="setting-row__text">
        <span className="setting-row__label">{label}</span>
        {description && <span className="setting-row__description">{description}</span>}
      </div>
      <div className="setting-row__control">{control}</div>
    </li>
  );
}
