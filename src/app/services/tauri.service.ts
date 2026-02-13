import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';

@Injectable({
  providedIn: 'root'
})
export class TauriService {

  constructor() { }

  async getVideoInfo(filename: string): Promise<any> {
    try {
      const result = await invoke('get_video_info', { filename });
      return typeof result === 'string' ? JSON.parse(result) : result;
    } catch (error) {
      console.error('Error getting video info:', error);
      throw error;
    }
  }
}
