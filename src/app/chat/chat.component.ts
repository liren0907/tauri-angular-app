import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../shared/icon.component';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  standalone: true,
  selector: 'app-chat',
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="h-full flex flex-col">
      <!-- Messages -->
      <div #scrollContainer class="flex-1 overflow-y-auto space-y-3 mb-4">
        <!-- Empty -->
        <div *ngIf="messages.length === 0" class="h-full flex items-center justify-center text-center text-base-content/40">
          <div>
            <div class="w-16 h-16 mx-auto rounded-2xl bg-base-200 border border-base-content/10 flex items-center justify-center mb-3">
              <app-icon name="chat-bubble-left-right" size="lg"></app-icon>
            </div>
            <p class="font-medium">Start a Conversation</p>
            <div class="flex gap-2 mt-4 justify-center">
              <button *ngFor="let s of suggestions" 
                      class="btn btn-sm btn-ghost rounded-xl border border-base-content/10"
                      (click)="send(s)">
                {{ s }}
              </button>
            </div>
          </div>
        </div>

        <!-- Messages -->
        <div *ngFor="let msg of messages" 
             class="flex gap-3"
             [class.flex-row-reverse]="msg.role === 'user'">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
               [class.bg-primary]="msg.role === 'user'"
               [class.bg-secondary]="msg.role === 'assistant'">
            <app-icon [name]="msg.role === 'user' ? 'user' : 'cpu-chip'" class="text-white" size="sm"></app-icon>
          </div>
          <div class="max-w-[70%] p-3 rounded-2xl border"
               [ngClass]="{
                 'bg-primary text-white border-primary rounded-tr-md': msg.role === 'user',
                 'bg-base-200 border-base-content/10 rounded-tl-md': msg.role === 'assistant'
               }">
            {{ msg.content }}
          </div>
        </div>

        <!-- Typing -->
        <div *ngIf="isTyping" class="flex gap-3">
          <div class="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
            <app-icon name="cpu-chip" class="text-white" size="sm"></app-icon>
          </div>
          <div class="p-3 rounded-2xl rounded-tl-md bg-base-200 border border-base-content/10">
            <span class="loading loading-dots loading-sm"></span>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="flex gap-2">
        <input type="text" 
               [(ngModel)]="input" 
               placeholder="Type a message..."
               class="input input-bordered flex-1 rounded-xl"
               (keyup.enter)="send()"
               [disabled]="isTyping">
        <button class="btn btn-primary rounded-xl" 
                (click)="send()" 
                [disabled]="!input.trim() || isTyping">
          <app-icon name="paper-airplane" size="sm"></app-icon>
        </button>
      </div>
    </div>
  `
})
export class ChatComponent implements AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  messages: Message[] = [];
  input = '';
  isTyping = false;
  suggestions = ['Hello!', 'What can you do?', 'Tell me more'];

  private responses = [
    "Hello! I'm your AI assistant. How can I help you today?",
    "I can help you with many tasks. What would you like to know?",
    "That's a great question! Let me explain.",
    "Thanks for asking! Here's what I think..."
  ];

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    }
  }

  send(text?: string) {
    const content = text || this.input.trim();
    if (!content || this.isTyping) return;

    this.messages.push({ role: 'user', content });
    this.input = '';
    this.isTyping = true;

    setTimeout(() => {
      this.messages.push({
        role: 'assistant',
        content: this.responses[Math.floor(Math.random() * this.responses.length)]
      });
      this.isTyping = false;
    }, 800 + Math.random() * 800);
  }
}
