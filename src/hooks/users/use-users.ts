import { useState, useEffect } from 'react';
import { usersServices } from '@/services/users/users.service';
import type { User } from '@/types/users/users.types';
import type { ApiError } from '@/api/baseAPI';

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