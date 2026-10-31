import { useEffect, useState } from "react";
import type { DashboardData } from "../types/dashboard";
import { DEMO_TIME_SCALE, createDemoDrive, stepDemoDrive, toDashboardData } from "./demoDrive";

const TICK_MS = 500;

/** Runs the simulated demo drive and returns dashboard data that updates every tick. */
export function useDemoDrive(base: DashboardData): DashboardData {
  const [state, setState] = useState(() => createDemoDrive(base));

  useEffect(() => {
    const dtS = (TICK_MS / 1000) * DEMO_TIME_SCALE;
    const timer = window.setInterval(() => {
      setState((current) => stepDemoDrive(current, base, dtS, Math.random));
    }, TICK_MS);
    return () => window.clearInterval(timer);
  }, [base]);

  return toDashboardData(base, state);
}
