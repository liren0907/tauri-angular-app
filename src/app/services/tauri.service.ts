import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';

@Injectable({
  providedIn: 'root'
})
export class TauriService {

  constructor() { }

  /**
   * Calls the Rust backend to get video information using ffprobe
   * @param filename Path to the video file
   * @returns Promise with video information in JSON format
   */
  async getVideoInfo(filename: string): Promise<any> {
    try {
      const result = await invoke('get_video_info', { filename });
      return typeof result === 'string' ? JSON.parse(result) : result;
    } catch (error) {
      console.error('Error getting video info:', error);
      throw error;
    }
  }

  /**
   * Example of calling the greet function from Rust
   * @param name Name to greet
   * @returns Promise with greeting message
   */
  async greet(name: string): Promise<string> {
    return await invoke('greet', { name });
  }

  async openFileDialog(): Promise<string> {
    return await invoke('open_file_dialog');
  }

  async readVideoFile(filePath: string): Promise<string> {
    return await invoke('read_video_file', { file_path: filePath });
  }

  async readImageFile(filePath: string): Promise<string> {
    return await invoke('read_image_file', { file_path: filePath });
  }

  async readFileContent(filePath: string): Promise<string> {
    return await invoke('read_file_content', { file_path: filePath });
  }

  async apiHealth(): Promise<any> {
    return await invoke('api_health');
  }

  async apiSendMessage(request: any): Promise<any> {
    return await invoke('api_send_message', { request });
  }

  async apiListModels(): Promise<string[]> {
    return await invoke('api_list_models');
  }

  async apiCreateSession(model: string, title: string): Promise<any> {
    return await invoke('api_create_session', { model, title });
  }

  async apiListSessions(): Promise<any[]> {
    return await invoke('api_list_sessions');
  }

  async apiGetSession(sessionId: string): Promise<any> {
    return await invoke('api_get_session', { session_id: sessionId });
  }

  async apiDeleteSession(sessionId: string): Promise<any> {
    return await invoke('api_delete_session', { session_id: sessionId });
  }

  async apiGetConversationMemory(sessionId: string): Promise<any> {
    return await invoke('api_get_conversation_memory', { session_id: sessionId });
  }

  async apiClearConversationMemory(sessionId: string): Promise<any> {
    return await invoke('api_clear_conversation_memory', { session_id: sessionId });
  }

  async apiSwitchModel(sessionId: string, model: string): Promise<any> {
    return await invoke('api_switch_model', { session_id: sessionId, model });
  }

  async apiInitializeAgent(): Promise<any> {
    return await invoke('api_initialize_agent');
  }

  async apiGetAgentStatus(): Promise<any> {
    return await invoke('api_get_agent_status');
  }

  async apiSendAgentMessage(request: any): Promise<any> {
    return await invoke('api_send_agent_message', { request });
  }

  async apiGetAnalyticsOverview(): Promise<any> {
    return await invoke('api_get_analytics_overview');
  }

  async apiGetTopSkills(limit: number): Promise<any> {
    return await invoke('api_get_top_skills', { limit });
  }

  async apiGetCommunities(): Promise<any> {
    return await invoke('api_get_communities');
  }

  async apiGetSkillDistribution(): Promise<any> {
    return await invoke('api_get_skill_distribution');
  }

  async apiGetAllPeople(limit: number): Promise<any> {
    return await invoke('api_get_all_people', { limit });
  }

  async apiGetAllSkills(): Promise<any> {
    return await invoke('api_get_all_skills');
  }

  async apiLanggraphStatus(): Promise<any> {
    return await invoke('api_langgraph_status');
  }

  async apiLanggraphChat(request: any): Promise<any> {
    return await invoke('api_langgraph_chat', { request });
  }

  async apiLanggraphRag(request: any): Promise<any> {
    return await invoke('api_langgraph_rag', { request });
  }

  async apiLanggraphReact(request: any): Promise<any> {
    return await invoke('api_langgraph_react', { request });
  }

  async apiLanggraphSequential(request: any): Promise<any> {
    return await invoke('api_langgraph_sequential', { request });
  }
}