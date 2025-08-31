import { useState } from 'react';
import { registerServices } from '@/services/register/register.service';
import type { RegisterRequest, RegisterResponse, RegisterUser } from '@/types/register/register.types';
import type { ApiError } from '@/api/baseAPI';

interface UseRegisterReturn {
    register: (userData: RegisterRequest) => Promise<RegisterResponse>;
    loading: boolean;
    error: ApiError | null;
    success: boolean;
    registeredUser: RegisterUser | null;
    clearState: () => void;
}

export function useRegister(): UseRegisterReturn {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [registeredUser, setRegisteredUser] = useState<RegisterUser | null>(null);

    const register = async (userData: RegisterRequest): Promise<RegisterResponse> => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);
            
            const response: RegisterResponse = await registerServices.register(userData);
            
            setRegisteredUser(response.user);
            setSuccess(true);
            
            return response;
        } catch (err) {
            setError(err as ApiError);
            setSuccess(false);
            throw err; // Re-throw to allow component to handle it
        } finally {
            setLoading(false);
        }
    };

    const clearState = (): void => {
        setError(null);
        setSuccess(false);
        setRegisteredUser(null);
        setLoading(false);
    };

    return {
        register,
        loading,
        error,
        success,
        registeredUser,
        clearState,
    };
}
