import { z } from 'zod';

export const registerSchema = z.object({
    name: z
        .string()
        .min(1, 'Name is required')
        .max(255, 'Name must be less than 255 characters')
        .trim(),
    email: z
        .email('Please enter a valid email address')
        .min(1, 'Email is required')
        .max(254, 'Email is too long'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z
        .string()
        .min(1, 'Password confirmation is required'),
}).refine(
    (data) => data.password === data.confirmPassword,
    {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    }
);

export type RegisterFormData = z.infer<typeof registerSchema>;
