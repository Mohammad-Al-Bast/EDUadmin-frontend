import { API } from "@/api/baseAPI";
import type { User } from "@/types/users/users.types";

export const usersServices = {
    /**
     * * Fetch all users
     * * @returns {Promise<User[]>} - List of users
     */
    getAllUsers: (): Promise<User[]> => {
        return API.get<User[]>(
            '/users'
        );
    },

    /**
     * * Fetch user by ID
     * * @param {number} id - User ID
     * * @returns {Promise<User>} - User data
     */
    getUserById: (id: number): Promise<User> => {
        return API.get<User>(
            `/users/${id}`
        );
    },
};