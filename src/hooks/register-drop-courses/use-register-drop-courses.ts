import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store';
import { 
  selectRegisterDropCoursesLoading, 
  selectRegisterDropCoursesError, 
  selectRegisterDropCoursesValidationErrors,
  selectRegisterDropCoursesSuccess 
} from '@/store/selectors/registerDropCoursesSelectors';
import { resetStatus } from '@/store/slices/registerDropCoursesSlice';
import { submitRegisterDropCourseFormThunk } from '@/store/thunks/registerDropCoursesThunks';
import type { RegisterDropCourseFormData } from '@/services/register-drop-courses';

export const useRegisterDropCourses = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectRegisterDropCoursesLoading);
  const error = useSelector(selectRegisterDropCoursesError);
  const validationErrors = useSelector(selectRegisterDropCoursesValidationErrors);
  const success = useSelector(selectRegisterDropCoursesSuccess);

  const submitForm = (formData: RegisterDropCourseFormData) => {
    return dispatch(submitRegisterDropCourseFormThunk(formData));
  };

  const resetFormStatus = () => {
    dispatch(resetStatus());
  };

  return {
    loading,
    error,
    validationErrors,
    success,
    submitForm,
    resetFormStatus,
  };
};
