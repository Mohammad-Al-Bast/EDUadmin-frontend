import { API } from "@/api/baseAPI";
import type { Student, CreateStudentRequest, UpdateStudentRequest } from "@/types/students/students.types";

export const studentsServices = {
    /**
     * * Fetch all students
     * * @returns {Promise<Student[]>} - List of students
     */
    getAllStudents: (): Promise<Student[]> => {
        return API.get<Student[]>(
            '/students'
        );
    },

    /**
     * * Fetch student by University ID
     * * @param {number} id - University ID (8-digit number)
     * * @returns {Promise<Student>} - Student data
     */
    getStudentById: (id: number): Promise<Student> => {
        return API.get<Student>(
            `/students/${id}`
        );
    },

    /**
     * * Create new student (Admin only)
     * * @param {CreateStudentRequest} studentData - Student data (including 8-digit university_id)
     * * @returns {Promise<Student>} - Created student data
     */
    createStudent: (studentData: CreateStudentRequest): Promise<Student> => {
        return API.post<Student>(
            '/admin/students',
            studentData
        );
    },

    /**
     * * Update existing student (Admin only)
     * * @param {number} id - University ID (8-digit number)
     * * @param {UpdateStudentRequest} studentData - Student data to update
     * * @returns {Promise<{ message: string; student: Student }>} - Update response
     */
    updateStudent: (id: number, studentData: UpdateStudentRequest): Promise<{ message: string; student: Student }> => {
        return API.put<{ message: string; student: Student }>(
            `/admin/students/${id}`,
            studentData
        );
    },

    /**
     * * Delete student (Admin only)
     * * @param {number} id - University ID (8-digit number)
     * * @returns {Promise<{ message: string; student: Student }>} - Delete response
     */
    deleteStudent: (id: number): Promise<{ message: string; student: Student }> => {
        return API.delete<{ message: string; student: Student }>(
            `/admin/students/${id}`
        );
    },

    /**
     * * Delete all students (Admin only)
     * * @returns {Promise<{ message: string; deleted_count: number }>} - Delete all response
     */
    deleteAllStudents: (): Promise<{ message: string; deleted_count: number }> => {
        return API.delete<{ message: string; deleted_count: number }>(
            '/admin/students'
        );
    },
};
