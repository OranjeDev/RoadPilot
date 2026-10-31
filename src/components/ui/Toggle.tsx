import "./Toggle.css";

interface ToggleProps {
  checked: boolean;
  label: string;
  disabled?: boolean;
}

/**
 * Visual switch. Placeholder only: it shows a fixed state and has no handler.
 */
export function Toggle({ checked, label, disabled = false }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className="toggle"
      disabled={disabled}
    >
      <span className="toggle__thumb" />
    </button>
  );
}
