import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../shared/icon.component';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, IconComponent, RouterLink],
  template: `
    <div class="space-y-5">
      <!-- Stats Row -->
      <div class="grid grid-cols-3 gap-4">
        <div *ngFor="let stat of stats" class="card bg-base-200 rounded-2xl border border-base-content/10">
          <div class="card-body p-4">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <app-icon [name]="stat.icon" class="text-primary"></app-icon>
              </div>
              <div>
                <p class="text-2xl font-bold">{{ stat.value }}</p>
                <p class="text-xs text-base-content/60">{{ stat.label }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-5 gap-4">
        <!-- Quick Actions -->
        <div class="col-span-3 card bg-base-200 rounded-2xl border border-base-content/10">
          <div class="card-body p-5">
            <h2 class="font-semibold mb-4">Quick Actions</h2>
            <div class="grid grid-cols-3 gap-3">
              <a routerLink="/media" class="flex flex-col items-center p-4 rounded-xl bg-base-100 border border-base-content/10 hover:border-primary/50 transition-colors">
                <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                  <app-icon name="play-circle" class="text-primary" size="lg"></app-icon>
                </div>
                <span class="text-sm font-medium">Media</span>
              </a>
              <a routerLink="/chat" class="flex flex-col items-center p-4 rounded-xl bg-base-100 border border-base-content/10 hover:border-secondary/50 transition-colors">
                <div class="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-2">
                  <app-icon name="chat-bubble-left-right" class="text-secondary" size="lg"></app-icon>
                </div>
                <span class="text-sm font-medium">Chat</span>
              </a>
              <a href="#" class="flex flex-col items-center p-4 rounded-xl bg-base-100 border border-base-content/10 hover:border-accent/50 transition-colors">
                <div class="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-2">
                  <app-icon name="cog-6-tooth" class="text-accent" size="lg"></app-icon>
                </div>
                <span class="text-sm font-medium">Settings</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Activity -->
        <div class="col-span-2 card bg-base-200 rounded-2xl border border-base-content/10">
          <div class="card-body p-5">
            <h2 class="font-semibold mb-4">Recent Activity</h2>
            <ul class="space-y-3">
              <li *ngFor="let item of activities" class="flex items-center gap-3 text-sm">
                <div class="w-8 h-8 rounded-lg bg-base-100 border border-base-content/10 flex items-center justify-center">
                  <app-icon [name]="item.icon" size="sm" class="text-base-content/60"></app-icon>
                </div>
                <span class="flex-1">{{ item.text }}</span>
                <span class="text-xs text-base-content/40">{{ item.time }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Info -->
      <div class="card bg-primary/10 rounded-2xl border border-primary/20">
        <div class="card-body p-4 flex-row items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <app-icon name="light-bulb" class="text-primary"></app-icon>
          </div>
          <div>
            <p class="font-medium">Tauri + Angular Template</p>
            <p class="text-sm text-base-content/60">A modern desktop app starter with DaisyUI</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {
  stats = [
    { label: 'Files', value: '128', icon: 'folder' },
    { label: 'Media', value: '45', icon: 'film' },
    { label: 'Chats', value: '12', icon: 'chat-bubble-left' }
  ];

  activities = [
    { text: 'Video playback', icon: 'play-circle', time: '2m ago' },
    { text: 'Chat started', icon: 'chat-bubble-left', time: '5m ago' },
    { text: 'File opened', icon: 'folder-open', time: '1h ago' }
  ];
}
