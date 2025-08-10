import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { LoginUser } from '@/types/login/login.types';
import { loginAsync } from '@/store/thunks/authThunks';

interface AuthState {
    token: string | null;
    user: LoginUser | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    token: null,
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action: PayloadAction<{ token: string; user: LoginUser }>) => {
            state.loading = false;
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.error = null;
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            
            // Clear localStorage as well
            localStorage.removeItem('persist:root');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
        },
        clearError: (state) => {
            state.error = null;
        },
        updateUser: (state, action: PayloadAction<LoginUser>) => {
            state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginAsync.rejected, (state, action) => {
                state.loading = false;
                state.token = null;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.error.message || 'Login failed';
            });
    },
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
    clearError,
    updateUser,
} = authSlice.actions;

// Export the async thunk
export { loginAsync } from '@/store/thunks/authThunks';

export default authSlice.reducer;
