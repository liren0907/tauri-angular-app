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
      <!-- Info -->
      <div class="card bg-primary/10 rounded-2xl border border-primary/20">
        <div class="card-body p-5 space-y-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <app-icon name="light-bulb" class="text-primary"></app-icon>
            </div>
            <div>
              <p class="text-lg font-semibold">Tauri + Angular Template</p>
              <p class="text-base text-base-content/70">Angular frontend + Rust backend built with the Tauri framework</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="flex items-center justify-between rounded-xl bg-base-100 border border-base-content/10 px-4 py-3">
              <span class="font-medium">UI Component</span>
              <span class="text-base-content/70">DaisyUI</span>
            </div>
            <div class="flex items-center justify-between rounded-xl bg-base-100 border border-base-content/10 px-4 py-3">
              <span class="font-medium">Symbols</span>
              <span class="text-base-content/70">Heroicons</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card bg-base-200 rounded-2xl border border-base-content/10">
        <div class="card-body p-5">
          <h2 class="font-semibold mb-4">Quick Actions</h2>
          <div class="grid grid-cols-3 gap-3">
            <a routerLink="/backend" class="flex flex-col items-center p-4 rounded-xl bg-base-100 border border-base-content/10 hover:border-accent/50 transition-colors">
              <div class="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-2">
                <app-icon name="server" class="text-accent" size="lg"></app-icon>
              </div>
              <span class="text-sm font-medium">Backend</span>
            </a>
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
          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {}
