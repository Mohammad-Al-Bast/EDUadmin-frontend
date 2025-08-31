export interface UserEmail {
    id: number;
    email: string;
    is_locked: boolean;
    created_at: string;
    updated_at: string;
}

export interface AddUserEmailRequest {
    email: string;
    [key: string]: unknown;
}

export interface AddUserEmailResponse extends UserEmail {}