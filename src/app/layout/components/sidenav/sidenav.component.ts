import { Component, inject } from '@angular/core';
import { ISideMenuItem } from '../../models/side-menu-item.interface';
import { SidenavItemComponent } from './sidenav-item/sidenav-item.component';
import { MatNavList, MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { AuthService } from '../../../auth/services/auth.service';

const COMPONENTS = [
  SidenavItemComponent
]

const MATERIAL_MODULES = [
  MatNavList,
  MatListItem,
  MatIcon,
  MatDivider
];

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    COMPONENTS,
    ...MATERIAL_MODULES
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {

  private readonly authService = inject(AuthService);

  menuItems: ISideMenuItem[] = [
    {
      id: 1,
      title: 'Inicio',
      icon: 'home',
      url: 'home'
    },
    {
      id: 2,
      title: 'Tasks',
      icon: 'task',
      url: '/main/task'
    }
  ]

  logout(): void {
    this.authService.logout();
  }
}
