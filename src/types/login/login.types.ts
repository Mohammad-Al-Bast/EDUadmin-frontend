export interface LoginRequest {
    email: string;
    password: string;
    [key: string]: unknown;
}

export interface LoginUser {
    id: number;
    name: string;
    email: string;
    is_verified: boolean;
    is_admin: boolean;
    email_verified_at: string;
}

export interface LoginResponse {
    message: string;
    token: string;
    user: LoginUser;
}

export interface LoginError {
    message: string;
    errors?: Record<string, string[]> | string[];
}