// Hide the extra console window on Windows release builds.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

//! RoadPilot desktop shell.
//!
//! Hosts the dashboard UI and the in-app updater. Nothing here talks to the game.

#[cfg(desktop)]
mod updater;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(desktop)]
            updater::setup(app);
            #[cfg(not(desktop))]
            let _ = app;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            #[cfg(desktop)]
            updater::updater_info,
            #[cfg(desktop)]
            updater::check_for_update,
            #[cfg(desktop)]
            updater::download_update,
            #[cfg(desktop)]
            updater::install_update,
            #[cfg(desktop)]
            updater::restart_app,
        ])
        .run(tauri::generate_context!())
        .expect("failed to run the RoadPilot application");
}
