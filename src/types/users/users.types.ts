export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    is_verified: boolean; // Make this required instead of optional
    is_blocked?: boolean;
    created_at: string;
    updated_at: string;
}