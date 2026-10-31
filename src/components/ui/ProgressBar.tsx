import "./ProgressBar.css";

interface ProgressBarProps {
  percent: number;
  label: string;
  size?: "sm" | "md";
}

export function ProgressBar({ percent, label, size = "sm" }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div
      className={`progress progress--${size}`}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
    >
      <div className="progress__fill" style={{ width: `${clamped}%` }} />
    </div>
  );
}
