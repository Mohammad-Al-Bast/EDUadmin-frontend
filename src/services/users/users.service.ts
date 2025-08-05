import { API } from "@/api/baseAPI";
import type { User } from "@/types/users/users.types";


export const usersServices = {
    /**
     * * Fetch all users
     * * @returns {Promise<User[]>} - List of users
     */
    getAllUsers: (): Promise<User[]> => {
        return API.get<User[]>(
            '/users' // http://localhost:8000/api/v1/users
        );
    },

    /**
     * * Fetch user by ID
     * * @param {string} id - User ID
     * * @returns {Promise<User>} - User data
     */
    getUserById: (id: string): Promise<User> => {
        return API.get<User>(
            `/users/${id}` // http://localhost:8000/api/v1/users/{id}
        );
    },
};

// const response = await usersServices.getAllUsers();
// console.log(response); // Logs the list of users