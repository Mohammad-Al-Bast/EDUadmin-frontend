import { z } from 'zod';

export const resetPasswordSchema = z.object({
    email: z
        .string()
        .email('Please enter a valid email address')
        .min(1, 'Email is required')
        .max(254, 'Email is too long'),
    oldPassword: z
        .string()
        .min(1, 'Old password is required'),
    newPassword: z
        .string()
        .min(6, 'New password must be at least 6 characters'),
    confirmNewPassword: z
        .string()
        .min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
