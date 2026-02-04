import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NotificationHttpService } from './notification-http.service';
import { NotificationDto } from '../models';

@Injectable({
    providedIn: 'root'
})
export class NotificationStateService {
    private readonly notificationHttp = inject(NotificationHttpService);

    private notificationsSubject = new BehaviorSubject<NotificationDto[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    notifications$ = this.notificationsSubject.asObservable();
    loading$ = this.loadingSubject.asObservable();

    get notifications(): NotificationDto[] {
        return this.notificationsSubject.value;
    }

    get unreadCount(): number {
        return this.notifications.filter(n => !n.isRead).length;
    }

    loadNotifications(): void {
        this.loadingSubject.next(true);
        this.notificationHttp.getAll().subscribe({
            next: (response) => {
                this.notificationsSubject.next(response.data ?? []);
                this.loadingSubject.next(false);
            },
            error: () => {
                this.loadingSubject.next(false);
            }
        });
    }

    refresh(): void {
        this.loadNotifications();
    }

    markAsRead(id: number): void {
        this.notificationHttp.markAsRead(id).subscribe({
            next: () => {
                const updated = this.notifications.map(n =>
                    n.id === id ? { ...n, isRead: true } : n
                );
                this.notificationsSubject.next(updated);
            }
        });
    }

    markAllAsRead(): void {
        this.notificationHttp.markAllAsRead().subscribe({
            next: () => {
                const updated = this.notifications.map(n => ({ ...n, isRead: true }));
                this.notificationsSubject.next(updated);
            }
        });
    }
}
