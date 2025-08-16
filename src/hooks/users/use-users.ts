import { useState, useEffect } from 'react';
import { usersServices } from '@/services/users/users.service';
import type { User } from '@/types/users/users.types';
import type { ApiError } from '@/api/baseAPI';
import type { VerifyUserResponse, BlockUserResponse, ResetPasswordResponse, DeleteUserResponse } from '@/services/users/users.service';

// Custom hook for fetching all users
export function useUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<ApiError | null>(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await usersServices.getAllUsers();
            setUsers(data);
        } catch (err) {
            setError(err as ApiError);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const refetch = () => {
        fetchUsers();
    };

    return {
        users,
        loading,
        error,
        refetch,
    };
}

// Custom hook for fetching a single user by ID
export function useUser(id: number) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<ApiError | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await usersServices.getUserById(id);
                setUser(data);
            } catch (err) {
                setError(err as ApiError);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchUser();
        }
    }, [id]);

    const refetch = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await usersServices.getUserById(id);
            setUser(data);
        } catch (err) {
            setError(err as ApiError);
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        loading,
        error,
        refetch,
    };
}

// Custom hook for user management actions
export function useUserManagement() {
    const [actionLoading, setActionLoading] = useState<boolean>(false);
    const [actionError, setActionError] = useState<ApiError | null>(null);

    const verifyUser = async (id: number): Promise<VerifyUserResponse | null> => {
        try {
            setActionLoading(true);
            setActionError(null);
            const response = await usersServices.verifyUser(id);
            return response;
        } catch (err) {
            setActionError(err as ApiError);
            throw err;
        } finally {
            setActionLoading(false);
        }
    };

    const blockUser = async (id: number): Promise<BlockUserResponse | null> => {
        try {
            setActionLoading(true);
            setActionError(null);
            const response = await usersServices.blockUser(id);
            return response;
        } catch (err) {
            setActionError(err as ApiError);
            throw err;
        } finally {
            setActionLoading(false);
        }
    };

    const resetUserPassword = async (id: number): Promise<ResetPasswordResponse | null> => {
        try {
            setActionLoading(true);
            setActionError(null);
            const response = await usersServices.resetUserPassword(id);
            return response;
        } catch (err) {
            setActionError(err as ApiError);
            throw err;
        } finally {
            setActionLoading(false);
        }
    };

    const deleteUser = async (id: number): Promise<DeleteUserResponse | null> => {
        try {
            setActionLoading(true);
            setActionError(null);
            const response = await usersServices.deleteUser(id);
            return response;
        } catch (err) {
            setActionError(err as ApiError);
            throw err;
        } finally {
            setActionLoading(false);
        }
    };

    return {
        verifyUser,
        blockUser,
        resetUserPassword,
        deleteUser,
        actionLoading,
        actionError,
    };
}