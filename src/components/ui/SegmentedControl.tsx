import "./SegmentedControl.css";

interface SegmentedControlProps<T extends string> {
  options: readonly T[];
  value: T;
  label: string;
}

/** Visual option picker. Phase 1 placeholder: the selection is fixed. */
export function SegmentedControl<T extends string>({
  options,
  value,
  label,
}: SegmentedControlProps<T>) {
  return (
    <div className="segmented" role="radiogroup" aria-label={label}>
      {options.map((option) => {
        const selected = option === value;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            className={
              selected ? "segmented__option segmented__option--selected" : "segmented__option"
            }
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
