
import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { animate, state, style, transition, trigger, } from '@angular/animations';
import { filter } from 'rxjs/internal/operators/filter';

import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from "@angular/material/list";
import { MatTooltip } from "@angular/material/tooltip";

import { SideMenuService } from '../../../services/side-menu.service';
import { ISideMenuItem } from '../../../models/side-menu-item.interface';


const ANGULAR_MODULES = [
  RouterModule
];

const MATERIAL_MODULES = [
  MatListModule,
  MatTooltip,
  MatIconModule
];

@Component({
  selector: 'app-sidenav-item',
  standalone: true,
  imports: [
    ANGULAR_MODULES,
    ...MATERIAL_MODULES
  ],
  templateUrl: './sidenav-item.component.html',
  styleUrl: './sidenav-item.component.scss',
  animations: [
    trigger('smoothCollapse', [
      state('initial', style({
        height: '0',
        overflow: 'hidden',
        opacity: '0',
        visibility: 'hidden',
      })),
      state('final', style({
        overflow: 'hidden',
      })),
      transition('initial<=>final', animate('250ms')),
    ]),
    trigger('rotatedState', [
      state('default', style({ transform: 'rotate(0)' })),
      state('rotated', style({ transform: 'rotate(180deg)' })),
      transition('default <=> rotated', animate('250ms')),
    ]),
  ],
})
export class SidenavItemComponent {

  readonly item = input.required<ISideMenuItem>();

  private readonly _menuService = inject(SideMenuService);
  private readonly _router = inject(Router);

  readonly currentUrl = signal(this._router.url);
  readonly isExpanded = signal<boolean>(false);

  protected readonly hasChildren = computed(() => {
    const menuItem = this.item();
    return menuItem.options && menuItem.options.length > 0;
  });

  protected readonly isActive = computed(() => {
    const menuItem = this.item();
    if (menuItem.baseUrl) {
      return this._router.url.includes(menuItem.baseUrl);
    }
    return menuItem.url ? this.currentUrl().includes(menuItem.url) : false;
  });

  constructor() {
    this._router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.currentUrl.set(this._router.url);
      });
  }

  ngOnInit() {
    if (this.hasChildren() && this.hasActiveChild()) {
      this.isExpanded.set(true);
    }
  }

  protected toggle(event?: Event): void {
    event?.preventDefault();
    this.isExpanded.update(value => !value);
  }

  protected onOptionSelected(): void {
    //console.log('Menu item clicked');
    this._menuService.notifyOptionSelected();
  }

  private hasActiveChild(): boolean {
    const menuItem = this.item();
    return menuItem.options?.some(child =>
      child.url && this._router.url.includes(child.url) ||
      child.baseUrl && this._router.url.includes(child.baseUrl)
    ) ?? false;
  }
}
