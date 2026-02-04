import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReportHttpService } from '../../services/report-http.service';
import { LowStockReportData } from '../../models';
import { Product } from '../../../product/models';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSnackBarModule
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent implements OnInit {
  private readonly reportService = inject(ReportHttpService);
  private readonly snackBar = inject(MatSnackBar);

  data: LowStockReportData | null = null;
  products: Product[] = [];
  displayedColumns = ['sku', 'name', 'category', 'stock', 'minStock', 'status'];
  isLoading = false;
  isDownloading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.reportService.getLowStockData().subscribe({
      next: (response) => {
        this.data = response.data ?? null;
        this.products = this.data?.Products ?? [];
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'No se pudo cargar el reporte';
      }
    });
  }

  downloadPdf(): void {
    this.isDownloading = true;

    this.reportService.getLowStockPdf().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `low-stock-report-${Date.now()}.pdf`;
        anchor.click();
        window.URL.revokeObjectURL(url);
        this.isDownloading = false;
      },
      error: () => {
        this.isDownloading = false;
        this.snackBar.open('No se pudo descargar el PDF', 'OK', { duration: 2500 });
      }
    });
  }

  formatDate(value?: string): string {
    if (!value) return '';
    try {
      return new Date(value).toLocaleString('es-ES', {
        dateStyle: 'short',
        timeStyle: 'short'
      });
    } catch {
      return value;
    }
  }
}
