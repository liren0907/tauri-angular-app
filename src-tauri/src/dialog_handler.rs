pub struct DialogHandler;

impl DialogHandler {
    pub fn select_video_file() -> Result<String, String> {
        if let Some(file) = rfd::FileDialog::new()
            .add_filter("Video Files", &["mp4", "mov", "avi", "mkv"])
            .pick_file()
        {
            let file_path = file.to_string_lossy().to_string();
            Ok(file_path)
        } else {
            Err("No file selected".into())
        }
    }
}