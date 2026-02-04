import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response.model';
import { environment } from 'src/environments/environment';

export interface Category {
    id: number;
    name: string;
    isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class CategoryHttpService {

    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/api/Category`;

    getActive(): Observable<ApiResponse<Category[]>> {
        return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/active`);
    }
}
