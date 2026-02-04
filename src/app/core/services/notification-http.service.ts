import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, NotificationDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class NotificationHttpService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/Notification`;

  getAll(): Observable<ApiResponse<NotificationDto[]>> {
    return this.http.get<ApiResponse<NotificationDto[]>>(this.apiUrl);
  }

  getUnread(): Observable<ApiResponse<NotificationDto[]>> {
    return this.http.get<ApiResponse<NotificationDto[]>>(`${this.apiUrl}/unread`);
  }

  getUnreadCount(): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/unread/count`);
  }

  markAsRead(id: number): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/${id}/read`, {});
  }

  markAllAsRead(): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/read-all`, {});
  }
}
