import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/redux';
import { logoutAsync } from '@/store/thunks/authThunks';
import { persistor } from '@/store/index';
import { toast } from 'sonner';

/**
 * Custom hook for handling user logout using async thunk
 * Clears auth state, purges persisted data, shows success toast, and navigates to login
 */
export const useLogout = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const logout = async () => {
        try {
            // Dispatch logout async thunk to handle cleanup
            const result = await dispatch(logoutAsync()).unwrap();
            
            if (result) {
                // Purge persisted state
                await persistor.purge();
                
                // Show success toast
                toast.success('Logged out successfully!', {
                    description: 'You have been logged out. See you next time!',
                });
                
                // Navigate to login page
                navigate('/auth/login');
            }
            
        } catch (error) {
            // Show error toast if logout fails
            toast.error('Logout failed', {
                description: 'An error occurred while logging out. Please try again.',
            });
        }
    };

    return { logout };
};