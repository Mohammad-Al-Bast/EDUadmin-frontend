export interface Student {
    student_id: number;           // Primary key
    student_name: string;         // Full name of the student
    campus: string | null;       // Campus location
    school: string | null;       // School/Faculty name
    major: string | null;        // Student's major/program
    semester: string | null;     // Current semester (Fall, Spring, Summer)
    year: number | null;         // Academic year
    registered_courses_id: number | null; // Foreign key to courses_change_grade_form
    created_at: string;          // ISO timestamp
    updated_at: string;          // ISO timestamp
}

// For creating new students (without auto-generated fields)
export interface CreateStudentRequest extends Record<string, unknown> {
    student_name: string;
    campus?: string | null;
    school?: string | null;
    major?: string | null;
    semester?: string | null;
    year?: number | null;
    registered_courses_id?: number | null;
}

// For updating students (all fields optional except potentially student_name)
export interface UpdateStudentRequest extends Record<string, unknown> {
    student_name?: string;
    campus?: string | null;
    school?: string | null;
    major?: string | null;
    semester?: string | null;
    year?: number | null;
    registered_courses_id?: number | null;
}
