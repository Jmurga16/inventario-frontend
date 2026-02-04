import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models';
import { LowStockReportData } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ReportHttpService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/Report`;

  getLowStockData(): Observable<ApiResponse<LowStockReportData>> {
    return this.http.get<ApiResponse<LowStockReportData>>(`${this.apiUrl}/low-stock`);
  }

  getLowStockPdf(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/low-stock/pdf`, {
      responseType: 'blob'
    });
  }
}
