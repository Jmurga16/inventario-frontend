import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ProductHttpService } from '../../services/product-http.service';
import { CreateProductDto, UpdateProductDto } from '../../models';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSlideToggleModule
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly productService = inject(ProductHttpService);

  isEdit = false;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  productId: number | null = null;

  form = this.fb.group({
    sku: ['', [Validators.required, Validators.maxLength(50)]],
    name: ['', [Validators.required, Validators.maxLength(150)]],
    description: [''],
    categoryId: [null as number | null, [Validators.required, Validators.min(1)]],
    unitPrice: [0, [Validators.required, Validators.min(0)]],
    cost: [null as number | null, [Validators.min(0)]],
    quantity: [0, [Validators.required, Validators.min(0)]],
    minStock: [5, [Validators.required, Validators.min(0)]],
    maxStock: [null as number | null, [Validators.min(0)]],
    isActive: [true]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.productId = Number(idParam);
      this.loadProduct(this.productId);
      this.form.get('sku')?.disable();
      this.form.get('quantity')?.disable();
    }
  }

  loadProduct(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getById(id).subscribe({
      next: (response) => {
        const product = response.data;
        if (!product) {
          this.errorMessage = 'Producto no encontrado';
          this.isLoading = false;
          return;
        }

        this.form.patchValue({
          sku: product.sku,
          name: product.name,
          description: product.description ?? '',
          categoryId: product.categoryId,
          unitPrice: product.unitPrice,
          cost: product.cost ?? null,
          quantity: product.quantity,
          minStock: product.minStock,
          maxStock: product.maxStock ?? null,
          isActive: product.isActive
        });

        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'No se pudo cargar el producto';
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    if (this.isEdit && this.productId !== null) {
      const raw = this.form.getRawValue();
      const dto: UpdateProductDto = {
        name: raw.name?.trim(),
        description: raw.description?.trim() || undefined,
        categoryId: this.toNumber(raw.categoryId),
        unitPrice: this.toNumber(raw.unitPrice),
        cost: raw.cost !== null ? this.toNumber(raw.cost) : undefined,
        minStock: this.toNumber(raw.minStock),
        maxStock: raw.maxStock !== null ? this.toNumber(raw.maxStock) : undefined,
        isActive: !!raw.isActive
      };

      this.productService.update(this.productId, dto).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.snackBar.open('Producto actualizado', 'OK', { duration: 2500 });
          this.router.navigate(['/main/products']);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.error?.message || 'No se pudo actualizar el producto';
        }
      });
      return;
    }

    const raw = this.form.getRawValue();
    const dto: CreateProductDto = {
      sku: raw.sku?.trim(),
      name: raw.name?.trim(),
      description: raw.description?.trim() || undefined,
      categoryId: this.toNumber(raw.categoryId),
      unitPrice: this.toNumber(raw.unitPrice),
      cost: raw.cost !== null ? this.toNumber(raw.cost) : undefined,
      quantity: this.toNumber(raw.quantity),
      minStock: raw.minStock !== null ? this.toNumber(raw.minStock) : undefined,
      maxStock: raw.maxStock !== null ? this.toNumber(raw.maxStock) : undefined
    };

    this.productService.create(dto).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.snackBar.open('Producto creado', 'OK', { duration: 2500 });
        this.router.navigate(['/main/products']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'No se pudo crear el producto';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/main/products']);
  }

  private toNumber(value: number | string | null): number {
    return Number(value ?? 0);
  }

}
