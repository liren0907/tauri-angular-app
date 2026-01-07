import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../shared/icon.component';
import { ToastService } from '../shared/toast.service';

@Component({
  standalone: true,
  imports: [CommonModule, IconComponent],
  selector: 'app-media-viewer',
  template: `
    <div class="h-full flex flex-col gap-4">
      <!-- Controls -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <input #fileInput type="file" hidden (change)="handleFileInput($event)" accept="video/*,audio/*">
          <button class="btn btn-primary rounded-xl gap-2" (click)="fileInput.click()">
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
      <div class="flex-1 bg-base-200 rounded-2xl border border-base-content/10 overflow-hidden flex items-center justify-center">
        <video *ngIf="src && isVideo" controls class="max-h-full max-w-full rounded-xl">
          <source [src]="src" [type]="fileType">
        </video>
        <audio *ngIf="src && !isVideo" controls class="w-full max-w-md">
          <source [src]="src" [type]="fileType">
        </audio>
        
        <div *ngIf="!src" class="text-center text-base-content/40">
          <div class="w-16 h-16 mx-auto rounded-2xl bg-base-300 border border-base-content/10 flex items-center justify-center mb-3">
            <app-icon name="film" size="lg"></app-icon>
          </div>
          <p class="font-medium">No Media Selected</p>
          <p class="text-sm mt-1">Click "Open File" to play</p>
        </div>
      </div>

      <!-- Info -->
      <div class="flex items-center gap-3 p-3 bg-base-200 rounded-xl border border-base-content/10 text-sm">
        <app-icon name="information-circle" class="text-info"></app-icon>
        <span class="text-base-content/60">Supports MP4, WebM, MP3, WAV and more</span>
      </div>
    </div>
  `
})
export class MediaViewerComponent {
  src: string | null = null;
  fileName: string | null = null;
  fileType = '';
  isVideo = true;

  constructor(private toast: ToastService) { }

  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.clear();
      this.fileName = file.name;
      this.fileType = file.type;
      this.isVideo = file.type.startsWith('video/');
      this.src = URL.createObjectURL(file);
      this.toast.success(`Loaded: ${file.name}`);
    }
  }

  clear() {
    if (this.src) URL.revokeObjectURL(this.src);
    this.src = null;
    this.fileName = null;
  }
}
