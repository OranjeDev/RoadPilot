import {
  CircleAlert,
  CircleArrowUp,
  CircleCheck,
  Info,
  LoaderCircle,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import type { Updater } from "../../updates/useUpdater";
import { canCheck, describeError, updateOf, type UpdateStatus } from "../../updates/updateState";
import { Card } from "../ui/Card";
import { UpdateActions } from "./UpdateActions";
import "./Updates.css";

type Tone = "neutral" | "success" | "accent" | "warning";

interface StatusLine {
  icon: LucideIcon;
  tone: Tone;
  text: string;
  detail?: string;
  spin?: boolean;
}

const timeFormat = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" });

function statusLine(status: UpdateStatus): StatusLine {
  switch (status.kind) {
    case "loading":
      return {
        icon: LoaderCircle,
        tone: "neutral",
        text: "Loading update information…",
        spin: true,
      };
    case "unavailable":
      return {
        icon: Info,
        tone: "neutral",
        text: "Updates are only available in the RoadPilot desktop app.",
      };
    case "notConfigured":
      return {
        icon: Info,
        tone: "neutral",
        text: "Update checks are not set up for this build.",
        detail: "Local and demo builds have no update source. Release builds check automatically.",
      };
    case "idle":
      return {
        icon: Info,
        tone: "neutral",
        text: "RoadPilot checks for updates shortly after start.",
      };
    case "checking":
      return { icon: LoaderCircle, tone: "neutral", text: "Checking for updates…", spin: true };
    case "upToDate":
      return {
        icon: CircleCheck,
        tone: "success",
        text: "RoadPilot is up to date.",
        detail: `Last checked at ${timeFormat.format(status.checkedAt)}.`,
      };
    case "available":
    case "downloading":
    case "readyToInstall":
    case "installing":
      return {
        icon: CircleArrowUp,
        tone: "accent",
        text: `Version ${status.update.version} is available.`,
      };
    case "installed":
      return {
        icon: CircleCheck,
        tone: "success",
        text: `Version ${status.update.version} is installed.`,
      };
    case "error": {
      const update = updateOf(status);
      if (status.step === "check") {
        return {
          icon: CircleAlert,
          tone: "warning",
          text: "Could not check for updates.",
          detail: describeError(status.error),
        };
      }
      return {
        icon: CircleArrowUp,
        tone: "accent",
        text: update ? `Version ${update.version} is available.` : "An update is available.",
      };
    }
  }
}

interface UpdateCardProps {
  updater: Updater;
}

/** "App updates" card: installed version, update status and a manual check. */
export function UpdateCard({ updater }: UpdateCardProps) {
  const { status, currentVersion } = updater.state;
  const line = statusLine(status);
  const LineIcon = line.icon;
  const notes = updateOf(status)?.notes?.trim();
  const showCheckButton = status.kind !== "unavailable" && status.kind !== "notConfigured";
  const checkFailed = status.kind === "error" && status.step === "check";

  return (
    <Card title="App updates" icon={RefreshCw}>
      <div className="update-card">
        <div className="update-card__version">
          <span className="update-card__label">Installed version</span>
          <span className="update-card__value">{currentVersion ?? "—"}</span>
        </div>

        <div className={`update-status update-status--${line.tone}`} aria-live="polite">
          <LineIcon
            className={line.spin ? "update-status__icon update-spin" : "update-status__icon"}
            size={18}
            strokeWidth={2}
            aria-hidden="true"
          />
          <div>
            <p className="update-status__text">{line.text}</p>
            {line.detail && <p className="update-status__detail">{line.detail}</p>}
          </div>
        </div>

        {notes && (
          <div className="update-card__notes">
            <span className="update-card__label">What's new</span>
            <p>{notes}</p>
          </div>
        )}

        <UpdateActions updater={updater} />

        {showCheckButton && (
          <button
            type="button"
            className="update-button update-button--secondary update-card__check"
            onClick={checkFailed ? updater.retry : updater.check}
            disabled={!canCheck(status)}
          >
            <RefreshCw
              className={status.kind === "checking" ? "update-spin" : undefined}
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            {status.kind === "checking"
              ? "Checking…"
              : checkFailed
                ? "Try again"
                : "Check for updates"}
          </button>
        )}
      </div>
    </Card>
  );
}
