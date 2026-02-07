// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use angular_app_lib::commands;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            commands::greet,
            commands::open_file_dialog,
            commands::get_video_info,
            commands::read_video_file,
            commands::read_image_file,
            commands::read_file_content,
            commands::api_health,
            commands::api_send_message,
            commands::api_list_models,
            commands::api_create_session,
            commands::api_list_sessions,
            commands::api_get_session,
            commands::api_delete_session,
            commands::api_get_conversation_memory,
            commands::api_clear_conversation_memory,
            commands::api_switch_model,
            commands::api_initialize_agent,
            commands::api_get_agent_status,
            commands::api_send_agent_message,
            commands::api_get_analytics_overview,
            commands::api_get_top_skills,
            commands::api_get_communities,
            commands::api_get_skill_distribution,
            commands::api_get_all_people,
            commands::api_get_all_skills,
            commands::api_langgraph_status,
            commands::api_langgraph_chat,
            commands::api_langgraph_rag,
            commands::api_langgraph_react,
            commands::api_langgraph_sequential
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
