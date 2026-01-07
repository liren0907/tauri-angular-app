use crate::dialog_handler::DialogHandler;

#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
pub fn open_file_dialog() -> Result<String, String> {
    DialogHandler::select_video_file()
}
