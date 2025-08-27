import { useState } from 'react';
import type { ChangeGradeFormData } from '@/services/change-grade';
import { 
  generateHTMLReport, 
  convertFormDataToReportData, 
  openReportInNewWindow, 
  downloadReportAsHTML,
  type ReportData 
} from '@/utils/reportGenerator';

interface UseReportGeneratorOptions {
  onSuccess?: (reportData: ReportData) => void;
  onError?: (error: string) => void;
}

export const useReportGenerator = (options: UseReportGeneratorOptions = {}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async (
    formData: ChangeGradeFormData,
    action: 'preview' | 'download' | 'email' = 'preview'
  ) => {
    setIsGenerating(true);
    
    try {
      // Mock submitter info - in a real app, this would come from auth context
      const submitterInfo = {
        name: 'Current User', // This should come from authentication context
        email: 'user@liu.edu.lb', // This should come from authentication context
        role: 'Faculty Member', // This should come from user role
        ip: '192.168.1.100' // This could be obtained from a service
      };

      // Convert form data to report data
      const reportData = convertFormDataToReportData(formData, submitterInfo);
      
      // Generate HTML content
      const htmlContent = generateHTMLReport(reportData);
      
      // Handle different actions
      switch (action) {
        case 'preview':
          openReportInNewWindow(htmlContent);
          break;
          
        case 'download':
          const filename = `change-grade-report-${reportData.student_id}-${reportData.course_code}.html`;
          downloadReportAsHTML(htmlContent, filename);
          break;
          
        case 'email':
          // For email, we would need to send the HTML to a backend service
          // For now, we'll just download it
          downloadReportAsHTML(htmlContent, `email-report-${reportData.report_id}.html`);
          break;
          
        default:
          throw new Error('Invalid action specified');
      }
      
      options.onSuccess?.(reportData);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate report';
      options.onError?.(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateReportPreview = (formData: ChangeGradeFormData) => {
    return generateReport(formData, 'preview');
  };

  const downloadReport = (formData: ChangeGradeFormData) => {
    return generateReport(formData, 'download');
  };

  const emailReport = (formData: ChangeGradeFormData) => {
    return generateReport(formData, 'email');
  };

  return {
    isGenerating,
    generateReport,
    generateReportPreview,
    downloadReport,
    emailReport
  };
};
