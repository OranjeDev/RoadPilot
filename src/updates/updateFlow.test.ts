import { describe, expect, it } from "vitest";
import { checkForUpdate, downloadUpdate, installUpdate, loadUpdaterInfo } from "./updateFlow";
import { toUpdateError, type DownloadEvent, type UpdaterClient } from "./updaterClient";
import {
  initialUpdateState,
  updateReducer,
  type AvailableUpdate,
  type UpdateAction,
  type UpdateState,
} from "./updateState";

const update: AvailableUpdate = {
  version: "0.2.0",
  currentVersion: "0.1.0",
  notes: null,
  date: null,
};

/** A fake backend; each method can be replaced per test. */
function fakeClient(overrides: Partial<UpdaterClient> = {}): UpdaterClient {
  return {
    isDesktop: () => true,
    info: () =>
      Promise.resolve({ currentVersion: "0.1.0", configured: true, installerRestartsApp: true }),
    check: () => Promise.resolve(null),
    download: () => Promise.resolve(),
    install: () => Promise.resolve(),
    restart: () => Promise.resolve(),
    ...overrides,
  };
}

/** Collects dispatched actions and applies them like useReducer would. */
function store() {
  let state: UpdateState = initialUpdateState;
  const actions: UpdateAction[] = [];
  return {
    dispatch: (action: UpdateAction) => {
      actions.push(action);
      state = updateReducer(state, action);
    },
    get state() {
      return state;
    },
    actions,
  };
}

describe("loadUpdaterInfo", () => {
  it("reports configured builds", async () => {
    const s = store();
    await expect(loadUpdaterInfo(fakeClient(), s.dispatch)).resolves.toBe(true);
    expect(s.state.status.kind).toBe("idle");
    expect(s.state.currentVersion).toBe("0.1.0");
  });

  it("does not call the backend outside the desktop app", async () => {
    const s = store();
    let called = false;
    const client = fakeClient({
      isDesktop: () => false,
      info: () => {
        called = true;
        return Promise.reject(new Error("unreachable"));
      },
    });
    await expect(loadUpdaterInfo(client, s.dispatch)).resolves.toBe(false);
    expect(called).toBe(false);
    expect(s.state.status.kind).toBe("unavailable");
  });

  it("stays stable when the backend has no updater commands", async () => {
    const s = store();
    const client = fakeClient({ info: () => Promise.reject(new Error("unknown command")) });
    await expect(loadUpdaterInfo(client, s.dispatch)).resolves.toBe(false);
    expect(s.state.status.kind).toBe("unavailable");
  });
});

describe("full update flow", () => {
  it("checks, downloads with progress and installs", async () => {
    const s = store();
    const client = fakeClient({
      check: () => Promise.resolve(update),
      download: (onEvent: (event: DownloadEvent) => void) => {
        onEvent({ event: "started", data: { contentLength: 300 } });
        onEvent({ event: "progress", data: { chunkLength: 100 } });
        onEvent({ event: "progress", data: { chunkLength: 200 } });
        onEvent({ event: "finished" });
        return Promise.resolve();
      },
    });

    await loadUpdaterInfo(client, s.dispatch);
    await checkForUpdate(client, s.dispatch, false, () => 42);
    expect(s.state.status).toEqual({ kind: "available", update });

    await downloadUpdate(client, s.dispatch);
    expect(s.actions.filter((a) => a.type === "downloadProgress")).toHaveLength(2);
    expect(s.state.status).toEqual({ kind: "readyToInstall", update });

    await installUpdate(client, s.dispatch);
    expect(s.state.status).toEqual({ kind: "installed", update });
  });

  it("reports up to date when the backend finds nothing", async () => {
    const s = store();
    const client = fakeClient();
    await loadUpdaterInfo(client, s.dispatch);
    await checkForUpdate(client, s.dispatch, true, () => 7);
    expect(s.state.status).toEqual({ kind: "upToDate", checkedAt: 7, manual: true });
  });

  it("turns backend errors into error states", async () => {
    const s = store();
    const client = fakeClient({
      check: () => Promise.reject({ code: "releaseNotFound", message: "no latest.json" }),
    });
    await loadUpdaterInfo(client, s.dispatch);
    await checkForUpdate(client, s.dispatch, true);
    expect(s.state.status).toMatchObject({
      kind: "error",
      step: "check",
      error: { code: "releaseNotFound", message: "no latest.json" },
    });
  });

  it("keeps the update when the download fails", async () => {
    const s = store();
    const client = fakeClient({
      check: () => Promise.resolve(update),
      download: () => Promise.reject({ code: "network", message: "reset" }),
    });
    await loadUpdaterInfo(client, s.dispatch);
    await checkForUpdate(client, s.dispatch, false);
    await downloadUpdate(client, s.dispatch);
    expect(s.state.status).toMatchObject({ kind: "error", step: "download", update });
  });

  it("reports a failed install", async () => {
    const s = store();
    const client = fakeClient({
      check: () => Promise.resolve(update),
      install: () => Promise.reject({ code: "invalidSignature", message: "mismatch" }),
    });
    await loadUpdaterInfo(client, s.dispatch);
    await checkForUpdate(client, s.dispatch, false);
    await downloadUpdate(client, s.dispatch);
    await installUpdate(client, s.dispatch);
    expect(s.state.status).toMatchObject({
      kind: "error",
      step: "install",
      error: { code: "invalidSignature" },
    });
  });
});

describe("toUpdateError", () => {
  it("keeps structured backend errors", () => {
    expect(toUpdateError({ code: "network", message: "timeout" })).toEqual({
      code: "network",
      message: "timeout",
    });
  });

  it("falls back to 'other' for unknown shapes", () => {
    expect(toUpdateError({ code: "somethingNew", message: "x" }).code).toBe("other");
    expect(toUpdateError(new Error("boom"))).toEqual({ code: "other", message: "boom" });
    expect(toUpdateError("plain text")).toEqual({ code: "other", message: "plain text" });
    expect(toUpdateError(undefined)).toEqual({ code: "other", message: "" });
  });
});
