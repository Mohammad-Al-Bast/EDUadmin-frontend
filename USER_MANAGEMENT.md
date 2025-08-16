# User Management Integration

This document explains the user management functionality that has been integrated with the Laravel API endpoints.

## Overview

The user management system provides administrators with the ability to perform the following actions on users:

1. **Verify User** - Marks a user as verified
2. **Block User** - Blocks a user from accessing the system
3. **Reset Password** - Generates a new password for a user

## Implementation Details

### API Endpoints

The following Laravel API endpoints are used:

- `POST /api/users/{id}/verify` - Verifies a user
- `POST /api/users/{id}/block` - Blocks a user  
- `POST /api/users/{id}/reset-password` - Resets a user's password and returns the new password

### Files Modified

1. **Services Layer** (`src/services/users/users.service.ts`)
   - Added `verifyUser()`, `blockUser()`, and `resetUserPassword()` functions
   - Added TypeScript interfaces for API responses

2. **Hooks Layer** (`src/hooks/users/use-users.ts`)
   - Added `useUserManagement()` hook for handling user actions
   - Provides loading states and error handling

3. **Types** (`src/types/users/users.types.ts`)
   - Extended User interface to include `is_verified` and `is_blocked` fields

4. **UI Components** (`src/components/dashboard/team/columns.tsx`)
   - Implemented action buttons with proper loading states
   - Added confirmation dialogs for destructive actions
   - Integrated toast notifications for success/error feedback

5. **Team Page** (`src/components/pages/Dashboard/team/team.tsx`)
   - Added refresh functionality after user actions
   - Improved page layout and descriptions

### Features

#### User Actions
- **Verify**: Confirms user account (disabled if already verified)
- **Block**: Prevents user access (disabled if already blocked, requires confirmation)
- **Reset Password**: Generates new password (disabled for blocked users, requires confirmation)

#### User Experience
- Loading indicators during API calls
- Confirmation dialogs for destructive actions
- Toast notifications for success/error feedback
- Automatic clipboard copying for new passwords
- Real-time table updates after actions
- Status badges showing user verification and block status

#### Error Handling
- Comprehensive error messages from API
- Fallback clipboard functionality
- Proper loading states and disabled buttons during operations

## API Response Examples

### Verify User Response
```json
{
  "message": "User verified successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "is_verified": true,
    "is_blocked": false
  }
}
```

### Block User Response
```json
{
  "message": "User blocked successfully",
  "user": {
    "id": 1,
    "name": "John Doe", 
    "email": "john@example.com",
    "is_verified": true,
    "is_blocked": true
  }
}
```

### Reset Password Response
```json
{
  "message": "Password reset successfully",
  "new_password": "TempPass123!",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

## Usage

1. Navigate to the Teams page in the dashboard
2. Locate the user you want to manage
3. Click the three-dot menu in the Actions column
4. Select the appropriate action (Verify, Reset Password, Block)
5. Confirm the action if prompted
6. The system will display a success/error message
7. For password resets, the new password will be automatically copied to your clipboard

## Security Considerations

- All actions require proper authentication (Bearer token)
- Confirmation dialogs prevent accidental destructive actions
- Password information is handled securely and copied to clipboard automatically
- Real-time updates ensure administrators see current user status

## Future Enhancements

- User unblocking functionality
- Bulk user operations
- User activity logging
- Email notifications for user actions
- More granular permission controls
