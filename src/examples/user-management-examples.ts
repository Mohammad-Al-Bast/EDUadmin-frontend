// Example usage of the user management functionality
// This file demonstrates how the user management API calls work

import { usersServices } from '@/services/users/users.service';

// Example: Verify a user
async function exampleVerifyUser() {
  try {
    const response = await usersServices.verifyUser(1);
    console.log('User verified:', response);
    // Expected response:
    // {
    //   message: "User verified successfully",
    //   user: { id: 1, name: "John Doe", email: "john@example.com", is_verified: true }
    // }
  } catch (error) {
    console.error('Verification failed:', error);
    // Error handling is already implemented in the UI components
  }
}

// Example: Block a user
async function exampleBlockUser() {
  try {
    const response = await usersServices.blockUser(1);
    console.log('User blocked:', response);
    // Expected response:
    // {
    //   message: "User blocked successfully", 
    //   user: { id: 1, name: "John Doe", email: "john@example.com", is_blocked: true }
    // }
  } catch (error) {
    console.error('Blocking failed:', error);
  }
}

// Example: Reset user password
async function exampleResetPassword() {
  try {
    const response = await usersServices.resetUserPassword(1);
    console.log('Password reset:', response);
    // Expected response:
    // {
    //   message: "Password reset successfully",
    //   new_password: "TempPass123!",
    //   user: { id: 1, name: "John Doe", email: "john@example.com" }
    // }
    
    // In the UI, this password is automatically copied to clipboard
    if (response.new_password) {
      await navigator.clipboard.writeText(response.new_password);
      console.log('Password copied to clipboard');
    }
  } catch (error) {
    console.error('Password reset failed:', error);
  }
}

// Example: Get all users (existing functionality)
async function exampleGetUsers() {
  try {
    const users = await usersServices.getAllUsers();
    console.log('All users:', users);
    // This is used to populate the team management table
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
}

export {
  exampleVerifyUser,
  exampleBlockUser,
  exampleResetPassword,
  exampleGetUsers
};
