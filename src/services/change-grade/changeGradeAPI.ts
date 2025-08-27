import { API } from '@/api/baseAPI';

// Types for Change Grade Form API
export interface GradeRow {
  gradeType: string;
  gradePercentage: string;
  grade: string;
}

export interface ChangeGradeFormData {
  university_id: number;
  student_full_name: string;
  semester_year: string;
  major: string;
  campus: string;
  course_code: string;
  course_name: string;
  section: string;
  instructor_name: string;
  grades: GradeRow[];
  curve: number;
  final_grade: number;
  letter_grade: string;
  reason_for_change: string;
  attachments: {
    original_report: boolean;
    graded_exam: boolean;
    tuition_report: boolean;
    final_pages: boolean;
  };
}

export interface ChangeGradeForm extends ChangeGradeFormData {
  id: number;
  created_at: string;
  updated_at: string;
  status?: string;
  report_url?: string;
}

export interface EmailData {
  email: string;
  attach_pdf?: boolean;
  message?: string;
}

export interface MultipleEmailData {
  emails: string[];
  attach_pdf?: boolean;
  message?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Change Grade Form API Service
export const changeGradeAPI = {
  // CRUD Operations
  getAll: (params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }): Promise<ApiResponse<PaginatedResponse<ChangeGradeForm>>> =>
    API.get<ApiResponse<PaginatedResponse<ChangeGradeForm>>>('/change-grade-forms', params),

  create: (data: ChangeGradeFormData): Promise<ApiResponse<ChangeGradeForm>> =>
    API.post<ApiResponse<ChangeGradeForm>>('/change-grade-forms', data as any),

  getById: (id: number): Promise<ApiResponse<ChangeGradeForm>> =>
    API.get<ApiResponse<ChangeGradeForm>>(`/change-grade-forms/${id}`),

  update: (id: number, data: Partial<ChangeGradeFormData>): Promise<ApiResponse<ChangeGradeForm>> =>
    API.put<ApiResponse<ChangeGradeForm>>(`/change-grade-forms/${id}`, data as any),

  delete: (id: number): Promise<ApiResponse<{ message: string }>> =>
    API.delete<ApiResponse<{ message: string }>>(`/change-grade-forms/${id}`),

  // Report Functionality
  getAllReports: (): Promise<ApiResponse<ChangeGradeForm[]>> =>
    API.get<ApiResponse<ChangeGradeForm[]>>('/change-grade-forms/reports'),

  getReport: (id: number): Promise<ApiResponse<any>> =>
    API.get<ApiResponse<any>>(`/change-grade-forms/${id}/report`),

  getPrintableReport: (id: number): Promise<string> =>
    API.get<string>(`/change-grade-forms/${id}/printable`),

  // Email Functionality
  sendEmail: (id: number, emailData: EmailData): Promise<ApiResponse<{ message: string }>> =>
    API.post<ApiResponse<{ message: string }>>(`/change-grade-forms/${id}/send-email`, emailData as any),

  sendMultipleEmails: (id: number, emailData: MultipleEmailData): Promise<ApiResponse<{ message: string }>> =>
    API.post<ApiResponse<{ message: string }>>(`/change-grade-forms/${id}/send-multiple-emails`, emailData as any),
};
