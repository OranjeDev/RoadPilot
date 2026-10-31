import { CircleArrowUp, X } from "lucide-react";
import type { Updater } from "../../updates/useUpdater";
import { updateOf, type UpdateStatus } from "../../updates/updateState";
import { UpdateActions } from "./UpdateActions";
import "./Updates.css";

/** The dashboard notice is only shown while a real update is found or being installed. */
function isNoticeStatus(status: UpdateStatus): boolean {
  switch (status.kind) {
    case "available":
    case "downloading":
    case "readyToInstall":
    case "installing":
    case "installed":
      return true;
    case "error":
      return status.step !== "check";
    default:
      return false;
  }
}

interface UpdateNoticeProps {
  updater: Updater;
}

/** Compact update strip at the top of the dashboard. Hidden when there is no update. */
export function UpdateNotice({ updater }: UpdateNoticeProps) {
  const { status, currentVersion } = updater.state;
  const update = updateOf(status);
  if (!isNoticeStatus(status) || !update || updater.noticeDismissed) return null;

  return (
    <section className="update-notice" aria-label="App update">
      <CircleArrowUp className="update-notice__icon" size={22} strokeWidth={2} aria-hidden="true" />
      <div className="update-notice__text">
        <strong>{status.kind === "installed" ? "Update installed" : "Update available"}</strong>
        <span className="update-notice__versions">
          Installed {currentVersion ?? update.currentVersion} · New {update.version}
        </span>
      </div>
      <div className="update-notice__actions">
        <UpdateActions updater={updater} />
      </div>
      {status.kind === "available" && (
        <button
          type="button"
          className="update-notice__dismiss"
          aria-label="Hide update notice"
          title="Later"
          onClick={updater.dismissNotice}
        >
          <X size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      )}
    </section>
  );
}
