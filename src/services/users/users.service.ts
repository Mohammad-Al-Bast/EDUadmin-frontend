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

export interface AdminSetPasswordResponse {
    message: string;
    user: User;
}

export interface DeleteUserResponse {
    message: string;
    delete_result: boolean;
    user_id: string;
}

export interface CreateUserRequest {
    name: string;
    email: string;
    password?: string;
    role?: string;
    [key: string]: unknown;
}

export const usersServices = {
    /**
     * * Fetch all users (Admin only)
     * * @returns {Promise<User[]>} - List of users
     */
    getAllUsers: (): Promise<User[]> => {
        return API.get<User[]>(
            '/admin/users'
        );
    },

    /**
     * * Fetch user by ID (Admin only)
     * * @param {number} id - User ID
     * * @returns {Promise<User>} - User data
     */
    getUserById: (id: number): Promise<User> => {
        return API.get<User>(
            `/admin/users/${id}`
        );
    },

    /**
     * * Create new user (Admin only)
     * * @param {CreateUserRequest} userData - User data
     * * @returns {Promise<User>} - Created user data
     */
    createUser: (userData: CreateUserRequest): Promise<User> => {
        return API.post<User>(
            '/admin/users',
            userData
        );
    },

    /**
     * * Update user (Admin only)
     * * @param {number} id - User ID
     * * @param {Partial<CreateUserRequest>} userData - User data to update
     * * @returns {Promise<User>} - Updated user data
     */
    updateUser: (id: number, userData: Partial<CreateUserRequest>): Promise<User> => {
        return API.put<User>(
            `/admin/users/${id}`,
            userData
        );
    },

    /**
     * * Verify a user (Admin only)
     * * @param {number} id - User ID
     * * @returns {Promise<VerifyUserResponse>} - Verification response
     */
    verifyUser: (id: number): Promise<VerifyUserResponse> => {
        return API.post<VerifyUserResponse>(
            `/admin/users/${id}/verify`
        );
    },

    /**
     * * Block a user (Admin only)
     * * @param {number} id - User ID
     * * @returns {Promise<BlockUserResponse>} - Block response
     */
    blockUser: (id: number): Promise<BlockUserResponse> => {
        return API.post<BlockUserResponse>(
            `/admin/users/${id}/block`
        );
    },

    /**
     * * Set user password (Admin only) - Admin sets custom password
     * * @param {number} id - User ID
     * * @param {string} password - New password
     * * @returns {Promise<AdminSetPasswordResponse>} - Set password response
     */
    adminSetUserPassword: (id: number, password: string): Promise<AdminSetPasswordResponse> => {
        return API.put<AdminSetPasswordResponse>(
            `/admin/users/${id}/reset-password`,
            { password }
        );
    },

    /**
     * * Delete a user (Admin only)
     * * @param {number} id - User ID
     * * @returns {Promise<DeleteUserResponse>} - Delete response
     */
    deleteUser: (id: number): Promise<DeleteUserResponse> => {
        return API.delete<DeleteUserResponse>(
            `/admin/users/${id}/delete`
        );
    },
};