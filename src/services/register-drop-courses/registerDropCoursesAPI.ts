import { API } from '@/api/baseAPI';

export interface RegisterDropCourseFormData {
  // Define the fields for the register/drop course form
  university_id: number;
  courses: Array<{ courseId: number; action: 'register' | 'drop' }>;
  reason?: string;
  // Add other fields as needed
  [key: string]: unknown; // Index signature to satisfy TypeScript
}

export interface RegisterDropCourseForm extends RegisterDropCourseFormData {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export const registerDropCoursesAPI = {
  getAll: (params?: { page?: number; per_page?: number; search?: string }) =>
    API.get<ApiResponse<RegisterDropCourseForm[]>>('/register-drop-courses', params),

  create: (data: RegisterDropCourseFormData) =>
    API.post<ApiResponse<RegisterDropCourseForm>>('/register-drop-courses', data as any),

  getByStudent: (studentId: number) =>
    API.get<ApiResponse<RegisterDropCourseForm[]>>(`/register-drop-courses/student/${studentId}`),

  getById: (id: number) =>
    API.get<ApiResponse<RegisterDropCourseForm>>(`/register-drop-courses/${id}`),

  update: (id: number, data: Partial<RegisterDropCourseFormData>) =>
    API.put<ApiResponse<RegisterDropCourseForm>>(`/register-drop-courses/${id}`, data),

  delete: (id: number) =>
    API.delete<ApiResponse<{ message: string }>>(`/register-drop-courses/${id}`),
};
