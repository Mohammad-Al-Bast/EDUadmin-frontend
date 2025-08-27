import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginServices } from '@/services/login/login.service';
import type { LoginRequest, LoginResponse } from '@/types/login/login.types';

// Async thunk for login
export const loginAsync = createAsyncThunk(
    'auth/login',
    async (credentials: LoginRequest) => {
        const response: LoginResponse = await loginServices.login(credentials);
        return {
            token: response.token,
            user: response.user
        };
    }
);

// Async thunk for logout
export const logoutAsync = createAsyncThunk(
    'auth/logout',
    async () => {
        try {
            // Clear localStorage items
            localStorage.removeItem('persist:root');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            
            return true;
        } catch (error) {
            throw error;
        }
    }
);
