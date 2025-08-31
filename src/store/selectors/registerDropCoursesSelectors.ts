import type { RootState } from '@/store';

export const selectRegisterDropCourses = (state: RootState) => state.registerDropCourses;
export const selectRegisterDropCoursesLoading = (state: RootState) => state.registerDropCourses.loading;
export const selectRegisterDropCoursesError = (state: RootState) => state.registerDropCourses.error;
export const selectRegisterDropCoursesValidationErrors = (state: RootState) => state.registerDropCourses.validationErrors;
export const selectRegisterDropCoursesSuccess = (state: RootState) => state.registerDropCourses.success;
