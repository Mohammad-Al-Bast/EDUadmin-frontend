import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  changeGradeAPI, 
  type ChangeGradeFormData, 
  type ChangeGradeForm,
  type EmailData,
  type MultipleEmailData 
} from '@/services/change-grade';

interface UseChangeGradeFormReturn {
  // Form submission
  submitForm: (data: ChangeGradeFormData) => Promise<ChangeGradeForm | null>;
  updateForm: (id: number, data: Partial<ChangeGradeFormData>) => Promise<ChangeGradeForm | null>;
  
  // Email functionality
  sendEmail: (formId: number, emailData: EmailData) => Promise<boolean>;
  sendMultipleEmails: (formId: number, emailData: MultipleEmailData) => Promise<boolean>;
  
  // States
  isSubmitting: boolean;
  isSendingEmail: boolean;
  error: string | null;
  submittedForm: ChangeGradeForm | null;
}

export const useChangeGradeForm = (): UseChangeGradeFormReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedForm, setSubmittedForm] = useState<ChangeGradeForm | null>(null);

  const submitForm = useCallback(async (data: ChangeGradeFormData): Promise<ChangeGradeForm | null> => {
    setIsSubmitting(true);
    setError(null);
    
    console.log('Submitting form data:', data);
    
    try {
      const response = await changeGradeAPI.create(data);
      const form = response.data;
      
      setSubmittedForm(form);
      toast.success('Change Grade Form Submitted', {
        description: 'Your grade change request has been submitted successfully.',
      });
      
      return form;
    } catch (err: any) {
      console.error('API Error Details:', err);
      
      let errorMessage = 'Failed to submit form';
      let detailedErrors = '';
      
      if (err.errors) {
        // Handle validation errors from Laravel
        if (typeof err.errors === 'object') {
          const errorList = Object.entries(err.errors)
            .map(([field, messages]) => {
              const messageArray = Array.isArray(messages) ? messages : [messages];
              return `${field}: ${messageArray.join(', ')}`;
            })
            .join('\n');
          detailedErrors = errorList;
          errorMessage = `Validation failed:\n${errorList}`;
        } else if (Array.isArray(err.errors)) {
          detailedErrors = err.errors.join('\n');
          errorMessage = `Validation failed:\n${detailedErrors}`;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
      toast.error('Submission Failed', {
        description: detailedErrors || errorMessage,
        duration: 10000, // Show longer for detailed errors
      });
      
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const updateForm = useCallback(async (id: number, data: Partial<ChangeGradeFormData>): Promise<ChangeGradeForm | null> => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await changeGradeAPI.update(id, data);
      const form = response.data;
      
      setSubmittedForm(form);
      toast.success('Form Updated', {
        description: 'Grade change form has been updated successfully.',
      });
      
      return form;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update form';
      setError(errorMessage);
      
      toast.error('Update Failed', {
        description: errorMessage,
      });
      
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const sendEmail = useCallback(async (formId: number, emailData: EmailData): Promise<boolean> => {
    setIsSendingEmail(true);
    setError(null);
    
    try {
      await changeGradeAPI.sendEmail(formId, emailData);
      
      toast.success('Email Sent', {
        description: `Grade change form has been sent to ${emailData.email}`,
      });
      
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send email';
      setError(errorMessage);
      
      toast.error('Email Failed', {
        description: errorMessage,
      });
      
      return false;
    } finally {
      setIsSendingEmail(false);
    }
  }, []);

  const sendMultipleEmails = useCallback(async (formId: number, emailData: MultipleEmailData): Promise<boolean> => {
    setIsSendingEmail(true);
    setError(null);
    
    try {
      await changeGradeAPI.sendMultipleEmails(formId, emailData);
      
      toast.success('Emails Sent', {
        description: `Grade change form has been sent to ${emailData.emails.length} recipients`,
      });
      
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send emails';
      setError(errorMessage);
      
      toast.error('Email Failed', {
        description: errorMessage,
      });
      
      return false;
    } finally {
      setIsSendingEmail(false);
    }
  }, []);

  return {
    submitForm,
    updateForm,
    sendEmail,
    sendMultipleEmails,
    isSubmitting,
    isSendingEmail,
    error,
    submittedForm,
  };
};
