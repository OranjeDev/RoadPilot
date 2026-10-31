import { isNewerVersion } from "./version";

/** Error codes sent by the Rust updater commands (src-tauri/src/updater.rs). */
export type UpdateErrorCode =
  | "notConfigured"
  | "network"
  | "releaseNotFound"
  | "unsupportedPlatform"
  | "invalidSignature"
  | "invalidState"
  | "other";

export interface UpdateError {
  code: UpdateErrorCode;
  message: string;
}

export interface AvailableUpdate {
  version: string;
  currentVersion: string;
  notes: string | null;
  /** Publish date, RFC 3339. */
  date: string | null;
}

export interface UpdaterInfo {
  currentVersion: string;
  configured: boolean;
  /** True on Windows: the installer closes RoadPilot and starts it again by itself. */
  installerRestartsApp: boolean;
}

/** Which step failed; decides what "Try again" does. */
export type UpdateStep = "check" | "download" | "install";

export type UpdateStatus =
  /** Waiting for the installed version and configuration. */
  | { kind: "loading" }
  /** Running outside the desktop app, e.g. `npm run dev` in a browser. */
  | { kind: "unavailable" }
  /** This build has no update source (local and demo builds). */
  | { kind: "notConfigured" }
  /** Configured, but no check has run yet. */
  | { kind: "idle" }
  | { kind: "checking"; manual: boolean }
  | { kind: "upToDate"; checkedAt: number; manual: boolean }
  | { kind: "available"; update: AvailableUpdate }
  | {
      kind: "downloading";
      update: AvailableUpdate;
      downloadedBytes: number;
      totalBytes: number | null;
    }
  | { kind: "readyToInstall"; update: AvailableUpdate }
  | { kind: "installing"; update: AvailableUpdate }
  /** Installed; RoadPilot must restart to use it. */
  | { kind: "installed"; update: AvailableUpdate }
  | {
      kind: "error";
      step: UpdateStep;
      error: UpdateError;
      manual: boolean;
      /** The update the failed download or install belonged to. */
      update: AvailableUpdate | null;
    };

export interface UpdateState {
  currentVersion: string | null;
  installerRestartsApp: boolean;
  status: UpdateStatus;
}

export const initialUpdateState: UpdateState = {
  currentVersion: null,
  installerRestartsApp: false,
  status: { kind: "loading" },
};

export type UpdateAction =
  | { type: "infoLoaded"; info: UpdaterInfo }
  | { type: "desktopUnavailable" }
  | { type: "checkStarted"; manual: boolean }
  | { type: "checkSucceeded"; update: AvailableUpdate | null; manual: boolean; now: number }
  | { type: "checkFailed"; error: UpdateError; manual: boolean }
  | { type: "downloadStarted" }
  | { type: "downloadSize"; totalBytes: number | null }
  | { type: "downloadProgress"; chunkBytes: number }
  | { type: "downloadFinished" }
  | { type: "downloadFailed"; error: UpdateError }
  | { type: "installStarted" }
  | { type: "installSucceeded" }
  | { type: "installFailed"; error: UpdateError };

/** States in which a new check may start. */
export function canCheck(status: UpdateStatus): boolean {
  return ["idle", "upToDate", "available", "error"].includes(status.kind);
}

/** States in which an update operation is running and must not be interrupted. */
export function isBusy(status: UpdateStatus): boolean {
  return ["checking", "downloading", "installing"].includes(status.kind);
}

export function updateReducer(state: UpdateState, action: UpdateAction): UpdateState {
  const { status } = state;
  const next = (newStatus: UpdateStatus): UpdateState => ({ ...state, status: newStatus });

  switch (action.type) {
    case "infoLoaded":
      return {
        currentVersion: action.info.currentVersion,
        installerRestartsApp: action.info.installerRestartsApp,
        status: action.info.configured ? { kind: "idle" } : { kind: "notConfigured" },
      };

    case "desktopUnavailable":
      return { ...initialUpdateState, status: { kind: "unavailable" } };

    case "checkStarted":
      return canCheck(status) ? next({ kind: "checking", manual: action.manual }) : state;

    case "checkSucceeded": {
      if (status.kind !== "checking") return state;
      const { update } = action;
      // Never offer a version that is not newer than the installed one.
      const installed = state.currentVersion ?? update?.currentVersion ?? "";
      if (update && isNewerVersion(update.version, installed)) {
        return next({ kind: "available", update });
      }
      return next({ kind: "upToDate", checkedAt: action.now, manual: action.manual });
    }

    case "checkFailed":
      if (status.kind !== "checking") return state;
      if (action.error.code === "notConfigured") return next({ kind: "notConfigured" });
      return next({
        kind: "error",
        step: "check",
        error: action.error,
        manual: action.manual,
        update: null,
      });

    case "downloadStarted": {
      const update = updateOf(status);
      const canStart =
        status.kind === "available" || (status.kind === "error" && status.step === "download");
      if (!canStart || !update) return state;
      return next({ kind: "downloading", update, downloadedBytes: 0, totalBytes: null });
    }

    case "downloadSize":
      if (status.kind !== "downloading") return state;
      return next({ ...status, totalBytes: action.totalBytes });

    case "downloadProgress":
      if (status.kind !== "downloading") return state;
      return next({ ...status, downloadedBytes: status.downloadedBytes + action.chunkBytes });

    case "downloadFinished":
      if (status.kind !== "downloading") return state;
      return next({ kind: "readyToInstall", update: status.update });

    case "downloadFailed":
      if (status.kind !== "downloading") return state;
      return next({
        kind: "error",
        step: "download",
        error: action.error,
        manual: true,
        update: status.update,
      });

    case "installStarted":
      if (status.kind !== "readyToInstall") return state;
      return next({ kind: "installing", update: status.update });

    case "installSucceeded":
      if (status.kind !== "installing") return state;
      return next({ kind: "installed", update: status.update });

    case "installFailed":
      if (status.kind !== "installing") return state;
      return next({
        kind: "error",
        step: "install",
        error: action.error,
        manual: true,
        update: status.update,
      });
  }
}

/** The update a status refers to, if any. */
export function updateOf(status: UpdateStatus): AvailableUpdate | null {
  switch (status.kind) {
    case "available":
    case "downloading":
    case "readyToInstall":
    case "installing":
    case "installed":
      return status.update;
    case "error":
      return status.update;
    default:
      return null;
  }
}

/** Download progress in percent, or null while the size is unknown. */
export function downloadPercent(status: UpdateStatus): number | null {
  if (status.kind !== "downloading" || !status.totalBytes) return null;
  return Math.min(100, Math.round((status.downloadedBytes / status.totalBytes) * 100));
}

const ERROR_MESSAGES: Record<UpdateErrorCode, string> = {
  notConfigured: "Update checks are not set up for this build.",
  network:
    "RoadPilot could not reach the update server. Check your internet connection and try again.",
  releaseNotFound: "No published release was found on the update server yet.",
  unsupportedPlatform: "The latest release has no installer for this system.",
  invalidSignature: "The update could not be verified, so it was not installed.",
  invalidState: "The update is no longer ready. Please check for updates again.",
  other: "Something went wrong with the update.",
};

/** Short, user-facing explanation of an update error. */
export function describeError(error: UpdateError): string {
  return ERROR_MESSAGES[error.code];
}
