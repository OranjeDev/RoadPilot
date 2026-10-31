import "./Toggle.css";

interface ToggleProps {
  checked: boolean;
  label: string;
}

/**
 * Visual switch. Phase 1 placeholder: it shows a fixed state and has no handler.
 */
export function Toggle({ checked, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={checked ? "toggle toggle--on" : "toggle"}
    >
      <span className="toggle__thumb" />
    </button>
  );
}
