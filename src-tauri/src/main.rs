// Hide the extra console window on Windows release builds.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

//! RoadPilot desktop shell.
//!
//! Phase 1 only hosts the dashboard UI. There are no commands, plugins or
//! background services, and nothing here talks to the game.

fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("failed to run the RoadPilot application");
}
