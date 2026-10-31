import "./Badge.css";

type BadgeVariant = "demo" | "planned";

const badgeText: Record<BadgeVariant, string> = {
  demo: "Demo",
  planned: "Planned",
};

interface BadgeProps {
  variant: BadgeVariant;
}

/** Small pill marking sample data ("Demo") or not-yet-built features ("Planned"). */
export function Badge({ variant }: BadgeProps) {
  return <span className={`badge badge--${variant}`}>{badgeText[variant]}</span>;
}
