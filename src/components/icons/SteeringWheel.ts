import { createLucideIcon } from "lucide-react";

/** Steering wheel in Lucide style (Lucide has none). Taken from the original RoadPilot app. */
export const SteeringWheel = createLucideIcon("steering-wheel", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "outer" }],
  ["circle", { cx: "12", cy: "12", r: "2.2", key: "hub" }],
  ["path", { d: "M2.6 10.4c3.2-.9 6.3-1.2 9.4-1.2s6.2.3 9.4 1.2", key: "rim-spoke" }],
  ["path", { d: "M10.2 13.6 7.4 21", key: "left-spoke" }],
  ["path", { d: "M13.8 13.6l2.8 7.4", key: "right-spoke" }],
]);
