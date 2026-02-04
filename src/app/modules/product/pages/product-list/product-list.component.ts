import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { ProductHttpService } from '../../services/product-http.service';
import { Product } from '../../models';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {

  private readonly productService = inject(ProductHttpService);
  private readonly snackBar = inject(MatSnackBar);

  products: Product[] = [];
  displayedColumns = ['sku', 'name', 'category', 'price', 'quantity', 'status', 'actions'];
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getAll().subscribe({
      next: (response) => {
        this.products = response.data ?? [];
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'No se pudieron cargar los productos';
      }
    });
  }

  deleteProduct(product: Product): void {
    const confirmed = confirm(`¿Eliminar "${product.name}"?`);
    if (!confirmed) return;

    this.productService.delete(product.id).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== product.id);
        this.snackBar.open('Producto eliminado', 'OK', { duration: 2500 });
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'No se pudo eliminar el producto';
      }
    });
  }

}
