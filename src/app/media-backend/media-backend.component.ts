import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TauriService } from '../services/tauri.service';
import { open } from '@tauri-apps/plugin-dialog';
import { convertFileSrc } from "@tauri-apps/api/core";
import { ToastService } from '../shared/toast.service';
import { IconComponent } from '../shared/icon.component';

@Component({
    standalone: true,
    imports: [CommonModule, IconComponent],
    selector: 'app-media-backend',
    templateUrl: './media-backend.component.html'
})
export class MediaBackendComponent {
    videoSrc: string | null = null;
    fileName: string | null = null;
    videoInfo: any = null;
    formattedVideoInfo: any = null;
    isLoading: boolean = false;

    constructor(
        private toast: ToastService,
        private tauriService: TauriService
    ) { }

    async handleFileInput(event: Event) {
        const element = event.target as HTMLInputElement;
        const files = element.files;

        if (files && files.length > 0) {
            const file = files[0];
            this.clearVideo();

            this.fileName = file.name;
            this.videoSrc = URL.createObjectURL(file);

            this.toast.success(`Loaded media: ${file.name}`);
        }
    }

    async selectFile() {
        try {
            const selected = await open({
                multiple: false,
                filters: [{
                    name: 'Video',
                    extensions: ['mp4', 'mov', 'avi', 'mkv']
                }]
            });

            if (selected === null) return;

            this.clearVideo();
            const filePath = selected as string;
            this.isLoading = true;

            const pathParts = filePath.split(/[\\\/]/);
            this.fileName = pathParts[pathParts.length - 1];

            this.videoSrc = convertFileSrc(filePath);

            try {
                this.videoInfo = await this.tauriService.getVideoInfo(filePath);
                console.log('Video info:', this.videoInfo);
                this.formattedVideoInfo = this.formatVideoInfo(this.videoInfo);
            } catch (error) {
                console.error('Error getting video info:', error);
                this.toast.error('Failed to get video information');
            }

            this.toast.success(`Loaded media: ${this.fileName}`);
        } catch (error) {
            console.error('Error selecting file:', error);
            this.toast.error('Error selecting file');
        } finally {
            this.isLoading = false;
        }
    }

    clearVideo() {
        if (this.videoSrc && this.videoSrc.startsWith('blob:')) {
            URL.revokeObjectURL(this.videoSrc);
        }
        this.videoSrc = null;
        this.fileName = null;
        this.videoInfo = null;
        this.formattedVideoInfo = null;
        this.toast.info('Media cleared');
    }

    formatVideoInfo(videoInfo: any): any {
        if (!videoInfo) return null;

        try {
            return {
                Codec: videoInfo.codec_name,
                Format: videoInfo.codec_str?.toUpperCase(),
                Duration: `${Math.floor(videoInfo.duration_seconds / 60)}m ${Math.round(videoInfo.duration_seconds % 60)}s`,
                "Frame Rate": `${videoInfo.fps.toFixed(2)} FPS`,
                "Total Frames": videoInfo.frame_count?.toLocaleString(),
                Resolution: videoInfo.resolution
            };
        } catch (e) {
            console.error('Error formatting video info:', e);
            return {};
        }
    }

    // Helper to get keys for the info display loop
    getObjectKeys(obj: any): string[] {
        return obj ? Object.keys(obj) : [];
    }
}
