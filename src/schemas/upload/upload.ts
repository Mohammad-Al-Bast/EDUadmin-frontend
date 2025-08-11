import { z } from 'zod';

const ACCEPTED_IMPORT_TYPES = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

export const courseImportSchema = z.object({
    semester: z.string().min(1, 'Please select a semester'),
    file: z
        .any()
        .refine((file) => file instanceof File, {
            message: 'Please select a file',
        })
        .refine((file) => ACCEPTED_IMPORT_TYPES.includes(file?.type), {
            message: 'File must be a CSV or Excel file',
        }),
});

export const studentImportSchema = z.object({
    file: z
        .any()
        .refine((file) => file instanceof File, {
            message: 'Please select a file',
        })
        .refine((file) => ACCEPTED_IMPORT_TYPES.includes(file?.type), {
            message: 'File must be a CSV or Excel file',
        }),
});

export type CourseImportFormData = z.infer<typeof courseImportSchema>;
export type StudentImportFormData = z.infer<typeof studentImportSchema>;