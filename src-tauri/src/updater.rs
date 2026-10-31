//! In-app updates through the official Tauri updater plugin.
//!
//! The updater only runs when the build carries an updater configuration
//! (`plugins.updater` with a public key and at least one endpoint). Release
//! builds get it from `tauri.release.conf.json` plus the public key passed in by
//! the release workflow. Local builds have none: the commands then report
//! `configured: false` and never contact a server, so the app never shows an
//! update that does not exist.
//!
//! Flow for the frontend: `updater_info` -> `check_for_update` ->
//! `download_update` (progress over a channel) -> `install_update`.
//! On Windows the installer closes RoadPilot and starts it again afterwards;
//! on other platforms the frontend asks the user to call `restart_app`.

use std::sync::Mutex;
use std::time::Duration;

use serde::Serialize;
use tauri::{ipc::Channel, App, AppHandle, Manager, State};
use tauri_plugin_updater::{Update, UpdaterExt};
use time::format_description::well_known::Rfc3339;

/// Time limit for fetching the update metadata (`latest.json`).
const CHECK_TIMEOUT: Duration = Duration::from_secs(20);
/// Time limit for downloading the installer.
const DOWNLOAD_TIMEOUT: Duration = Duration::from_secs(15 * 60);

/// An update found by the last check, plus the installer once it is downloaded.
struct PendingUpdate {
    update: Update,
    installer: Option<Vec<u8>>,
}

pub struct UpdaterState {
    configured: bool,
    pending: Mutex<Option<PendingUpdate>>,
}

/// Registers the updater plugin if this build has an updater configuration.
/// Never fails: a missing or broken configuration only disables updates.
pub fn setup(app: &mut App) {
    let config = app.config().plugins.0.get("updater").cloned();
    let mut configured = config.as_ref().is_some_and(has_update_source);

    if configured {
        if let Err(error) = app
            .handle()
            .plugin(tauri_plugin_updater::Builder::new().build())
        {
            eprintln!("RoadPilot: updater disabled, invalid configuration: {error}");
            configured = false;
        }
    }

    app.manage(UpdaterState {
        configured,
        pending: Mutex::new(None),
    });
}

/// True if the updater config has a public key and at least one endpoint.
fn has_update_source(config: &serde_json::Value) -> bool {
    let has_pubkey = config
        .get("pubkey")
        .and_then(serde_json::Value::as_str)
        .is_some_and(|key| !key.trim().is_empty());
    let has_endpoint = config
        .get("endpoints")
        .and_then(serde_json::Value::as_array)
        .is_some_and(|endpoints| !endpoints.is_empty());
    has_pubkey && has_endpoint
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum ErrorCode {
    /// This build has no update source configured.
    NotConfigured,
    /// The update server could not be reached or the download broke off.
    Network,
    /// The update source answered, but there is no published release information.
    ReleaseNotFound,
    /// The release has no installer for this platform.
    UnsupportedPlatform,
    /// The signature did not match; nothing was installed.
    InvalidSignature,
    /// Download or install was requested without a matching earlier step.
    InvalidState,
    /// Anything else, e.g. the installer could not be started.
    Other,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateError {
    code: ErrorCode,
    message: String,
}

impl UpdateError {
    fn new(code: ErrorCode, message: impl Into<String>) -> Self {
        Self {
            code,
            message: message.into(),
        }
    }
}

impl From<tauri_plugin_updater::Error> for UpdateError {
    fn from(error: tauri_plugin_updater::Error) -> Self {
        use tauri_plugin_updater::Error as E;
        let code = match &error {
            E::Reqwest(_) | E::Network(_) | E::Http(_) => ErrorCode::Network,
            E::ReleaseNotFound => ErrorCode::ReleaseNotFound,
            E::TargetNotFound(_)
            | E::TargetsNotFound(_)
            | E::UnsupportedOs
            | E::UnsupportedArch => ErrorCode::UnsupportedPlatform,
            E::Minisign(_)
            | E::Base64(_)
            | E::SignatureUtf8(_)
            | E::SignedVersionMismatch { .. }
            | E::MissingSignedVersion => ErrorCode::InvalidSignature,
            _ => ErrorCode::Other,
        };
        Self::new(code, error.to_string())
    }
}

type CommandResult<T> = Result<T, UpdateError>;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdaterInfo {
    current_version: String,
    configured: bool,
    /// On Windows the installer closes RoadPilot and starts it again by itself.
    installer_restarts_app: bool,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AvailableUpdate {
    version: String,
    current_version: String,
    notes: Option<String>,
    /// Publish date, RFC 3339.
    date: Option<String>,
}

#[derive(Clone, Serialize)]
#[serde(tag = "event", content = "data", rename_all = "camelCase")]
pub enum DownloadEvent {
    #[serde(rename_all = "camelCase")]
    Started {
        content_length: Option<u64>,
    },
    #[serde(rename_all = "camelCase")]
    Progress {
        chunk_length: usize,
    },
    Finished,
}

fn lock(state: &UpdaterState) -> std::sync::MutexGuard<'_, Option<PendingUpdate>> {
    // A poisoned lock only means an earlier command panicked; the data is still usable.
    state
        .pending
        .lock()
        .unwrap_or_else(std::sync::PoisonError::into_inner)
}

fn require_configured(state: &UpdaterState) -> CommandResult<()> {
    if state.configured {
        Ok(())
    } else {
        Err(UpdateError::new(
            ErrorCode::NotConfigured,
            "This build has no update source configured.",
        ))
    }
}

/// Installed version and whether this build can check for updates.
#[tauri::command]
pub fn updater_info(app: AppHandle, state: State<'_, UpdaterState>) -> UpdaterInfo {
    UpdaterInfo {
        current_version: app.package_info().version.to_string(),
        configured: state.configured,
        installer_restarts_app: cfg!(windows),
    }
}

/// Asks the update source for a newer signed release. `None` means up to date.
#[tauri::command]
pub async fn check_for_update(
    app: AppHandle,
    state: State<'_, UpdaterState>,
) -> CommandResult<Option<AvailableUpdate>> {
    require_configured(&state)?;

    let update = app
        .updater_builder()
        .timeout(CHECK_TIMEOUT)
        .build()?
        .check()
        .await?;

    let available = update.as_ref().map(|update| AvailableUpdate {
        version: update.version.clone(),
        current_version: update.current_version.clone(),
        notes: update.body.clone(),
        date: update.date.and_then(|date| date.format(&Rfc3339).ok()),
    });

    *lock(&state) = update.map(|update| PendingUpdate {
        update,
        installer: None,
    });
    Ok(available)
}

/// Downloads the installer of the update found by the last check.
/// The plugin verifies the signature before `install_update` runs it.
#[tauri::command]
pub async fn download_update(
    state: State<'_, UpdaterState>,
    on_event: Channel<DownloadEvent>,
) -> CommandResult<()> {
    require_configured(&state)?;

    let mut update = lock(&state)
        .as_ref()
        .map(|pending| pending.update.clone())
        .ok_or_else(|| {
            UpdateError::new(
                ErrorCode::InvalidState,
                "No update to download. Check again.",
            )
        })?;
    update.timeout = Some(DOWNLOAD_TIMEOUT);

    let mut started = false;
    let installer = update
        .download(
            |chunk_length, content_length| {
                if !started {
                    let _ = on_event.send(DownloadEvent::Started { content_length });
                    started = true;
                }
                let _ = on_event.send(DownloadEvent::Progress { chunk_length });
            },
            || {
                let _ = on_event.send(DownloadEvent::Finished);
            },
        )
        .await?;

    let mut pending = lock(&state);
    match pending.as_mut() {
        // Keep the installer only if no newer check replaced the update meanwhile.
        Some(current) if current.update.version == update.version => {
            current.installer = Some(installer);
            Ok(())
        }
        _ => Err(UpdateError::new(
            ErrorCode::InvalidState,
            "The update changed during the download. Check again.",
        )),
    }
}

/// Verifies and installs the downloaded update.
/// On Windows this closes RoadPilot; the installer starts it again when done.
#[tauri::command]
pub fn install_update(state: State<'_, UpdaterState>) -> CommandResult<()> {
    require_configured(&state)?;

    let pending = lock(&state).take();
    let Some(PendingUpdate {
        update,
        installer: Some(installer),
    }) = pending
    else {
        return Err(UpdateError::new(
            ErrorCode::InvalidState,
            "The update has not been downloaded yet.",
        ));
    };

    update.install(installer)?;
    Ok(())
}

/// Restarts RoadPilot after an update was installed (not needed on Windows).
#[tauri::command]
pub fn restart_app(app: AppHandle) {
    app.restart();
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn update_source_needs_pubkey_and_endpoint() {
        let endpoint = "https://example.invalid/latest.json";
        assert!(has_update_source(
            &json!({ "pubkey": "key", "endpoints": [endpoint] })
        ));
        assert!(!has_update_source(
            &json!({ "pubkey": "", "endpoints": [endpoint] })
        ));
        assert!(!has_update_source(
            &json!({ "pubkey": "   ", "endpoints": [endpoint] })
        ));
        assert!(!has_update_source(
            &json!({ "pubkey": "key", "endpoints": [] })
        ));
        assert!(!has_update_source(&json!({ "endpoints": [endpoint] })));
        assert!(!has_update_source(&json!(null)));
    }

    #[test]
    fn plugin_errors_map_to_codes() {
        use tauri_plugin_updater::Error as E;
        let code = |error: E| UpdateError::from(error).code;

        assert_eq!(code(E::ReleaseNotFound), ErrorCode::ReleaseNotFound);
        assert_eq!(code(E::Network("reset".into())), ErrorCode::Network);
        assert_eq!(
            code(E::TargetNotFound("windows-x86_64".into())),
            ErrorCode::UnsupportedPlatform
        );
        assert_eq!(code(E::MissingSignedVersion), ErrorCode::InvalidSignature);
        assert_eq!(code(E::EmptyEndpoints), ErrorCode::Other);
    }

    #[test]
    fn errors_serialize_for_the_frontend() {
        let error = UpdateError::new(ErrorCode::NotConfigured, "missing");
        assert_eq!(
            serde_json::to_value(error).unwrap(),
            json!({ "code": "notConfigured", "message": "missing" })
        );
    }
}
