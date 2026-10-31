import { Channel, invoke, isTauri } from "@tauri-apps/api/core";
import type { AvailableUpdate, UpdateError, UpdateErrorCode, UpdaterInfo } from "./updateState";

/** Download progress events sent by the `download_update` command. */
export type DownloadEvent =
  | { event: "started"; data: { contentLength: number | null } }
  | { event: "progress"; data: { chunkLength: number } }
  | { event: "finished" };

/**
 * The updater commands of the Rust backend. All network access, signature
 * checks and installation happen there; this is only the bridge.
 */
export interface UpdaterClient {
  isDesktop(): boolean;
  info(): Promise<UpdaterInfo>;
  check(): Promise<AvailableUpdate | null>;
  download(onEvent: (event: DownloadEvent) => void): Promise<void>;
  install(): Promise<void>;
  restart(): Promise<void>;
}

export const tauriUpdaterClient: UpdaterClient = {
  isDesktop: () => isTauri(),
  info: () => invoke<UpdaterInfo>("updater_info"),
  check: () => invoke<AvailableUpdate | null>("check_for_update"),
  download: async (onEvent) => {
    const channel = new Channel<DownloadEvent>();
    channel.onmessage = onEvent;
    await invoke("download_update", { onEvent: channel });
  },
  install: async () => {
    await invoke("install_update");
  },
  restart: async () => {
    await invoke("restart_app");
  },
};

const ERROR_CODES: readonly UpdateErrorCode[] = [
  "notConfigured",
  "network",
  "releaseNotFound",
  "unsupportedPlatform",
  "invalidSignature",
  "invalidState",
  "other",
];

function isErrorCode(value: unknown): value is UpdateErrorCode {
  return ERROR_CODES.includes(value as UpdateErrorCode);
}

/** Turns whatever a failed command rejected with into an UpdateError. */
export function toUpdateError(reason: unknown): UpdateError {
  if (typeof reason === "object" && reason !== null) {
    const { code, message } = reason as { code?: unknown; message?: unknown };
    if (isErrorCode(code)) {
      return { code, message: typeof message === "string" ? message : "" };
    }
  }
  const message =
    reason instanceof Error ? reason.message : typeof reason === "string" ? reason : "";
  return { code: "other", message };
}
