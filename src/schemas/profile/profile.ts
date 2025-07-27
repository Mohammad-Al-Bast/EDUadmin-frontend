import { z } from 'zod';

export const profileUploadSchema = z.object({
    file: z
        .any()
        .refine((file) => file instanceof File, {
            message: 'Please select a file',
        })
});

export type ProfileUploadFormData = z.infer<typeof profileUploadSchema>;
