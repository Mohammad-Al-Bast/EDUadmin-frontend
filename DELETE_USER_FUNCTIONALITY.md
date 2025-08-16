# Delete User Functionality Documentation

## Overview

This document explains the delete user functionality that has been implemented to integrate with the Laravel API endpoint `DELETE /api/users/{id}/delete`.

## Implementation Details

### API Integration

**Endpoint:** `DELETE /api/users/{id}/delete`
**Authentication:** Requires Bearer token (admin authentication)

**Expected Success Response:**
```json
{
    "message": "User deleted successfully",
    "delete_result": true,
    "user_id": "2"
}
```

**Error Responses:**
- `404`: `{"message": "User not found"}`
- `403`: `{"message": "Unauthorized"}` (if not admin)

### Files Modified/Created

#### 1. Service Layer (`src/services/users/users.service.ts`)
- Added `DeleteUserResponse` interface
- Added `deleteUser(id: number)` function that calls the DELETE endpoint

#### 2. Hooks Layer (`src/hooks/users/use-users.ts`)
- Extended `useUserManagement()` hook with `deleteUser` function
- Includes proper error handling and loading states

#### 3. UI Components

**a) Delete Confirmation Dialog (`src/components/ui/delete-user-dialog.tsx`)**
- Custom AlertDialog component for delete confirmation
- Shows user name and warning message
- Loading state during deletion
- Cancel and confirm actions

**b) Team Columns (`src/components/dashboard/team/columns.tsx`)**
- Added delete functionality to the actions dropdown
- Integrated with confirmation dialog
- Shows loading states and success/error toasts

### Features Implemented

#### 1. **Confirmation Dialog**
- Shows before deletion with user's name
- Warning about permanent action
- Cancel and Delete buttons
- Loading state during API call

#### 2. **Error Handling**
- Comprehensive API error handling
- User-friendly error messages
- Toast notifications for feedback

#### 3. **UI Updates**
- Real-time table refresh after successful deletion
- Loading indicators during operation
- Disabled state for buttons during loading

#### 4. **Security**
- Requires confirmation before deletion
- Admin authentication via Bearer token
- Proper error handling for unauthorized access

## Usage Instructions

### For End Users:

1. **Navigate to Teams Page**
   - Go to Dashboard → Teams

2. **Locate User to Delete**
   - Find the user in the table
   - Click the three-dot menu (⋮) in the Actions column

3. **Initiate Delete**
   - Click "Delete" from the dropdown menu
   - A confirmation dialog will appear

4. **Confirm Deletion**
   - Review the user name in the dialog
   - Click "Delete User" to confirm
   - Or click "Cancel" to abort

5. **View Results**
   - Success: User is removed from table, success toast shown
   - Error: Error toast with specific message displayed

### For Developers:

#### Using the Delete Service Directly:
```typescript
import { usersServices } from '@/services/users/users.service';

try {
  const response = await usersServices.deleteUser(userId);
  console.log('Delete successful:', response);
  // Handle success
} catch (error) {
  console.error('Delete failed:', error);
  // Handle error
}
```

#### Using the Hook:
```typescript
import { useUserManagement } from '@/hooks/users/use-users';

const { deleteUser, actionLoading, actionError } = useUserManagement();

const handleDelete = async (userId: number) => {
  try {
    const response = await deleteUser(userId);
    // Handle success
  } catch (error) {
    // Handle error - already logged in hook
  }
};
```

## Error Scenarios Handled

1. **Network Errors**
   - Connection timeout
   - Server unavailable
   - Network connectivity issues

2. **Authentication Errors**
   - Invalid or expired token
   - Insufficient permissions (non-admin)

3. **Resource Errors**
   - User not found (404)
   - User already deleted

4. **Validation Errors**
   - Invalid user ID format
   - Missing required parameters

## Security Considerations

- **Admin Only**: Only admin users can delete other users
- **Confirmation Required**: Double confirmation prevents accidental deletions
- **Audit Trail**: Laravel backend should log deletion activities
- **Irreversible Action**: Clear warning that deletion cannot be undone

## Testing

### Manual Testing Steps:

1. **Valid Deletion:**
   - Select an existing user
   - Confirm deletion
   - Verify user is removed from list
   - Check success message

2. **Cancelled Deletion:**
   - Start deletion process
   - Click "Cancel" in dialog
   - Verify no action taken

3. **Error Scenarios:**
   - Try deleting non-existent user
   - Test with invalid authentication
   - Simulate network errors

### Expected API Responses:

**Success (200):**
```json
{
    "message": "User deleted successfully",
    "delete_result": true,
    "user_id": "2"
}
```

**Not Found (404):**
```json
{
    "message": "User not found"
}
```

**Unauthorized (403):**
```json
{
    "message": "Unauthorized"
}
```

## Future Enhancements

- **Soft Delete**: Option to soft delete instead of permanent deletion
- **Bulk Delete**: Select multiple users for deletion
- **Restore Function**: Restore soft-deleted users
- **Delete History**: View history of deleted users
- **Cascade Options**: Choose what to do with user's related data
