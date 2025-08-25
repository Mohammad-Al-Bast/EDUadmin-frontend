import { z } from 'zod';

// Base schema for common fields
const baseSchema = z.object({
    email: z
        .string()
        .email('Please enter a valid email address')
        .min(1, 'Email is required')
        .max(254, 'Email is too long'),
    newPassword: z
        .string()
        .min(8, 'New password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmNewPassword: z
        .string()
        .min(1, 'Please confirm your new password'),
});

// Schema for token-based reset (no old password required)
export const tokenResetPasswordSchema = baseSchema.refine(
    (data) => data.newPassword === data.confirmNewPassword,
    {
        message: 'Passwords do not match',
        path: ['confirmNewPassword'],
    }
);

// Schema for change password (old password required)
export const changePasswordSchema = baseSchema.extend({
    oldPassword: z
        .string()
        .min(1, 'Current password is required'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
});

// Main schema that conditionally includes oldPassword
export const resetPasswordSchema = z.object({
    email: z
        .string()
        .email('Please enter a valid email address')
        .min(1, 'Email is required')
        .max(254, 'Email is too long'),
    oldPassword: z
        .string()
        .optional(), // Make it optional since it's not always required
    newPassword: z
        .string()
        .min(8, 'New password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmNewPassword: z
        .string()
        .min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type TokenResetPasswordFormData = z.infer<typeof tokenResetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
