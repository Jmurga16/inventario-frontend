import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/product-list/product-list.component')
        .then(m => m.ProductListComponent),
    title: 'Productos'
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/product-form/product-form.component')
        .then(m => m.ProductFormComponent),
    title: 'Nuevo Producto'
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/product-form/product-form.component')
        .then(m => m.ProductFormComponent),
    title: 'Editar Producto'
  }
];
