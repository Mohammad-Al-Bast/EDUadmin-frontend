import { API } from "@/api/baseAPI";
import type { LoginRequest, LoginResponse } from "@/types/login/login.types";

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    [key: string]: unknown;
}

export interface ChangePasswordRequest {
    current_password: string;
    password: string;
    password_confirmation: string;
    [key: string]: unknown;
}

export interface ForgotPasswordRequest {
    email: string;
    [key: string]: unknown;
}

export interface ResetPasswordRequest {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
    [key: string]: unknown;
}

export interface UpdateProfileRequest {
    name?: string;
    email?: string;
    [key: string]: unknown;
}

export const authServices = {
    /**
     * * Authenticate user login
     * * @param {LoginRequest} credentials - User email and password
     * * @returns {Promise<LoginResponse>} - Login response with token and user data
     */
    login: (credentials: LoginRequest): Promise<LoginResponse> => {
        return API.post<LoginResponse>(
            '/auth/login',
            credentials
        );
    },

    /**
     * * Register new user
     * * @param {RegisterRequest} userData - User registration data
     * * @returns {Promise<LoginResponse>} - Registration response with token and user data
     */
    register: (userData: RegisterRequest): Promise<LoginResponse> => {
        return API.post<LoginResponse>(
            '/auth/register',
            userData
        );
    },

    /**
     * * Logout user
     * * @returns {Promise<{ message: string }>} - Logout response
     */
    logout: (): Promise<{ message: string }> => {
        return API.post<{ message: string }>(
            '/auth/logout'
        );
    },

    /**
     * * Get current user information
     * * @returns {Promise<any>} - Current user data
     */
    getUserInfo: (): Promise<any> => {
        return API.get<any>(
            '/auth/user'
        );
    },

    /**
     * * Update user profile
     * * @param {UpdateProfileRequest} profileData - Profile data to update
     * * @returns {Promise<any>} - Updated profile response
     */
    updateProfile: (profileData: UpdateProfileRequest): Promise<any> => {
        return API.put<any>(
            '/auth/profile',
            profileData
        );
    },

    /**
     * * Change user password
     * * @param {ChangePasswordRequest} passwordData - Password change data
     * * @returns {Promise<{ message: string }>} - Password change response
     */
    changePassword: (passwordData: ChangePasswordRequest): Promise<{ message: string }> => {
        return API.post<{ message: string }>(
            '/auth/change-password',
            passwordData
        );
    },

    /**
     * * Send forgot password email
     * * @param {ForgotPasswordRequest} emailData - Email for password reset
     * * @returns {Promise<{ message: string }>} - Forgot password response
     */
    forgotPassword: (emailData: ForgotPasswordRequest): Promise<{ message: string }> => {
        return API.post<{ message: string }>(
            '/auth/forgot-password',
            emailData
        );
    },

    /**
     * * Reset password using token
     * * @param {ResetPasswordRequest} resetData - Password reset data
     * * @returns {Promise<{ message: string }>} - Reset password response
     */
    resetPassword: (resetData: ResetPasswordRequest): Promise<{ message: string }> => {
        return API.post<{ message: string }>(
            '/auth/reset-password',
            resetData
        );
    },
};

// Keep backward compatibility
export const loginServices = {
    login: authServices.login,
};