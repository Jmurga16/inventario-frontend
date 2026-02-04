import { Component, OnInit, inject, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { AuthService } from '../../../auth/services/auth.service';
import { NotificationStateService } from '../../../core/services';
import { AsyncPipe } from '@angular/common';

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
        ...MATERIAL_MODULES,
        AsyncPipe
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

    readonly isMobile = input<boolean>(false);
    private readonly authService = inject(AuthService);
    readonly notificationState = inject(NotificationStateService);

    toggleMenu = output<void>();
    showLogo = signal<boolean>(true);

    menuItems = [
        { id: 1, text: 'Cerrar sesion', icon: 'logout', action: () => this.logout() },
    ];

    get unreadCount(): number {
        return this.notificationState.unreadCount;
    }

    ngOnInit(): void {
        this.notificationState.loadNotifications();
    }

    onToggleMenu() {
        this.toggleMenu.emit();
        this.showLogo.set(!this.showLogo());
    }

    markAllAsRead(): void {
        this.notificationState.markAllAsRead();
    }

    markAsRead(id: number): void {
        this.notificationState.markAsRead(id);
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
