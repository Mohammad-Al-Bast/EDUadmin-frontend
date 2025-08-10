import { useCallback, useEffect } from 'react';
import type { LoginRequest, LoginUser } from '@/types/login/login.types';
import { APIinstance } from '@/api/baseAPI';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { 
    logout as logoutAction, 
    clearError as clearErrorAction
} from '@/store/slices/authSlice';
import { loginAsync } from '@/store/thunks/authThunks';
import { selectAuth } from '@/store/selectors/authSelectors';

interface UseAuthReturn {
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
    loading: boolean;
    error: string | null;
    user: LoginUser | null;
    token: string | null;
    isAuthenticated: boolean;
    clearError: () => void;
}

export function useAuth(): UseAuthReturn {
    const dispatch = useAppDispatch();
    const { token, user, isAuthenticated, loading, error } = useAppSelector(selectAuth);

    // Set authorization header when token changes
    useEffect(() => {
        if (token) {
            APIinstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete APIinstance.defaults.headers.common['Authorization'];
        }
    }, [token]);

    const login = useCallback(async (credentials: LoginRequest): Promise<void> => {
        try {
            await dispatch(loginAsync(credentials)).unwrap();
        } catch (err) {
            throw err; // Re-throw to allow component to handle it
        }
    }, [dispatch]);

    const logout = useCallback((): void => {
        dispatch(logoutAction());
    }, [dispatch]);

    const clearError = useCallback((): void => {
        dispatch(clearErrorAction());
    }, [dispatch]);

    return {
        login,
        logout,
        loading,
        error,
        user,
        token,
        isAuthenticated,
        clearError,
    };
}
