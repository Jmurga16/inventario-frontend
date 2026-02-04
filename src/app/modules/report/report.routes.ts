import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/report/report.component')
        .then(m => m.ReportComponent),
    title: 'Reporte'
  }
];
