import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../shared/icon.component';
import { ToastService } from '../shared/toast.service';
import { TauriService } from '../services/tauri.service';
import { open } from '@tauri-apps/plugin-dialog';
import { convertFileSrc } from '@tauri-apps/api/core';

@Component({
  standalone: true,
  imports: [CommonModule, IconComponent],
  selector: 'app-media-viewer',
  template: `
    <div class="h-full flex flex-col gap-4">
      <!-- Controls -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <button class="btn btn-primary btn-outline rounded-xl gap-3 border border-primary/40 hover:border-primary hover:bg-primary/10 shadow-sm hover:shadow-md transition-all px-5 py-2.5 text-base font-semibold" (click)="selectFile()" [disabled]="isLoading">
            <app-icon name="folder-open" size="sm"></app-icon>
            Open File
          </button>
          <button *ngIf="src" class="btn btn-ghost rounded-xl gap-2" (click)="clear()">
            <app-icon name="trash" size="sm"></app-icon>
            Clear
          </button>
        </div>
        <span *ngIf="fileName" class="text-sm text-base-content/60">{{ fileName }}</span>
      </div>

      <!-- Player -->
      <div class="w-full max-w-[min(92vw,720px)] inline-flex flex-col gap-3 items-center md:items-start">
        <div class="bg-base-200 rounded-2xl p-4 inline-flex items-center justify-center w-full">
          <video *ngIf="src && isVideo" controls class="max-h-full max-w-full rounded-xl border border-base-content/10">
            <source [src]="src" [type]="fileType">
          </video>
          <img *ngIf="src && isImage" [src]="src" [alt]="fileName || 'Image preview'" class="max-h-full max-w-full rounded-xl object-contain border border-base-content/10">
          
          <div *ngIf="!src" class="w-full aspect-video min-h-[160px] sm:min-h-[200px] rounded-2xl bg-base-100 border border-base-content/10 flex items-center justify-center text-center text-base-content/50">
            <div>
              <div class="w-16 h-16 mx-auto rounded-2xl bg-base-200 border border-base-content/10 flex items-center justify-center mb-3">
                <app-icon name="film" size="lg"></app-icon>
              </div>
              <p class="font-medium">No Media Selected</p>
              <p class="text-sm mt-1">Click "Open File" to play</p>
            </div>
          </div>
        </div>

        <div *ngIf="isVideo || isImage" class="bg-base-100 rounded-xl border border-base-content/10 px-3 py-2.5 shadow-sm w-full">
          <div class="flex items-center gap-2 text-primary font-semibold text-sm mb-2">
            <app-icon name="information-circle" class="w-4 h-4"></app-icon>
            <span>{{ isVideo ? 'Video Information' : 'Image Information' }}</span>
          </div>
          <div *ngIf="isDetailsLoading" class="flex flex-col items-center justify-center py-3 gap-2">
            <span class="loading loading-spinner loading-md text-primary"></span>
            <span class="text-xs text-base-content/60">
              {{ isVideo ? 'Analyzing video via ffprobe...' : 'Reading image details...' }}
            </span>
          </div>
          <div *ngIf="!isDetailsLoading && detailsInfo" class="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
            <div *ngFor="let key of getObjectKeys(detailsInfo)" class="flex items-center justify-between gap-3 px-2 py-1 rounded-md hover:bg-base-200/60">
              <span class="font-semibold opacity-70 truncate">{{ key }}</span>
              <span class="font-mono text-primary truncate">{{ detailsInfo[key] }}</span>
            </div>
          </div>
          <div *ngIf="!isDetailsLoading && !detailsInfo" class="alert text-xs py-2">
            <app-icon name="information-circle" class="w-4 h-4"></app-icon>
            <span>Select a media file to view detailed information.</span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3 p-3 bg-base-200 rounded-xl border border-base-content/10 text-sm">
        <app-icon name="information-circle" class="text-info"></app-icon>
        <span class="text-base-content/60">Supports common video and image formats</span>
      </div>
    </div>
  `
})
export class MediaViewerComponent {
  src: string | null = null;
  fileName: string | null = null;
  fileType = '';
  isVideo = false;
  isImage = false;
  isLoading = false;
  isDetailsLoading = false;
  videoInfo: any = null;
  formattedVideoInfo: any = null;
  formattedImageInfo: any = null;
  detailsInfo: any = null;

  constructor(private toast: ToastService, private tauriService: TauriService) { }

  async selectFile() {
    try {
      const selected = await open({
        multiple: false,
        filters: [{
          name: 'Media',
          extensions: ['mp4', 'mov', 'avi', 'mkv', 'webm', 'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp']
        }]
      });

      if (selected === null) return;
      const filePath = selected as string;
      this.clear();

      const pathParts = filePath.split(/[\\\/]/);
      this.fileName = pathParts[pathParts.length - 1];
      const extension = this.fileName.split('.').pop()?.toLowerCase() || '';
      const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
      const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'];
      this.isVideo = videoExtensions.includes(extension);
      this.isImage = imageExtensions.includes(extension);

      if (!this.isVideo && !this.isImage) {
        this.toast.error('Unsupported file type');
        return;
      }

      this.src = convertFileSrc(filePath);
      this.fileType = this.isVideo ? `video/${extension}` : `image/${extension}`;

      if (this.isVideo) {
        this.isLoading = true;
        this.isDetailsLoading = true;
        try {
          this.videoInfo = await this.tauriService.getVideoInfo(filePath);
          this.formattedVideoInfo = this.formatVideoInfo(this.videoInfo);
          this.detailsInfo = this.formattedVideoInfo;
        } catch (error) {
          this.toast.error('Failed to get video information');
        } finally {
          this.isLoading = false;
          this.isDetailsLoading = false;
        }
      }

      if (this.isImage) {
        this.isDetailsLoading = true;
        const img = new Image();
        img.onload = () => {
          this.formattedImageInfo = this.formatImageInfo(extension, img.naturalWidth, img.naturalHeight);
          this.detailsInfo = this.formattedImageInfo;
          this.isDetailsLoading = false;
        };
        img.onerror = () => {
          this.toast.error('Failed to read image information');
          this.isDetailsLoading = false;
        };
        img.src = this.src;
      }

      this.toast.success(`Loaded: ${this.fileName}`);
    } catch (error) {
      this.toast.error('Error selecting file');
      this.isLoading = false;
    }
  }

  clear() {
    this.src = null;
    this.fileName = null;
    this.fileType = '';
    this.isVideo = false;
    this.isImage = false;
    this.isLoading = false;
    this.isDetailsLoading = false;
    this.videoInfo = null;
    this.formattedVideoInfo = null;
    this.formattedImageInfo = null;
    this.detailsInfo = null;
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
    } catch {
      return {};
    }
  }

  formatImageInfo(extension: string, width: number, height: number): any {
    return {
      Format: extension.toUpperCase(),
      Resolution: `${width} x ${height}`,
      Type: `image/${extension === 'jpg' ? 'jpeg' : extension}`
    };
  }

  getObjectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}
