use crate::dialog_handler::DialogHandler;
use crate::image_handler::ImageHandler;
use crate::video_handler::VideoHandler;
use reqwest;
use serde_json::Value;
use std::fs;

#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
pub fn get_video_info(filename: &str) -> Result<String, String> {
    VideoHandler::get_video_info(filename)
}

#[tauri::command]
pub fn read_video_file(file_path: String) -> Result<String, String> {
    VideoHandler::read_video_file(&file_path)
}

#[tauri::command]
pub fn read_image_file(file_path: String) -> Result<String, String> {
    ImageHandler::read_image_info(&file_path)
}

#[tauri::command]
pub fn read_file_content(file_path: String) -> Result<String, String> {
    match fs::read_to_string(&file_path) {
        Ok(content) => Ok(content),
        Err(e) => Err(format!("Failed to read file: {}", e)),
    }
}

#[tauri::command]
pub fn open_file_dialog() -> Result<String, String> {
    DialogHandler::select_video_file()
}

#[tauri::command]
pub async fn api_health() -> Result<Value, String> {
    let client = reqwest::Client::new();
    match client.get("http://localhost:8000/health").send().await {
        Ok(response) => match response.json::<Value>().await {
            Ok(json) => Ok(json),
            Err(e) => Err(format!("Failed to parse response: {}", e)),
        },
        Err(e) => Err(format!("Request failed: {}", e)),
    }
}

#[tauri::command]
pub async fn api_send_message(request: Value) -> Result<Value, String> {
    let client = reqwest::Client::new();
    match client
        .post("http://localhost:8000/chat")
        .json(&request)
        .send()
        .await
    {
        Ok(response) => match response.json::<Value>().await {
            Ok(json) => Ok(json),
            Err(e) => Err(format!("Failed to parse response: {}", e)),
        },
        Err(e) => Err(format!("Request failed: {}", e)),
    }
}

#[tauri::command]
pub async fn api_list_models() -> Result<Vec<String>, String> {
    let client = reqwest::Client::new();
    match client.get("http://localhost:8000/models").send().await {
        Ok(response) => match response.json::<Vec<String>>().await {
            Ok(models) => Ok(models),
            Err(e) => Err(format!("Failed to parse response: {}", e)),
        },
        Err(e) => Err(format!("Request failed: {}", e)),
    }
}

#[tauri::command]
pub async fn api_create_session(model: String, title: String) -> Result<Value, String> {
    let client = reqwest::Client::new();
    let request_body = serde_json::json!({
        "model": model,
        "title": title
    });
    match client
        .post("http://localhost:8000/sessions")
        .json(&request_body)
        .send()
        .await
    {
        Ok(response) => match response.json::<Value>().await {
            Ok(json) => Ok(json),
            Err(e) => Err(format!("Failed to parse response: {}", e)),
        },
        Err(e) => Err(format!("Request failed: {}", e)),
    }
}

#[tauri::command]
pub async fn api_list_sessions() -> Result<Vec<Value>, String> {
    let client = reqwest::Client::new();
    match client.get("http://localhost:8000/sessions").send().await {
        Ok(response) => match response.json::<Vec<Value>>().await {
            Ok(sessions) => Ok(sessions),
            Err(e) => Err(format!("Failed to parse response: {}", e)),
        },
        Err(e) => Err(format!("Request failed: {}", e)),
    }
}

#[tauri::command]
pub async fn api_get_session(session_id: String) -> Result<Value, String> {
    let client = reqwest::Client::new();
    let url = format!("http://localhost:8000/sessions/{}", session_id);
    match client.get(&url).send().await {
        Ok(response) => match response.json::<Value>().await {
            Ok(json) => Ok(json),
            Err(e) => Err(format!("Failed to parse response: {}", e)),
        },
        Err(e) => Err(format!("Request failed: {}", e)),
    }
}

#[tauri::command]
pub async fn api_delete_session(session_id: String) -> Result<Value, String> {
    let client = reqwest::Client::new();
    let url = format!("http://localhost:8000/sessions/{}", session_id);
    match client.delete(&url).send().await {
        Ok(response) => match response.json::<Value>().await {
            Ok(json) => Ok(json),
            Err(e) => Err(format!("Failed to parse response: {}", e)),
        },
        Err(e) => Err(format!("Request failed: {}", e)),
    }
}

#[tauri::command]
pub async fn api_get_conversation_memory(session_id: String) -> Result<Value, String> {
    let client = reqwest::Client::new();
    let url = format!(
        "http://localhost:8000/sessions/{}/conversation-memory",
        session_id
    );
    match client.get(&url).send().await {
        Ok(response) => match response.json::<Value>().await {
            Ok(json) => Ok(json),
            Err(e) => Err(format!("Failed to parse response: {}", e)),
        },
        Err(e) => Err(format!("Request failed: {}", e)),
    }
}

#[tauri::command]
pub async fn api_clear_conversation_memory(session_id: String) -> Result<Value, String> {
    let client = reqwest::Client::new();
    let url = format!(
        "http://localhost:8000/sessions/{}/conversation-memory",
        session_id
    );
    match client.delete(&url).send().await {
        Ok(response) => match response.json::<Value>().await {
            Ok(json) => Ok(json),
            Err(e) => Err(format!("Failed to parse response: {}", e)),
        },
        Err(e) => Err(format!("Request failed: {}", e)),
    }
}

#[tauri::command]
pub async fn api_switch_model(session_id: String, model: String) -> Result<Value, String> {
    let client = reqwest::Client::new();
    let url = format!("http://localhost:8000/sessions/{}/model", session_id);
    let request_body = serde_json::json!({
        "model": model
    });
    match client.put(&url).json(&request_body).send().await {
        Ok(response) => match response.json::<Value>().await {
            Ok(json) => Ok(json),
            Err(e) => Err(format!("Failed to parse response: {}", e)),
        },
        Err(e) => Err(format!("Request failed: {}", e)),
    }
}

#[tauri::command]
pub async fn api_initialize_agent() -> Result<Value, String> {
    let client = reqwest::Client::new();
    match client
        .post("http://localhost:8000/agent/initialize")
        .send()
        .await
    {
        Ok(response) => match response.json::<Value>().await {
            Ok(json) => Ok(json),
            Err(e) => Err(format!("Failed to parse response: {}", e)),
        },
        Err(e) => Err(format!("Request failed: {}", e)),
    }
}

#[tauri::command]
pub async fn api_get_agent_status() -> Result<Value, String> {
    let client = reqwest::Client::new();
    match client
        .get("http://localhost:8000/agent/status")
        .send()
        .await
    {
        Ok(response) => match response.json::<Value>().await {
            Ok(json) => Ok(json),
            Err(e) => Err(format!("Failed to parse response: {}", e)),
        },
        Err(e) => Err(format!("Request failed: {}", e)),
    }
}

#[tauri::command]
pub async fn api_send_agent_message(request: Value) -> Result<Value, String> {
    let client = reqwest::Client::new();
    match client
        .post("http://localhost:8000/agent/message")
        .json(&request)
        .send()
        .await
    {
        Ok(response) => match response.json::<Value>().await {
            Ok(json) => Ok(json),
            Err(e) => Err(format!("Failed to parse response: {}", e)),
        },
        Err(e) => Err(format!("Request failed: {}", e)),
    }
}

#[tauri::command]
pub async fn api_get_analytics_overview() -> Result<Value, String> {
    let client = reqwest::Client::new();
    match client
        .get("http://localhost:8000/analytics/overview")
        .send()
        .await
    {
        Ok(response) => match response.json::<Value>().await {
            Ok(json) => Ok(json),
            Err(e) => Err(format!("Failed to parse response: {}", e)),
        },
        Err(e) => Err(format!("Request failed: {}", e)),
    }
}

#[tauri::command]
pub async fn api_get_top_skills(limit: usize) -> Result<Value, String> {
    let client = reqwest::Client::new();
    let url = format!("http://localhost:8000/analytics/top-skills?limit={}", limit);
    match client.get(&url).send().await {
        Ok(response) => match response.json::<Value>().await {
            Ok(json) => Ok(json),
            Err(e) => Err(format!("Failed to parse response: {}", e)),
        },
        Err(e) => Err(format!("Request failed: {}", e)),
    }
}

#[tauri::command]
pub async fn api_get_communities() -> Result<Value, String> {
    let client = reqwest::Client::new();
    match client
        .get("http://localhost:8000/analytics/communities")
        .send()
        .await
    {
        Ok(response) => match response.json::<Value>().await {
            Ok(json) => Ok(json),
            Err(e) => Err(format!("Failed to parse response: {}", e)),
        },
        Err(e) => Err(format!("Request failed: {}", e)),
    }
}

#[tauri::command]
pub async fn api_get_skill_distribution() -> Result<Value, String> {
    let client = reqwest::Client::new();
    match client
        .get("http://localhost:8000/analytics/skill-distribution")
        .send()
        .await
    {
        Ok(response) => match response.json::<Value>().await {
            Ok(json) => Ok(json),
            Err(e) => Err(format!("Failed to parse response: {}", e)),
        },
        Err(e) => Err(format!("Request failed: {}", e)),
    }
}

#[tauri::command]
pub async fn api_get_all_people(limit: usize) -> Result<Value, String> {
    let client = reqwest::Client::new();
    let url = format!("http://localhost:8000/analytics/people?limit={}", limit);
    match client.get(&url).send().await {
        Ok(response) => match response.json::<Value>().await {
            Ok(json) => Ok(json),
            Err(e) => Err(format!("Failed to parse response: {}", e)),
        },
        Err(e) => Err(format!("Request failed: {}", e)),
    }
}

#[tauri::command]
pub async fn api_get_all_skills() -> Result<Value, String> {
    let client = reqwest::Client::new();
    match client
        .get("http://localhost:8000/analytics/skills")
        .send()
        .await
    {
        Ok(response) => match response.json::<Value>().await {
            Ok(json) => Ok(json),
            Err(e) => Err(format!("Failed to parse response: {}", e)),
        },
        Err(e) => Err(format!("Request failed: {}", e)),
    }
}

#[tauri::command]
pub async fn api_langgraph_status() -> Result<Value, String> {
    let client = reqwest::Client::new();
    match client
        .get("http://localhost:8000/langgraph/status")
        .send()
        .await
    {
        Ok(response) => match response.json::<Value>().await {
            Ok(json) => Ok(json),
            Err(e) => Err(format!("Failed to parse response: {}", e)),
        },
        Err(e) => Err(format!("Request failed: {}", e)),
    }
}

#[tauri::command]
pub async fn api_langgraph_chat(request: Value) -> Result<Value, String> {
    let client = reqwest::Client::new();
    match client
        .post("http://localhost:8000/langgraph/chat")
        .json(&request)
        .send()
        .await
    {
        Ok(response) => match response.json::<Value>().await {
            Ok(json) => Ok(json),
            Err(e) => Err(format!("Failed to parse response: {}", e)),
        },
        Err(e) => Err(format!("Request failed: {}", e)),
    }
}

#[tauri::command]
pub async fn api_langgraph_rag(request: Value) -> Result<Value, String> {
    let client = reqwest::Client::new();
    match client
        .post("http://localhost:8000/langgraph/rag")
        .json(&request)
        .send()
        .await
    {
        Ok(response) => match response.json::<Value>().await {
            Ok(json) => Ok(json),
            Err(e) => Err(format!("Failed to parse response: {}", e)),
        },
        Err(e) => Err(format!("Request failed: {}", e)),
    }
}

#[tauri::command]
pub async fn api_langgraph_react(request: Value) -> Result<Value, String> {
    let client = reqwest::Client::new();
    match client
        .post("http://localhost:8000/langgraph/react")
        .json(&request)
        .send()
        .await
    {
        Ok(response) => match response.json::<Value>().await {
            Ok(json) => Ok(json),
            Err(e) => Err(format!("Failed to parse response: {}", e)),
        },
        Err(e) => Err(format!("Request failed: {}", e)),
    }
}

#[tauri::command]
pub async fn api_langgraph_sequential(request: Value) -> Result<Value, String> {
    let client = reqwest::Client::new();
    match client
        .post("http://localhost:8000/langgraph/sequential")
        .json(&request)
        .send()
        .await
    {
        Ok(response) => match response.json::<Value>().await {
            Ok(json) => Ok(json),
            Err(e) => Err(format!("Failed to parse response: {}", e)),
        },
        Err(e) => Err(format!("Request failed: {}", e)),
    }
}
