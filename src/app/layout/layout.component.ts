import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, DestroyRef, inject, Signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatSidenavModule } from '@angular/material/sidenav';
import { map } from 'rxjs';
import { LayoutService } from './services/layout.service';
import { HeaderComponent } from './components/header/header.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { RouterModule } from '@angular/router';

const ANGULAR_MODULES = [
  RouterModule  
];

const COMPONENTS = [
  HeaderComponent,
  SidenavComponent
]

const MATERIAL_MODULES = [
  MatSidenavModule
];

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    ANGULAR_MODULES,
    COMPONENTS,
    ...MATERIAL_MODULES
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

  readonly #breakpointObserver = inject(BreakpointObserver);
  readonly #destroyRef = inject(DestroyRef);
  readonly #layoutService = inject(LayoutService);

  readonly isMobile: Signal<boolean>;
  readonly drawerOpen = this.#layoutService.drawerOpen;


  constructor() {
    this.isMobile = toSignal(
      this.#breakpointObserver
        .observe([Breakpoints.XSmall, Breakpoints.Small])
        .pipe(
          takeUntilDestroyed(this.#destroyRef),
          map(result => result.matches)
        ),
      { initialValue: false }
    );
  }


}
