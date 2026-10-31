import { useEffect, useReducer, useRef, useState } from "react";
import { checkForUpdate, downloadUpdate, installUpdate, loadUpdaterInfo } from "./updateFlow";
import { tauriUpdaterClient, type UpdaterClient } from "./updaterClient";
import {
  canCheck,
  initialUpdateState,
  updateOf,
  updateReducer,
  type UpdateState,
} from "./updateState";

/** The startup check waits a moment so it does not compete with the app starting up. */
const STARTUP_CHECK_DELAY_MS = 3000;

export interface Updater {
  state: UpdateState;
  /** Manual check, e.g. from the "Check for updates" button. */
  check: () => void;
  download: () => void;
  install: () => void;
  restart: () => void;
  /** Repeats the step that failed. */
  retry: () => void;
  /** True if the user hid the dashboard notice for the current update ("Later"). */
  noticeDismissed: boolean;
  dismissNotice: () => void;
}

export function useUpdater(client: UpdaterClient = tauriUpdaterClient): Updater {
  const [state, dispatch] = useReducer(updateReducer, initialUpdateState);
  const { status } = state;
  // Hiding is per version and only for this session; a newer version shows the notice again.
  const [dismissedVersion, setDismissedVersion] = useState<string | null>(null);
  const updateVersion = updateOf(status)?.version ?? null;
  // Blocks a second click from starting a step again before React re-renders.
  const runningRef = useRef(false);

  // Load the installed version, then check once in the background.
  useEffect(() => {
    let active = true;
    const guardedDispatch: typeof dispatch = (action) => {
      if (active) dispatch(action);
    };
    let timer: number | undefined;

    void loadUpdaterInfo(client, guardedDispatch).then((configured) => {
      if (!active || !configured) return;
      timer = window.setTimeout(() => {
        void checkForUpdate(client, guardedDispatch, false);
      }, STARTUP_CHECK_DELAY_MS);
    });

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [client]);

  function run(step: () => Promise<void>) {
    if (runningRef.current) return;
    runningRef.current = true;
    void step().finally(() => {
      runningRef.current = false;
    });
  }

  function check() {
    if (canCheck(status)) run(() => checkForUpdate(client, dispatch, true));
  }

  function download() {
    const canDownload =
      status.kind === "available" || (status.kind === "error" && status.step === "download");
    if (canDownload) run(() => downloadUpdate(client, dispatch));
  }

  function install() {
    if (status.kind === "readyToInstall") run(() => installUpdate(client, dispatch));
  }

  function restart() {
    if (status.kind === "installed") void client.restart();
  }

  function retry() {
    if (status.kind !== "error") return;
    // After a failed install the backend has dropped the update, so start over with a check.
    if (status.step === "download") download();
    else check();
  }

  return {
    state,
    check,
    download,
    install,
    restart,
    retry,
    noticeDismissed: updateVersion !== null && updateVersion === dismissedVersion,
    dismissNotice: () => setDismissedVersion(updateVersion),
  };
}
