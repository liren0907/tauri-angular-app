import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { IconComponent } from './shared/icon.component';
import { ToastComponent } from './shared/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, IconComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isDarkMode = true;

  constructor(private router: Router) {
    // Apply saved theme
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme !== 'light';
    this.applyTheme(this.isDarkMode ? 'modern' : 'light');
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme(this.isDarkMode ? 'modern' : 'light');
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  getPageTitle(): string {
    const path = this.router.url;
    if (path.includes('/media')) return 'Media Player';
    if (path.includes('/chat')) return 'AI Chat';
    return 'Dashboard';
  }

  private applyTheme(theme: string) {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
