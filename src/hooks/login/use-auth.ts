import { useState, useEffect, useCallback } from 'react';
import { loginServices } from '@/services/login/login.service';
import type { LoginRequest, LoginResponse, LoginUser } from '@/types/login/login.types';
import type { ApiError } from '@/api/baseAPI';
import { APIinstance } from '@/api/baseAPI';

interface UseAuthReturn {
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
    loading: boolean;
    error: ApiError | null;
    user: LoginUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isInitialized: boolean;
    clearError: () => void;
}

export function useAuth(): UseAuthReturn {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);
    const [user, setUser] = useState<LoginUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    // Initialize auth state from localStorage
    const initializeAuth = useCallback(() => {
        try {
            const storedToken = localStorage.getItem('auth_token');
            const storedUser = localStorage.getItem('user_data');

            if (storedToken && storedUser) {
                const userData = JSON.parse(storedUser) as LoginUser;
                setToken(storedToken);
                setUser(userData);
                
                // Set the authorization header for future requests
                APIinstance.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            }
        } catch (error) {
            console.error('Failed to initialize auth state:', error);
            // Clear corrupted data
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
        } finally {
            setIsInitialized(true);
        }
    }, []);

    // Initialize on mount
    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    const login = async (credentials: LoginRequest): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            
            const response: LoginResponse = await loginServices.login(credentials);
            
            // Store token and user data
            setToken(response.token);
            setUser(response.user);
            
            // Store in localStorage for persistence
            localStorage.setItem('auth_token', response.token);
            localStorage.setItem('user_data', JSON.stringify(response.user));
            
            // Set authorization header for future requests
            APIinstance.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
            
        } catch (err) {
            setError(err as ApiError);
            throw err; // Re-throw to allow component to handle it
        } finally {
            setLoading(false);
        }
    };

    const logout = useCallback((): void => {
        setUser(null);
        setToken(null);
        setError(null);
        
        // Clear stored data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        
        // Clear authorization header
        delete APIinstance.defaults.headers.common['Authorization'];
    }, []);

    const clearError = useCallback((): void => {
        setError(null);
    }, []);

    const isAuthenticated = Boolean(token && user);

    return {
        login,
        logout,
        loading,
        error,
        user,
        token,
        isAuthenticated,
        isInitialized,
        clearError,
    };
}
