// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::sync::{Arc, Mutex};
use tauri::Manager;

mod commands;
pub mod db;
mod events;
mod menus;
pub mod modules;

// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

fn main() {
    let python_server = Arc::new(Mutex::new(modules::python::PythonServer::new()));

    tauri::Builder::default()
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_websocket::init())
        .invoke_handler(tauri::generate_handler![
            commands::greet,
            commands::put_db,
            commands::get_db,
            commands::get_all_db_keys,
            commands::remove_key,
            commands::blockchain::init_blockchain_command,
            commands::blockchain::add_block_command,
            commands::blockchain::get_blocks_command,
            commands::sql::execute_sql_query,
            commands::sql::export_to_csv,
            commands::sql::export_to_json,
        ])
        .setup({
            let python_server = Arc::clone(&python_server);
            move |app| {
                // Get main window - in Tauri v2, use webview_windows()
                let main_window = app.get_webview_window("main");

                // listen to the `event-name` (emitted on any window)
                // Note: In Tauri v2, events are handled differently
                // let _id = app.listen("click", |event| {
                //     println!("got event-name with payload {:?}", event.payload());
                // });

                python_server.lock().unwrap().start();

                #[cfg(debug_assertions)] // only include this code on debug builds
                {
                    if let Some(_window) = main_window {
                        // window.open_devtools();
                        // window.close_devtools();
                    }
                }

                Ok(())
            }
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run({
            let python_server = Arc::clone(&python_server);
            move |_app, event| {
                if let tauri::RunEvent::ExitRequested { .. } = event {
                    python_server.lock().unwrap().stop();
                    println!("Stopped listening to the event");
                }
            }
        });
}
