use serde_json::json;
use std::process::Command;

pub struct VideoHandler;

impl VideoHandler {
    pub fn get_video_info(filename: &str) -> Result<String, String> {
        let output = Command::new("ffprobe")
            .args([
                "-v",
                "quiet",
                "-print_format",
                "json",
                "-show_format",
                "-show_streams",
                filename,
            ])
            .output()
            .map_err(|e| e.to_string())?;

        if !output.status.success() {
            return Err("Failed to get video information".into());
        }

        let output_str = String::from_utf8(output.stdout).map_err(|e| e.to_string())?;
        let v: serde_json::Value = serde_json::from_str(&output_str).map_err(|e| e.to_string())?;

        let video_stream = v["streams"]
            .as_array()
            .and_then(|streams| streams.iter().find(|s| s["codec_type"] == "video"))
            .ok_or_else(|| "No video stream found".to_string())?;

        let duration_seconds: f64 = v["format"]["duration"]
            .as_str()
            .and_then(|d| d.parse().ok())
            .unwrap_or(0.0);

        let fps = if let Some(rate) = video_stream["r_frame_rate"].as_str() {
            let parts: Vec<&str> = rate.split('/').collect();
            if parts.len() == 2 {
                let num = parts[0].parse::<f64>().unwrap_or(0.0);
                let den = parts[1].parse::<f64>().unwrap_or(1.0);
                if den > 0.0 {
                    num / den
                } else {
                    0.0
                }
            } else {
                0.0
            }
        } else {
            0.0
        };

        let frame_count = video_stream["nb_frames"]
            .as_str()
            .and_then(|f| f.parse::<i64>().ok())
            .unwrap_or(0);

        let info = json!({
            "duration_seconds": duration_seconds,
            "codec_name": video_stream["codec_name"],
            "codec_str": format!(
                "{}/{}",
                video_stream["codec_name"].as_str().unwrap_or("unknown"),
                video_stream["profile"].as_str().unwrap_or("")
            ),
            "resolution": format!(
                "{}x{}",
                video_stream["width"].as_i64().unwrap_or(0),
                video_stream["height"].as_i64().unwrap_or(0)
            ),
            "frame_count": frame_count,
            "fps": fps
        });

        Ok(info.to_string())
    }

}
