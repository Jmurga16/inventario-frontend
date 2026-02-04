import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { IHeaderMenuItem } from '../../../models/header-menu-item.interface';


const MATERIAL_MODULES = [
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
];

@Component({
  selector: 'app-header-menu',
  standalone: true,
  imports: [
    ...MATERIAL_MODULES
  ],
  templateUrl: './header-menu.component.html',
  styleUrl: './header-menu.component.scss'
})
export class HeaderMenuComponent {
  items = input<IHeaderMenuItem[] | null>(null);
  icon = input<string>('more_vert');
}
