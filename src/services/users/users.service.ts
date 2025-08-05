import { API } from "@/api/baseAPI";
import type { GetUserResponse } from "@/types/users/users.types";

export const usersServices = {
    /**
     * * Fetch all users
     * * @returns {Promise<GetUserResponse[]>} - List of users
     */
    getAllUsers: (): Promise<GetUserResponse[]> => {
        return API.get<GetUserResponse[]>(
            '/users' // http://localhost:8000/api/v1/users
        );
    },

    /**
     * * Fetch user by ID
     * * @param {string} id - User ID
     * * @returns {Promise<GetUserResponse>} - User data
     */
    getUserById: (id: string): Promise<GetUserResponse> => {
        return API.get<GetUserResponse>(
            `/users/${id}` // http://localhost:8000/api/v1/users/{id}
        );
    },
};

// const response = await usersServices.getAllUsers();
// console.log(response); // Logs the list of users