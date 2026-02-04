import { Injectable } from '@angular/core';

const TOKEN_KEY = 'AuthToken_Test_APP';

@Injectable({
    providedIn: 'root'
})
export class TokenService {

    private readonly payloadIdUser = "userId";
    private readonly payloadEmail = "email";

    constructor() { }

    public setToken(token: string): void {
        localStorage.setItem(TOKEN_KEY, token);
    }

    public getToken(): string | null {
        return typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
    }

    public removeToken(): void {
        localStorage.removeItem(TOKEN_KEY);
    }

    private decodeToken(token: string): any | null {
        try {
            const base64Url = token.split('.')[1];
            if (!base64Url) return null;

            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
                    .join('')
            );

            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error("Error al decodificar el token:", error);
            return null;
        }
    }

    public isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) return false;

        const payload = this.decodeToken(token);
        if (!payload || !payload.exp) return false;

        return Date.now() < payload.exp * 1000;
    }

    public getDataJWT(field: string): any | null {
        const token = this.getToken();
        if (!token) return null;

        const payload = this.decodeToken(token);
        return payload ? payload[field] : null;
    }

    public getIdUser(): string {
        return this.getDataJWT(this.payloadIdUser);
    }

    public getEmail(): string {
        return this.getDataJWT(this.payloadEmail);
    }
}