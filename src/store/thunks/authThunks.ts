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
