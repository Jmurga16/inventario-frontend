export interface AuthResponse {
    token: string;
    expiresAt: string;
    user: AuthUser;
}

export interface AuthUser {
    id: number;
    email: string;
    fullName: string;
    roles: string[];
}
