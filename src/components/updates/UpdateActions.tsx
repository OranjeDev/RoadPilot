import { Download, LoaderCircle, RotateCcw, RefreshCw } from "lucide-react";
import type { Updater } from "../../updates/useUpdater";
import { describeError, downloadPercent } from "../../updates/updateState";
import { formatMegabytes } from "../../utils/format";
import { ProgressBar } from "../ui/ProgressBar";
import "./Updates.css";

interface UpdateActionsProps {
  updater: Updater;
}

/**
 * Download, progress, install and restart controls for a found update.
 * Renders nothing when no update is in progress.
 */
export function UpdateActions({ updater }: UpdateActionsProps) {
  const { state } = updater;
  const { status, installerRestartsApp } = state;

  switch (status.kind) {
    case "available":
      return (
        <div className="update-actions">
          <button type="button" className="update-button" onClick={updater.download}>
            <Download size={16} strokeWidth={2} aria-hidden="true" />
            Download update
          </button>
        </div>
      );

    case "downloading": {
      const percent = downloadPercent(status);
      const amount =
        status.totalBytes !== null
          ? `${formatMegabytes(status.downloadedBytes)} of ${formatMegabytes(status.totalBytes)}`
          : formatMegabytes(status.downloadedBytes);
      return (
        <div className="update-progress" aria-live="polite">
          <div className="update-progress__label">
            <span>Downloading version {status.update.version}…</span>
            <span>{percent !== null ? `${percent} % · ${amount}` : amount}</span>
          </div>
          <ProgressBar percent={percent ?? 0} label="Update download" />
        </div>
      );
    }

    case "readyToInstall":
      return (
        <div className="update-actions">
          <p className="update-text">
            {installerRestartsApp
              ? "Download complete. RoadPilot will close, install the update and start again by itself."
              : "Download complete. The update is ready to install."}
          </p>
          <button type="button" className="update-button" onClick={updater.install}>
            <RefreshCw size={16} strokeWidth={2} aria-hidden="true" />
            {installerRestartsApp ? "Install and restart" : "Install update"}
          </button>
        </div>
      );

    case "installing":
      return (
        <p className="update-text update-text--busy" aria-live="polite">
          <LoaderCircle className="update-spin" size={16} strokeWidth={2} aria-hidden="true" />
          {installerRestartsApp
            ? "Installing… RoadPilot closes in a moment and starts again afterwards."
            : "Installing…"}
        </p>
      );

    case "installed":
      return (
        <div className="update-actions">
          <p className="update-text">
            Version {status.update.version} is installed. Restart RoadPilot to start using it.
          </p>
          <button type="button" className="update-button" onClick={updater.restart}>
            <RotateCcw size={16} strokeWidth={2} aria-hidden="true" />
            Restart now
          </button>
        </div>
      );

    case "error":
      if (status.step === "check") return null;
      return (
        <div className="update-actions" role="alert">
          <p className="update-text update-text--error">
            {status.step === "download" ? "Download failed. " : "Installation failed. "}
            {describeError(status.error)}
          </p>
          <button
            type="button"
            className="update-button update-button--secondary"
            onClick={updater.retry}
          >
            <RotateCcw size={16} strokeWidth={2} aria-hidden="true" />
            Try again
          </button>
        </div>
      );

    default:
      return null;
  }
}
