import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models';
import { ApiResponse } from '../../core/models/api-response.model';
import { TokenService } from './token.service';

interface StoredUser {
    id: number;
    email: string;
    fullName: string;
    roles: string[];
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);
    private readonly tokenService = inject(TokenService);
    private readonly apiUrl = `${environment.apiUrl}/api/auth`;

    login(request: LoginRequest): Observable<ApiResponse<AuthResponse>> {
        return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, request).pipe(
            tap(response => {
                if (response?.data?.token) {
                    this.tokenService.setToken(response.data.token);
                    this.storeUser(response.data);
                }
            })
        );
    }

    register(request: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
        return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/register`, request).pipe(
            tap(response => {
                if (response?.data?.token) {
                    this.tokenService.setToken(response.data.token);
                    this.storeUser(response.data);
                }
            })
        );
    }

    logout(): void {
        this.tokenService.removeToken();
        localStorage.removeItem('user');
        this.router.navigate(['auth/login']);
    }

    isAuthenticated(): boolean {
        return this.tokenService.isAuthenticated();
    }

    getCurrentUser(): StoredUser | null {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch {
                return null;
            }
        }
        return null;
    }

    hasRole(role: string): boolean {
        const user = this.getCurrentUser();
        return user?.roles?.includes(role) ?? false;
    }

    private storeUser(authResponse: AuthResponse): void {
        const user: StoredUser = {
            id: authResponse.userId,
            email: authResponse.email,
            fullName: authResponse.fullName,
            roles: authResponse.roles
        };
        localStorage.setItem('user', JSON.stringify(user));
    }
}
