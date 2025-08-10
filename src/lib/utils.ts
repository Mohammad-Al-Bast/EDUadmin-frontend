import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ApiError } from "@/api/baseAPI"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format API error messages for consistent display
 * @param error - The API error object
 * @returns Formatted error with title and description
 */
export function formatApiError(error: ApiError | null): {
  title: string;
  description: string;
} {
  if (!error?.message) {
    return {
      title: 'Error',
      description: 'An unexpected error occurred. Please try again.',
    };
  }

  const message = error.message.toLowerCase();

  // Handle account verification errors
  if (message.includes('not verified') || message.includes('verify')) {
    return {
      title: 'Account Verification Required',
      description: error.message,
    };
  }

  // Handle invalid credentials
  if (message.includes('invalid credentials') || message.includes('unauthorized')) {
    return {
      title: 'Invalid Credentials',
      description: 'Please check your email and password and try again.',
    };
  }

  // Handle network errors
  if (message.includes('network') || message.includes('connection')) {
    return {
      title: 'Connection Error',
      description: 'Please check your internet connection and try again.',
    };
  }

  // Handle server errors
  if (error.status && error.status >= 500) {
    return {
      title: 'Server Error',
      description: 'The server is experiencing issues. Please try again later.',
    };
  }

  // Default error formatting
  return {
    title: 'Error',
    description: error.message,
  };
}
