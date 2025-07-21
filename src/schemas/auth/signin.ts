import { z } from 'zod';

export const signinSchema = z.object({
    email: z
        .email('Please enter a valid email address')
        .min(1, 'Email is required')
        .max(254, 'Email is too long'),
    password: z
        .string()
        .min(1, 'Password is required'),
});

export type SigninFormData = z.infer<typeof signinSchema>;