import { API } from "@/api/baseAPI";
import type { Student, CreateStudentRequest, UpdateStudentRequest } from "@/types/students.types";

export const studentsServices = {
    /**
     * * Fetch all students (Admin only)
     * * @returns {Promise<Student[]>} - List of students
     */
    getAllStudents: (): Promise<Student[]> => {
        return API.get<Student[]>(
            '/students'
        );
    },

    /**
     * * Fetch student by ID (Own data or Admin)
     * * @param {number} id - Student ID
     * * @returns {Promise<Student>} - Student data
     */
    getStudentById: (id: number): Promise<Student> => {
        return API.get<Student>(
            `/students/${id}`
        );
    },

    /**
     * * Create new student (Admin only)
     * * @param {CreateStudentRequest} studentData - Student data
     * * @returns {Promise<Student>} - Created student data
     */
    createStudent: (studentData: CreateStudentRequest): Promise<Student> => {
        return API.post<Student>(
            '/students',
            studentData
        );
    },

    /**
     * * Update existing student (Own data or Admin)
     * * @param {number} id - Student ID
     * * @param {UpdateStudentRequest} studentData - Student data to update
     * * @returns {Promise<{ message: string; student: Student }>} - Update response
     */
    updateStudent: (id: number, studentData: UpdateStudentRequest): Promise<{ message: string; student: Student }> => {
        return API.put<{ message: string; student: Student }>(
            `/students/${id}`,
            studentData
        );
    },

    /**
     * * Delete student (Admin only)
     * * @param {number} id - Student ID
     * * @returns {Promise<{ message: string; student: Student }>} - Delete response
     */
    deleteStudent: (id: number): Promise<{ message: string; student: Student }> => {
        return API.delete<{ message: string; student: Student }>(
            `/students/${id}`
        );
    },
};
