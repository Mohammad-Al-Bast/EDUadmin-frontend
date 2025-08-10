// Error Formatting Test Examples
// This file demonstrates how the system handles the specific error formats you mentioned

import { formatApiError } from '@/lib/utils';
import type { ApiError } from '@/api/baseAPI';

// Test data for the two error formats you specified
const testErrors: ApiError[] = [
    // Format 1: Account verification error
    {
        status: 401,
        message: "Your account is not verified. Please contact the system administrator to verify your account before you can log in.",
        errors: null,
        code: null
    },
    
    // Format 2: Invalid credentials error
    {
        status: 401,
        message: "Invalid credentials",
        errors: null,
        code: null
    },

    // Format 3: Server error with field validation
    {
        status: 422,
        message: "Validation failed",
        errors: {
            email: ["The email field is required."],
            password: ["The password field is required."]
        },
        code: null
    }
];

// Test the formatting function
export const testErrorFormatting = () => {
    console.log('=== Error Formatting Test Results ===\n');
    
    testErrors.forEach((error, index) => {
        const formatted = formatApiError(error);
        console.log(`Test ${index + 1}:`);
        console.log(`Original message: ${error.message}`);
        console.log(`Formatted title: ${formatted.title}`);
        console.log(`Formatted description: ${formatted.description}`);
        console.log('---');
    });
};

/* 
Expected Results:

Test 1:
Original message: Your account is not verified. Please contact the system administrator to verify your account before you can log in.
Formatted title: Account Verification Required
Formatted description: Your account is not verified. Please contact the system administrator to verify your account before you can log in.

Test 2:
Original message: Invalid credentials
Formatted title: Invalid Credentials
Formatted description: Please check your email and password and try again.

Test 3:
Original message: Validation failed
Formatted title: Error
Formatted description: Validation failed
*/
