import { useState, useEffect } from 'react';
import { coursesServices } from '@/services/courses/courses.service';
import type { Course, CreateCourseRequest, UpdateCourseRequest } from '@/types/courses.types';
import type { ApiError } from '@/api/baseAPI';

// Custom hook for fetching all courses
export function useCourses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<ApiError | null>(null);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await coursesServices.getAllCourses();
            setCourses(data);
        } catch (err) {
            setError(err as ApiError);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const refetch = () => {
        fetchCourses();
    };

    return {
        courses,
        loading,
        error,
        refetch,
    };
}

// Custom hook for fetching a single course by ID
export function useCourse(id: number) {
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<ApiError | null>(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await coursesServices.getCourseById(id);
                setCourse(data);
            } catch (err) {
                setError(err as ApiError);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCourse();
        }
    }, [id]);

    const refetch = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await coursesServices.getCourseById(id);
            setCourse(data);
        } catch (err) {
            setError(err as ApiError);
        } finally {
            setLoading(false);
        }
    };

    return {
        course,
        loading,
        error,
        refetch,
    };
}

// Custom hook for creating a course
export function useCreateCourse() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);

    const createCourse = async (courseData: CreateCourseRequest): Promise<Course | null> => {
        try {
            setLoading(true);
            setError(null);
            const data = await coursesServices.createCourse(courseData);
            return data;
        } catch (err) {
            setError(err as ApiError);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        createCourse,
        loading,
        error,
    };
}

// Custom hook for updating a course
export function useUpdateCourse() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);

    const updateCourse = async (id: number, courseData: UpdateCourseRequest): Promise<Course | null> => {
        try {
            setLoading(true);
            setError(null);
            const response = await coursesServices.updateCourse(id, courseData);
            return response.course;
        } catch (err) {
            setError(err as ApiError);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        updateCourse,
        loading,
        error,
    };
}

// Custom hook for deleting a course
export function useDeleteCourse() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);

    const deleteCourse = async (id: number): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            await coursesServices.deleteCourse(id);
            return true;
        } catch (err) {
            setError(err as ApiError);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        deleteCourse,
        loading,
        error,
    };
}

// Custom hook for deleting all courses
export function useDeleteAllCourses() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);

    const deleteAllCourses = async (): Promise<{ success: boolean; deletedCount?: number }> => {
        try {
            setLoading(true);
            setError(null);
            const response = await coursesServices.deleteAllCourses();
            return { success: true, deletedCount: response.deleted_count };
        } catch (err) {
            setError(err as ApiError);
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    return {
        deleteAllCourses,
        loading,
        error,
    };
}
