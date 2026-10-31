import type { UpdaterClient } from "./updaterClient";
import { toUpdateError } from "./updaterClient";
import type { UpdateAction } from "./updateState";

/**
 * The update steps as plain async functions. They call the backend and report
 * every state change through `dispatch`, so they can be tested without React.
 */

type Dispatch = (action: UpdateAction) => void;

/** Loads the installed version and configuration. Resolves to true if checks are possible. */
export async function loadUpdaterInfo(client: UpdaterClient, dispatch: Dispatch): Promise<boolean> {
  if (!client.isDesktop()) {
    dispatch({ type: "desktopUnavailable" });
    return false;
  }
  try {
    const info = await client.info();
    dispatch({ type: "infoLoaded", info });
    return info.configured;
  } catch {
    // An old or broken backend without updater commands: treat like "not available".
    dispatch({ type: "desktopUnavailable" });
    return false;
  }
}

export async function checkForUpdate(
  client: UpdaterClient,
  dispatch: Dispatch,
  manual: boolean,
  now: () => number = Date.now,
): Promise<void> {
  dispatch({ type: "checkStarted", manual });
  try {
    const update = await client.check();
    dispatch({ type: "checkSucceeded", update, manual, now: now() });
  } catch (reason) {
    dispatch({ type: "checkFailed", error: toUpdateError(reason), manual });
  }
}

export async function downloadUpdate(client: UpdaterClient, dispatch: Dispatch): Promise<void> {
  dispatch({ type: "downloadStarted" });
  try {
    await client.download((event) => {
      switch (event.event) {
        case "started":
          dispatch({ type: "downloadSize", totalBytes: event.data.contentLength });
          break;
        case "progress":
          dispatch({ type: "downloadProgress", chunkBytes: event.data.chunkLength });
          break;
        case "finished":
          break;
      }
    });
    dispatch({ type: "downloadFinished" });
  } catch (reason) {
    dispatch({ type: "downloadFailed", error: toUpdateError(reason) });
  }
}

/** On Windows the backend closes RoadPilot during this call, so it may never resolve. */
export async function installUpdate(client: UpdaterClient, dispatch: Dispatch): Promise<void> {
  dispatch({ type: "installStarted" });
  try {
    await client.install();
    dispatch({ type: "installSucceeded" });
  } catch (reason) {
    dispatch({ type: "installFailed", error: toUpdateError(reason) });
  }
}
