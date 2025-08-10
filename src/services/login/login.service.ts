import { API } from "@/api/baseAPI";
import type { LoginRequest, LoginResponse } from "@/types/login/login.types";

export const loginServices = {
    /**
     * * Authenticate user login
     * * @param {LoginRequest} credentials - User email and password
     * * @returns {Promise<LoginResponse>} - Login response with token and user data
     */
    login: (credentials: LoginRequest): Promise<LoginResponse> => {
        return API.post<LoginResponse>(
            '/login',
            credentials
        );
    },
};