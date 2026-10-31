import logoUrl from "../../assets/logo.svg";

/** Original RoadPilot mark (a road running to the horizon as an "A") with the wordmark. */
export function Logo() {
  return (
    <div className="logo">
      <img className="logo__mark" src={logoUrl} width={44} height={44} alt="" />
      <div className="logo__text">
        <span className="logo__word">
          Road<span className="logo__accent">Pilot</span>
        </span>
        <span className="logo__subtitle">Autonomous driving for ETS2</span>
      </div>
    </div>
  );
}
