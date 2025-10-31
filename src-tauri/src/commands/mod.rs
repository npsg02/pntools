use crate::db;
pub mod blockchain;
pub mod sql;
#[tauri::command]
pub fn greet(name: &str) -> String {
    println!("Hello, {}!", name);
    format!("Hello, {}! You've been greeted from Rust!", name);
    return format!("Hello, {}! You've been greeted from Rust!", name);
}

#[tauri::command]
pub fn put_db(key: &str, value: &str, namespace: Option<&str>) {
    db::put(key, value, namespace);
}

#[tauri::command]
pub fn get_db(key: &str, namespace: Option<&str>) -> String {
    db::get(key, namespace)
}

#[tauri::command]
pub fn get_all_db_keys(namespace: Option<&str>) -> Vec<String> {
    db::get_all(namespace)
}

#[tauri::command]
pub fn remove_key(key: &str, namespace: Option<&str>) {
    db::remove_key(key, namespace)
}
