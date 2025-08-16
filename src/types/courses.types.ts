export interface Course {
    course_id: number;           // Primary key
    course_code: string;         // e.g., "CS101"
    course_name: string;         // e.g., "Introduction to Computer Science"
    instructor: string;          // Instructor name
    section: string;             // e.g., "A", "B", "C"
    credits: number;             // Number of credits (1-5)
    room: string;                // Room number/name
    schedule: string;            // e.g., "MWF", "TTh"
    days: string;                // e.g., "Mon,Wed,Fri", "Tue,Thu"
    time: string;                // e.g., "10:00-11:30"
    school: string;              // School/Department name
    created_at: string;          // ISO timestamp
    updated_at: string;          // ISO timestamp
}

// For creating new courses (without auto-generated fields)
export interface CreateCourseRequest extends Record<string, unknown> {
    course_code: string;
    course_name: string;
    instructor: string;
    section: string;
    credits: number;
    room: string;
    schedule: string;
    days: string;
    time: string;
    school: string;
}

// For updating courses (all fields optional)
export interface UpdateCourseRequest extends Record<string, unknown> {
    course_code?: string;
    course_name?: string;
    instructor?: string;
    section?: string;
    credits?: number;
    room?: string;
    schedule?: string;
    days?: string;
    time?: string;
    school?: string;
}