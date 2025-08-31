import { API } from "@/api/baseAPI";
import type { UserEmail, AddUserEmailRequest, AddUserEmailResponse } from "@/types/userEmails/userEmails.types";

export const userEmailsServices = {
    /**
     * * Get all emails for a specific user
     * * @param {number} userId - The ID of the user whose emails to retrieve
     * * @returns {Promise<UserEmail[]>} - List of user emails
     */
    getUserEmails: (userId: number): Promise<UserEmail[]> => {
        return API.get<UserEmail[]>(
            `/users/${userId}/emails`
        );
    },

    /**
     * * Add a new email to a user's account
     * * @param {number} userId - The ID of the user to add the email to
     * * @param {AddUserEmailRequest} emailData - Email data to add
     * * @returns {Promise<AddUserEmailResponse>} - Created email data
     */
    addUserEmail: (userId: number, emailData: AddUserEmailRequest): Promise<AddUserEmailResponse> => {
        return API.post<AddUserEmailResponse>(
            `/users/${userId}/emails`,
            emailData
        );
    },
};