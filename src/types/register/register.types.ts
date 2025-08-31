export interface RegisterRequest {
    name: string;
    email: string;
    locked_user_email: string;
    password: string;
    password_confirmation: string;
    [key: string]: unknown;
}

export interface RegisterUser {
    id: number;
    name: string;
    email: string;
    is_verified: boolean;
    is_admin: boolean;
    email_verified_at: string | null;
}

export interface RegisterResponse {
    message: string;
    user: RegisterUser;
}

export interface RegisterError {
    message: string;
    errors?: Record<string, string[]> | string[];
}
