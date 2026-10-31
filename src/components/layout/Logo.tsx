/** RoadPilot brand mark: a road vanishing into the distance on an orange tile. */
export function Logo() {
  return (
    <svg className="logo" viewBox="0 0 32 32" width="36" height="36" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="var(--color-accent)" />
      <path
        d="M11.5 25 14.6 7M20.5 25 17.4 7"
        fill="none"
        stroke="var(--color-text-on-accent)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M16 23.2v-2.6M16 17.6v-2.2M16 12.6v-1.6"
        fill="none"
        stroke="var(--color-text-on-accent)"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
