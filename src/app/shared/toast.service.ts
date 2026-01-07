import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration: number;
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private toasts$ = new BehaviorSubject<Toast[]>([]);
    private idCounter = 0;

    get toasts() {
        return this.toasts$.asObservable();
    }

    show(message: string, type: Toast['type'] = 'info', duration: number = 3000): void {
        const id = ++this.idCounter;
        const toast: Toast = { id, message, type, duration };

        this.toasts$.next([...this.toasts$.value, toast]);

        if (duration > 0) {
            setTimeout(() => this.dismiss(id), duration);
        }
    }

    success(message: string, duration: number = 3000): void {
        this.show(message, 'success', duration);
    }

    error(message: string, duration: number = 3000): void {
        this.show(message, 'error', duration);
    }

    info(message: string, duration: number = 3000): void {
        this.show(message, 'info', duration);
    }

    warning(message: string, duration: number = 3000): void {
        this.show(message, 'warning', duration);
    }

    dismiss(id: number): void {
        this.toasts$.next(this.toasts$.value.filter(t => t.id !== id));
    }

    clear(): void {
        this.toasts$.next([]);
    }
}
