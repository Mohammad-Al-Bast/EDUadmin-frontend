import { useState } from 'react';
import { loginServices } from '@/services/login/login.service';
import type { LoginRequest, LoginResponse, LoginUser } from '@/types/login/login.types';
import type { ApiError } from '@/api/baseAPI';

interface UseLoginReturn {
    login: (credentials: LoginRequest) => Promise<void>;
    loading: boolean;
    error: ApiError | null;
    user: LoginUser | null;
    token: string | null;
    isAuthenticated: boolean;
    logout: () => void;
}

export function useLogin(): UseLoginReturn {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);
    const [user, setUser] = useState<LoginUser | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const login = async (credentials: LoginRequest): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            
            const response: LoginResponse = await loginServices.login(credentials);
            
            // Store token and user data
            setToken(response.token);
            setUser(response.user);
            
            // Store token in localStorage for persistence
            localStorage.setItem('auth_token', response.token);
            localStorage.setItem('user_data', JSON.stringify(response.user));
            
        } catch (err) {
            setError(err as ApiError);
            throw err; // Re-throw to allow component to handle it
        } finally {
            setLoading(false);
        }
    };

    const logout = (): void => {
        setUser(null);
        setToken(null);
        setError(null);
        
        // Clear stored data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
    };

    const isAuthenticated = Boolean(token && user);

    return {
        login,
        loading,
        error,
        user,
        token,
        isAuthenticated,
        logout,
    };
}