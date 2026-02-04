import { Routes } from "@angular/router";
import { AuthenticatedGuard, AuthGuard } from "./auth/guards";

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        canActivate: [AuthenticatedGuard],
        loadChildren: () =>
            import('./auth/auth.routes').then(m => m.routes)
    },
    {
        path: 'main',
        canActivate: [AuthGuard],
        loadChildren: () =>
            import('./modules/main.routes').then(m => m.routes)
    },
    {
        path: '**',
        redirectTo: 'auth/login'
    }
];
