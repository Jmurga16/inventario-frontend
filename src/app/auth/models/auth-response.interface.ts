export interface AuthResponse {
    userId: number;
    email: string;
    fullName: string;
    token: string;
    roles: string[];
}
