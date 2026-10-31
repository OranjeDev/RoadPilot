import { ChevronDown, Gamepad2 } from "lucide-react";
import type { DataSource } from "../../types/dashboard";

interface DataSourceSelectorProps {
  source: DataSource;
}

/** Shows where dashboard values come from. Placeholder only: the menu does not open. */
export function DataSourceSelector({ source }: DataSourceSelectorProps) {
  return (
    <button type="button" className="source-selector" aria-haspopup="menu" aria-expanded={false}>
      <span className="source-selector__icon" aria-hidden="true">
        <Gamepad2 size={20} strokeWidth={2} />
      </span>
      <span className="source-selector__text">
        <span className="source-selector__title">{source.title}</span>
        <span className="source-selector__detail">{source.detail}</span>
      </span>
      <ChevronDown size={18} strokeWidth={2} aria-hidden="true" />
    </button>
  );
}
