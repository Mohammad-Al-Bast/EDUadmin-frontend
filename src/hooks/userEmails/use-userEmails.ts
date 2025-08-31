import { useState, useEffect } from 'react';
import { userEmailsServices } from '@/services/userEmails/userEmails.service';
import type { UserEmail, AddUserEmailRequest, AddUserEmailResponse } from '@/types/userEmails/userEmails.types';
import type { ApiError } from '@/api/baseAPI';

// Custom hook for fetching user emails
export function useUserEmails(userId: number) {
    const [userEmails, setUserEmails] = useState<UserEmail[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<ApiError | null>(null);

    const fetchUserEmails = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await userEmailsServices.getUserEmails(userId);
            setUserEmails(data);
        } catch (err) {
            setError(err as ApiError);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchUserEmails();
        }
    }, [userId]);

    const refetch = () => {
        if (userId) {
            fetchUserEmails();
        }
    };

    return {
        userEmails,
        loading,
        error,
        refetch,
    };
}

// Custom hook for adding a user email
export function useAddUserEmail() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);

    const addUserEmail = async (userId: number, emailData: AddUserEmailRequest): Promise<AddUserEmailResponse | null> => {
        try {
            setLoading(true);
            setError(null);
            const data = await userEmailsServices.addUserEmail(userId, emailData);
            return data;
        } catch (err) {
            setError(err as ApiError);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        addUserEmail,
        loading,
        error,
    };
}