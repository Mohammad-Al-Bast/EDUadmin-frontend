import { API } from "@/api/baseAPI";
import type { Course, CreateCourseRequest, UpdateCourseRequest } from "@/types/courses.types";

export const coursesServices = {
    /**
     * * Fetch all courses
     * * @returns {Promise<Course[]>} - List of courses
     */
    getAllCourses: (): Promise<Course[]> => {
        return API.get<Course[]>(
            '/courses'
        );
    },

    /**
     * * Fetch course by ID
     * * @param {number} id - Course ID
     * * @returns {Promise<Course>} - Course data
     */
    getCourseById: (id: number): Promise<Course> => {
        return API.get<Course>(
            `/courses/${id}`
        );
    },

    /**
     * * Create new course (Admin only)
     * * @param {CreateCourseRequest} courseData - Course data
     * * @returns {Promise<Course>} - Created course data
     */
    createCourse: (courseData: CreateCourseRequest): Promise<Course> => {
        return API.post<Course>(
            '/admin/courses',
            courseData
        );
    },

    /**
     * * Update existing course (Admin only)
     * * @param {number} id - Course ID
     * * @param {UpdateCourseRequest} courseData - Course data to update
     * * @returns {Promise<{ message: string; course: Course }>} - Update response
     */
    updateCourse: (id: number, courseData: UpdateCourseRequest): Promise<{ message: string; course: Course }> => {
        return API.put<{ message: string; course: Course }>(
            `/admin/courses/${id}`,
            courseData
        );
    },

    /**
     * * Delete course (Admin only)
     * * @param {number} id - Course ID
     * * @returns {Promise<{ message: string; course: Course }>} - Delete response
     */
    deleteCourse: (id: number): Promise<{ message: string; course: Course }> => {
        return API.delete<{ message: string; course: Course }>(
            `/admin/courses/${id}`
        );
    },

    /**
     * * Delete all courses (Admin only)
     * * @returns {Promise<{ message: string; deleted_count: number }>} - Delete all response
     */
    deleteAllCourses: (): Promise<{ message: string; deleted_count: number }> => {
        return API.delete<{ message: string; deleted_count: number }>(
            '/admin/courses'
        );
    },
};
