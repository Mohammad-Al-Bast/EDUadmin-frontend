import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RegisterDropCourseFormData } from '@/services/register-drop-courses';
import type { Course } from '@/types/courses.types';
import type { Student } from '@/types/students/students.types';
import { selectUser } from '@/store/selectors/authSelectors';
import { 
  generateCourseRegistrationHTMLReport, 
  convertCourseFormDataToReportData, 
  openCourseRegistrationReportInNewWindow, 
  downloadCourseRegistrationReportAsHTML,
  type CourseRegistrationReportData 
} from '@/utils/reportGenerator';

interface UseCourseRegistrationReportGeneratorOptions {
  onSuccess?: (reportData: CourseRegistrationReportData) => void;
  onError?: (error: string) => void;
}

export const useCourseRegistrationReportGenerator = (options: UseCourseRegistrationReportGeneratorOptions = {}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const currentUser = useSelector(selectUser);

  const generateReport = async (
    formData: RegisterDropCourseFormData,
    studentData: Student,
    coursesData: Course[],
    action: 'preview' | 'download' | 'email' = 'preview'
  ) => {
    setIsGenerating(true);
    
    try {
      // Get submitter info from the logged-in user
      const submitterInfo = {
        name: currentUser?.name || 'Current User',
        email: currentUser?.email || 'user@liu.edu.lb',
        role: currentUser?.is_admin ? 'Administrator' : 'Academic Advisor',
        ip: '192.168.1.100' // This could be obtained from a service
      };

      // Convert form data to report data
      const reportData = convertCourseFormDataToReportData(formData, studentData, coursesData, submitterInfo);
      
      // Generate HTML content
      const htmlContent = generateCourseRegistrationHTMLReport(reportData);
      
      // Handle different actions
      switch (action) {
        case 'preview':
          openCourseRegistrationReportInNewWindow(htmlContent);
          break;
          
        case 'download':
          const filename = `course-registration-report-${reportData.student_id}-${new Date().getFullYear()}.html`;
          downloadCourseRegistrationReportAsHTML(htmlContent, filename);
          break;
          
        case 'email':
          // For email, we would need to send the HTML to a backend service
          // For now, we'll just download it
          downloadCourseRegistrationReportAsHTML(htmlContent, `email-course-registration-report-${reportData.report_id}.html`);
          break;
          
        default:
          throw new Error('Invalid action specified');
      }
      
      options.onSuccess?.(reportData);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate course registration report';
      options.onError?.(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateReportPreview = (
    formData: RegisterDropCourseFormData,
    studentData: Student,
    coursesData: Course[]
  ) => {
    return generateReport(formData, studentData, coursesData, 'preview');
  };

  const downloadReport = (
    formData: RegisterDropCourseFormData,
    studentData: Student,
    coursesData: Course[]
  ) => {
    return generateReport(formData, studentData, coursesData, 'download');
  };

  const emailReport = (
    formData: RegisterDropCourseFormData,
    studentData: Student,
    coursesData: Course[]
  ) => {
    return generateReport(formData, studentData, coursesData, 'email');
  };

  return {
    isGenerating,
    generateReport,
    generateReportPreview,
    downloadReport,
    emailReport
  };
};
