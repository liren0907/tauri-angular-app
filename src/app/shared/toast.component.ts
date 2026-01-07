import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from './toast.service';
import { IconComponent } from './icon.component';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule, IconComponent],
    template: `
    <div class="toast toast-end toast-bottom z-[9999]">
      <div *ngFor="let toast of toasts$ | async" 
           class="alert shadow-lg"
           [ngClass]="getAlertClass(toast.type)">
        <app-icon [name]="getIcon(toast.type)" size="sm"></app-icon>
        <span>{{ toast.message }}</span>
        <button class="btn btn-ghost btn-xs" (click)="dismiss(toast.id)">✕</button>
      </div>
    </div>
  `
})
export class ToastComponent {
    toasts$ = this.toastService.toasts;

    constructor(private toastService: ToastService) { }

    getAlertClass(type: Toast['type']): string {
        const classes: Record<string, string> = {
            'success': 'alert-success',
            'error': 'alert-error',
            'info': 'alert-info',
            'warning': 'alert-warning'
        };
        return classes[type] || 'alert-info';
    }

    getIcon(type: Toast['type']): string {
        const icons: Record<string, string> = {
            'success': 'check-circle',
            'error': 'x-circle',
            'info': 'information-circle',
            'warning': 'exclamation-circle'
        };
        return icons[type] || 'information-circle';
    }

    dismiss(id: number): void {
        this.toastService.dismiss(id);
    }
}
