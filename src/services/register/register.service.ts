import { API } from "@/api/baseAPI";
import type { RegisterRequest, RegisterResponse } from "@/types/register/register.types";

export const registerServices = {
    /**
     * * Register a new user
     * * @param {RegisterRequest} userData - User registration data
     * * @returns {Promise<RegisterResponse>} - Registration response with user data
     */
    register: (userData: RegisterRequest): Promise<RegisterResponse> => {
        return API.post<RegisterResponse>(
            '/auth/register',
            userData
        );
    },
};
