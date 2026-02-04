import { Component, OnInit, inject, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { AuthService } from '../../../auth/services/auth.service';
import { NotificationHttpService, NotificationService } from '../../../core/services';
import { NotificationDto } from '../../../core/models';

const COMPONENTS = [
  HeaderMenuComponent
];

const MATERIAL_MODULES = [
  MatButtonModule,
  MatIconModule,
  MatToolbarModule,
  MatBadgeModule,
  MatMenuModule,
  MatDividerModule
];

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    COMPONENTS,
    ...MATERIAL_MODULES
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  readonly isMobile = input<boolean>(false);
  private readonly authService = inject(AuthService);
  private readonly notificationHttp = inject(NotificationHttpService);
  private readonly notificationService = inject(NotificationService);

  toggleMenu = output<void>();
  showLogo = signal<boolean>(true);

  menuItems = [
    { id: 1, text: 'Cerrar sesion', icon: 'logout', action: () => this.logout() },
  ];

  notifications: NotificationDto[] = [];

  get unreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationHttp.getAll().subscribe({
      next: (response) => {
        this.notifications = response.data ?? [];
      },
      error: () => {
        this.notificationService.showError('No se pudieron cargar las notificaciones');
      }
    });
  }

  onToggleMenu() {
    this.toggleMenu.emit();
    this.showLogo.set(!this.showLogo());
  }

  markAllAsRead(): void {
    this.notificationHttp.markAllAsRead().subscribe({
      next: () => {
        this.notifications = this.notifications.map(n => ({ ...n, isRead: true }));
      },
      error: () => {
        this.notificationService.showError('No se pudieron actualizar las notificaciones');
      }
    });
  }

  markAsRead(id: number): void {
    this.notificationHttp.markAsRead(id).subscribe({
      next: () => {
        this.notifications = this.notifications.map(n =>
          n.id === id ? { ...n, isRead: true } : n
        );
      },
      error: () => {
        this.notificationService.showError('No se pudo marcar la notificacion');
      }
    });
  }

  formatDate(value: string): string {
    if (!value) return '';
    try {
      return new Date(value).toLocaleString('es-ES', {
        dateStyle: 'short',
        timeStyle: 'short'
      });
    } catch {
      return value;
    }
  }

  logout() {
    this.authService.logout();
  }
}
