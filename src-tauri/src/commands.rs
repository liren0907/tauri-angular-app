use crate::video_handler::VideoHandler;

#[tauri::command]
pub fn get_video_info(filename: &str) -> Result<String, String> {
    VideoHandler::get_video_info(filename)
}
