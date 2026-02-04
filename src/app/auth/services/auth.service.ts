import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

import { LoginUserDto } from '../models/login-user-dto.class';
import { AuthResponse } from '../models';
import { ApiResponse } from '../../core/models';
import { TokenService } from './token.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);
    private readonly tokenService = inject(TokenService);
    private readonly apiUrl = `${environment.apiUrl}/api/users`;


    login(request: LoginUserDto): Observable<ApiResponse<AuthResponse>> {
        return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, request).pipe(
            tap(response => {
                if (response.data?.token) {
                    this.tokenService.setToken(response.data.token);
                }
            })
        );
    }

    logout(): void {
        this.tokenService.removeToken();
        this.router.navigate(['auth/login']);
    }

}
