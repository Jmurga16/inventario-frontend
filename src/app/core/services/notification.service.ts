import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  private readonly defaultConfig: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'end',
    verticalPosition: 'top'
  };

  /**
   * Muestra un mensaje de éxito
   */
  showSuccess(message: string, action?: string): void {
    this.snackBar.open(message, action || 'Cerrar', {
      ...this.defaultConfig,
      panelClass: ['snackbar-success']
    });
  }

  /**
   * Muestra un mensaje de error
   */
  showError(message: string, action?: string): void {
    this.snackBar.open(message, action || 'Cerrar', {
      ...this.defaultConfig,
      duration: 7000, // Más tiempo para errores
      panelClass: ['snackbar-error']
    });
  }

  /**
   * Muestra un mensaje de advertencia
   */
  showWarning(message: string, action?: string): void {
    this.snackBar.open(message, action || 'Cerrar', {
      ...this.defaultConfig,
      panelClass: ['snackbar-warning']
    });
  }

  /**
   * Muestra un mensaje de información
   */
  showInfo(message: string, action?: string): void {
    this.snackBar.open(message, action || 'Cerrar', {
      ...this.defaultConfig,
      panelClass: ['snackbar-info']
    });
  }

  /**
   * Cierra todos los snackbars abiertos
   */
  dismiss(): void {
    this.snackBar.dismiss();
  }
}