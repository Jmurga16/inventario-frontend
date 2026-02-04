import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatTableModule } from '@angular/material/table';
import { ProductHttpService } from '../../services/product-http.service';
import { CategoryHttpService } from '../../services/category-http.service';
import { Product } from '../../models';
import { AuthService } from '../../../../auth/services/auth.service';

interface Category {
    id: number;
    name: string;
}

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatTableModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatTooltipModule
    ],
    templateUrl: './product-list.component.html',
    styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {

    private readonly productService = inject(ProductHttpService);
    private readonly categoryService = inject(CategoryHttpService);
    private readonly authService = inject(AuthService);
    private readonly snackBar = inject(MatSnackBar);
    private readonly dialog = inject(MatDialog);

    get isAdmin(): boolean {
        return this.authService.hasRole('Admin');
    }

    products: Product[] = [];
    categories: Category[] = [];
    displayedColumns = ['sku', 'name', 'category', 'price', 'quantity', 'status', 'actions'];
    isLoading = false;
    errorMessage = '';

    // Filters
    searchName = '';
    selectedCategoryId: number | null = null;
    showActiveOnly = true;
    showLowStockOnly = false;

    ngOnInit(): void {
        this.loadCategories();
        this.loadProducts();
    }

    loadCategories(): void {
        this.categoryService.getActive().subscribe({
            next: (response) => {
                this.categories = response.data ?? [];
            }
        });
    }

    loadProducts(): void {
        this.isLoading = true;
        this.errorMessage = '';

        const params: any = {};

        if (this.searchName?.trim()) {
            params.search = this.searchName.trim();
        }
        if (this.selectedCategoryId) {
            params.categoryId = this.selectedCategoryId;
        }
        if (this.showActiveOnly) {
            params.isActive = true;
        }
        if (this.showLowStockOnly) {
            params.lowStockOnly = true;
        }

        this.productService.search(params).subscribe({
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

    applyFilters(): void {
        this.loadProducts();
    }

    clearFilters(): void {
        this.searchName = '';
        this.selectedCategoryId = null;
        this.showActiveOnly = true;
        this.showLowStockOnly = false;
        this.loadProducts();
    }

    deleteProduct(product: Product): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                title: 'Confirmar eliminación',
                message: `¿Eliminar "${product.name}"?`
            },
        });

        dialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (!confirmed) return;
            this.productService.delete(product.id).subscribe({
                next: () => {
                    this.loadProducts();
                    this.snackBar.open('Producto eliminado', 'OK', { duration: 2500 });
                },
                error: (error) => {
                    this.errorMessage = error.error?.message || 'No se pudo eliminar el producto';
                }
            });
        });
    }
}
