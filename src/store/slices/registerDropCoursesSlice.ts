import { createSlice } from '@reduxjs/toolkit';
import type { RegisterDropCourseForm } from '@/services/register-drop-courses';
import { submitRegisterDropCourseFormThunk } from '@/store/thunks/registerDropCoursesThunks';

interface RegisterDropCoursesState {
  forms: RegisterDropCourseForm[];
  loading: boolean;
  error: string | null;
  validationErrors: Record<string, string[]> | null;
  success: boolean;
}

const initialState: RegisterDropCoursesState = {
  forms: [],
  loading: false,
  error: null,
  validationErrors: null,
  success: false,
};

const registerDropCoursesSlice = createSlice({
  name: 'registerDropCourses',
  initialState,
  reducers: {
    resetStatus(state) {
      state.success = false;
      state.error = null;
      state.validationErrors = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitRegisterDropCourseFormThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.validationErrors = null;
        state.success = false;
      })
      .addCase(submitRegisterDropCourseFormThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.forms.push(action.payload);
      })
      .addCase(submitRegisterDropCourseFormThunk.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        
        // Handle validation errors vs general errors
        const payload = action.payload as any;
        if (payload && typeof payload === 'object' && payload.errors) {
          state.error = payload.message;
          state.validationErrors = payload.errors;
        } else {
          state.error = payload as string || 'Submission failed';
          state.validationErrors = null;
        }
      });
  },
});

export const { resetStatus } = registerDropCoursesSlice.actions;
export default registerDropCoursesSlice.reducer;
