import { Minus, Plus } from "lucide-react";
import "./Stepper.css";

interface StepperProps {
  value: number;
  unit: string;
  label: string;
}

/** Visual number stepper. Phase 1 placeholder: the buttons have no handlers. */
export function Stepper({ value, unit, label }: StepperProps) {
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button type="button" className="stepper__button" aria-label={`Decrease ${label}`}>
        <Minus size={14} strokeWidth={2.4} aria-hidden="true" />
      </button>
      <span className="stepper__value">
        {value}
        <span className="stepper__unit">{unit}</span>
      </span>
      <button type="button" className="stepper__button" aria-label={`Increase ${label}`}>
        <Plus size={14} strokeWidth={2.4} aria-hidden="true" />
      </button>
    </div>
  );
}
