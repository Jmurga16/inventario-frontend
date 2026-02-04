import { Injectable, signal } from "@angular/core";

@Injectable({
   providedIn: 'root',
})
export class LayoutService {
  readonly drawerOpen = signal(false);
  readonly sidenavOpen = signal(true);

  toggleDrawer(): void {
    this.drawerOpen.update(state => !state);
  }

  closeDrawer(): void {
    this.drawerOpen.set(false);
  }

  toggleSidenav(): void {
    this.sidenavOpen.update(state => !state);
  }

  openSidenav(): void {
    this.sidenavOpen.set(true);
  }

  closeSidenav(): void {
    this.sidenavOpen.set(false);
  }
}
