export interface Student {
    university_id: number;           // PRIMARY IDENTIFIER - 8-digit number
    student_name: string;            // Required
    campus: string | null;           // Optional
    school: string | null;           // Optional
    major: string | null;            // Optional
    semester: string | null;         // Optional
    year: number | null;             // Optional
    registered_courses_id: number | null; // Optional
    created_at: string;              // ISO timestamp
    updated_at: string;              // ISO timestamp
}

// For creating new students (without auto-generated fields)
export interface CreateStudentRequest extends Record<string, unknown> {
    university_id: number;           // Required - 8-digit number
    student_name: string;            // Required
    campus?: string | null;
    school?: string | null;
    major?: string | null;
    semester?: string | null;
    year?: number | null;
    registered_courses_id?: number | null;
}

// For updating students (all fields optional)
export interface UpdateStudentRequest extends Record<string, unknown> {
    university_id?: number;          // 8-digit number
    student_name?: string;
    campus?: string | null;
    school?: string | null;
    major?: string | null;
    semester?: string | null;
    year?: number | null;
    registered_courses_id?: number | null;
}
