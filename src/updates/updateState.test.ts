import { describe, expect, it } from "vitest";
import {
  canCheck,
  describeError,
  downloadPercent,
  initialUpdateState,
  updateReducer,
  type AvailableUpdate,
  type UpdateAction,
  type UpdateState,
} from "./updateState";

const update: AvailableUpdate = {
  version: "0.2.0",
  currentVersion: "0.1.0",
  notes: "First public demo release",
  date: "2026-11-15T12:00:00Z",
};

const networkError = { code: "network", message: "connection refused" } as const;

function run(...actions: UpdateAction[]): UpdateState {
  return actions.reduce(updateReducer, initialUpdateState);
}

const configured: UpdateAction = {
  type: "infoLoaded",
  info: { currentVersion: "0.1.0", configured: true, installerRestartsApp: true },
};

describe("updateReducer", () => {
  it("starts loading and keeps the installed version from the backend", () => {
    expect(initialUpdateState.status.kind).toBe("loading");
    const state = run(configured);
    expect(state.currentVersion).toBe("0.1.0");
    expect(state.installerRestartsApp).toBe(true);
    expect(state.status.kind).toBe("idle");
  });

  it("reports builds without an update source as not configured", () => {
    const state = run({
      type: "infoLoaded",
      info: { currentVersion: "0.1.0", configured: false, installerRestartsApp: true },
    });
    expect(state.status.kind).toBe("notConfigured");
    expect(canCheck(state.status)).toBe(false);
    // A check cannot start without an update source.
    expect(updateReducer(state, { type: "checkStarted", manual: true })).toBe(state);
  });

  it("marks the browser preview as unavailable", () => {
    expect(run({ type: "desktopUnavailable" }).status.kind).toBe("unavailable");
  });

  it("goes from checking to up to date", () => {
    const state = run(
      configured,
      { type: "checkStarted", manual: true },
      { type: "checkSucceeded", update: null, manual: true, now: 1000 },
    );
    expect(state.status).toEqual({ kind: "upToDate", checkedAt: 1000, manual: true });
  });

  it("offers a newer update", () => {
    const state = run(
      configured,
      { type: "checkStarted", manual: false },
      { type: "checkSucceeded", update, manual: false, now: 1000 },
    );
    expect(state.status).toEqual({ kind: "available", update });
  });

  it("never offers a version that is not newer than the installed one", () => {
    for (const version of ["0.1.0", "0.0.9", "not-a-version"]) {
      const state = run(
        configured,
        { type: "checkStarted", manual: true },
        { type: "checkSucceeded", update: { ...update, version }, manual: true, now: 1 },
      );
      expect(state.status.kind, version).toBe("upToDate");
    }
  });

  it("turns a failed check into a retryable error", () => {
    const state = run(
      configured,
      { type: "checkStarted", manual: true },
      { type: "checkFailed", error: networkError, manual: true },
    );
    expect(state.status).toEqual({
      kind: "error",
      step: "check",
      error: networkError,
      manual: true,
      update: null,
    });
    expect(canCheck(state.status)).toBe(true);
  });

  it("maps a notConfigured check error to the not configured state", () => {
    const state = run(
      configured,
      { type: "checkStarted", manual: true },
      { type: "checkFailed", error: { code: "notConfigured", message: "" }, manual: true },
    );
    expect(state.status.kind).toBe("notConfigured");
  });

  it("tracks download progress and becomes ready to install", () => {
    const found = run(
      configured,
      { type: "checkStarted", manual: false },
      { type: "checkSucceeded", update, manual: false, now: 1 },
    );
    const downloading = [
      { type: "downloadStarted" },
      { type: "downloadSize", totalBytes: 4_000_000 },
      { type: "downloadProgress", chunkBytes: 1_000_000 },
      { type: "downloadProgress", chunkBytes: 1_000_000 },
    ].reduce<UpdateState>((state, action) => updateReducer(state, action as UpdateAction), found);

    expect(downloading.status).toMatchObject({
      kind: "downloading",
      downloadedBytes: 2_000_000,
      totalBytes: 4_000_000,
    });
    expect(downloadPercent(downloading.status)).toBe(50);

    const ready = updateReducer(downloading, { type: "downloadFinished" });
    expect(ready.status).toEqual({ kind: "readyToInstall", update });
  });

  it("shows no percentage while the download size is unknown", () => {
    const state = run(
      configured,
      { type: "checkStarted", manual: false },
      { type: "checkSucceeded", update, manual: false, now: 1 },
      { type: "downloadStarted" },
      { type: "downloadProgress", chunkBytes: 500 },
    );
    expect(downloadPercent(state.status)).toBeNull();
  });

  it("allows retrying a failed download", () => {
    const failed = run(
      configured,
      { type: "checkStarted", manual: false },
      { type: "checkSucceeded", update, manual: false, now: 1 },
      { type: "downloadStarted" },
      { type: "downloadFailed", error: networkError },
    );
    expect(failed.status).toMatchObject({ kind: "error", step: "download", update });

    const retried = updateReducer(failed, { type: "downloadStarted" });
    expect(retried.status).toMatchObject({ kind: "downloading", downloadedBytes: 0 });
  });

  it("goes through installing to installed", () => {
    const state = run(
      configured,
      { type: "checkStarted", manual: false },
      { type: "checkSucceeded", update, manual: false, now: 1 },
      { type: "downloadStarted" },
      { type: "downloadFinished" },
      { type: "installStarted" },
      { type: "installSucceeded" },
    );
    expect(state.status).toEqual({ kind: "installed", update });
  });

  it("keeps the update after a failed install", () => {
    const state = run(
      configured,
      { type: "checkStarted", manual: false },
      { type: "checkSucceeded", update, manual: false, now: 1 },
      { type: "downloadStarted" },
      { type: "downloadFinished" },
      { type: "installStarted" },
      { type: "installFailed", error: { code: "invalidSignature", message: "bad sig" } },
    );
    expect(state.status).toMatchObject({ kind: "error", step: "install", update });
  });

  it("ignores actions that do not fit the current state", () => {
    const idle = run(configured);
    const ignored: UpdateAction[] = [
      { type: "checkSucceeded", update, manual: true, now: 1 },
      { type: "checkFailed", error: networkError, manual: true },
      { type: "downloadStarted" },
      { type: "downloadProgress", chunkBytes: 10 },
      { type: "downloadFinished" },
      { type: "installStarted" },
      { type: "installSucceeded" },
    ];
    for (const action of ignored) {
      expect(updateReducer(idle, action), action.type).toBe(idle);
    }

    const checking = updateReducer(idle, { type: "checkStarted", manual: true });
    // No second check while one is running.
    expect(updateReducer(checking, { type: "checkStarted", manual: true })).toBe(checking);
  });
});

describe("describeError", () => {
  it("gives a readable message for every error code", () => {
    expect(describeError(networkError)).toMatch(/internet connection/);
    expect(describeError({ code: "releaseNotFound", message: "" })).toMatch(/No published release/);
    expect(describeError({ code: "invalidSignature", message: "" })).toMatch(/not installed/);
  });
});
