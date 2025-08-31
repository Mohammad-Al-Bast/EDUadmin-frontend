import { createAsyncThunk } from '@reduxjs/toolkit';
import { registerDropCoursesAPI } from '@/services/register-drop-courses';
import type { RegisterDropCourseFormData } from '@/services/register-drop-courses';

export const submitRegisterDropCourseFormThunk = createAsyncThunk(
  'registerDropCourses/submitForm',
  async (formData: RegisterDropCourseFormData, { rejectWithValue }) => {
    try {
      const response = await registerDropCoursesAPI.create(formData);
      return response.data;
    } catch (error: any) {
      // Handle ApiError from baseAPI.ts which includes validation errors
      if (error.status === 422 && error.errors) {
        // Return the full error object for 422 validation errors
        return rejectWithValue({
          message: error.message || 'Validation failed',
          errors: error.errors,
          status: error.status
        });
      }
      // For other errors, return just the message
      return rejectWithValue(error.message || 'Submission failed');
    }
  }
);
