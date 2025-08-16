import { API } from "@/api/baseAPI";
import type { User } from "@/types/users/users.types";

// Response types for user management actions
export interface VerifyUserResponse {
    message: string;
    user: User;
}

export interface BlockUserResponse {
    message: string;
    user: User;
}

export interface ResetPasswordResponse {
    message: string;
    new_password: string;
    user: User;
}

export interface DeleteUserResponse {
    message: string;
    delete_result: boolean;
    user_id: string;
}

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

    /**
     * * Verify a user
     * * @param {number} id - User ID
     * * @returns {Promise<VerifyUserResponse>} - Verification response
     */
    verifyUser: (id: number): Promise<VerifyUserResponse> => {
        return API.post<VerifyUserResponse>(
            `/users/${id}/verify`
        );
    },

    /**
     * * Block a user
     * * @param {number} id - User ID
     * * @returns {Promise<BlockUserResponse>} - Block response
     */
    blockUser: (id: number): Promise<BlockUserResponse> => {
        return API.post<BlockUserResponse>(
            `/users/${id}/block`
        );
    },

    /**
     * * Reset user password
     * * @param {number} id - User ID
     * * @returns {Promise<ResetPasswordResponse>} - Reset password response with new password
     */
    resetUserPassword: (id: number): Promise<ResetPasswordResponse> => {
        return API.post<ResetPasswordResponse>(
            `/users/${id}/reset-password`
        );
    },

    /**
     * * Delete a user
     * * @param {number} id - User ID
     * * @returns {Promise<DeleteUserResponse>} - Delete response
     */
    deleteUser: (id: number): Promise<DeleteUserResponse> => {
        return API.delete<DeleteUserResponse>(
            `/users/${id}/delete`
        );
    },
};