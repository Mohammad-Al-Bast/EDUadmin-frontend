import { useState, useEffect } from 'react';
import { studentsServices } from '@/services/students/students.service';
import type { Student, CreateStudentRequest, UpdateStudentRequest } from '@/types/students/students.types';
import type { ApiError } from '@/api/baseAPI';

// Custom hook for fetching all students (Admin only)
export function useStudents() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<ApiError | null>(null);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await studentsServices.getAllStudents();
            setStudents(data);
        } catch (err) {
            setError(err as ApiError);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const refetch = () => {
        fetchStudents();
    };

    return {
        students,
        loading,
        error,
        refetch,
    };
}

// Custom hook for fetching a single student by ID
export function useStudent(id: number) {
    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<ApiError | null>(null);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await studentsServices.getStudentById(id);
                setStudent(data);
            } catch (err) {
                setError(err as ApiError);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchStudent();
        }
    }, [id]);

    const refetch = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await studentsServices.getStudentById(id);
            setStudent(data);
        } catch (err) {
            setError(err as ApiError);
        } finally {
            setLoading(false);
        }
    };

    return {
        student,
        loading,
        error,
        refetch,
    };
}

// Custom hook for creating a student (Admin only)
export function useCreateStudent() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);

    const createStudent = async (studentData: CreateStudentRequest): Promise<Student | null> => {
        try {
            setLoading(true);
            setError(null);
            const data = await studentsServices.createStudent(studentData);
            return data;
        } catch (err) {
            setError(err as ApiError);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        createStudent,
        loading,
        error,
    };
}

// Custom hook for updating a student (Own data or Admin)
export function useUpdateStudent() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);

    const updateStudent = async (id: number, studentData: UpdateStudentRequest): Promise<Student | null> => {
        try {
            setLoading(true);
            setError(null);
            const response = await studentsServices.updateStudent(id, studentData);
            return response.student;
        } catch (err) {
            setError(err as ApiError);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        updateStudent,
        loading,
        error,
    };
}

// Custom hook for deleting a student (Admin only)
export function useDeleteStudent() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);

    const deleteStudent = async (id: number): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            await studentsServices.deleteStudent(id);
            return true;
        } catch (err) {
            setError(err as ApiError);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        deleteStudent,
        loading,
        error,
    };
}

// Custom hook for deleting all students (Admin only)
export function useDeleteAllStudents() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);

    const deleteAllStudents = async (): Promise<{ success: boolean; deletedCount?: number }> => {
        try {
            setLoading(true);
            setError(null);
            const response = await studentsServices.deleteAllStudents();
            return { success: true, deletedCount: response.deleted_count };
        } catch (err) {
            setError(err as ApiError);
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    return {
        deleteAllStudents,
        loading,
        error,
    };
}
