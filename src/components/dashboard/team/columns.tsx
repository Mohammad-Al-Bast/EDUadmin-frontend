import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  ShieldBan,
  ShieldCheck,
  Trash2,
  Loader2,
  KeyRound,
} from "lucide-react";
import type { User } from "@/types/users/users.types";
import { useUserManagement } from "@/hooks/users/use-users";
import { toast } from "sonner";
import { useState } from "react";
import { DeleteUserDialog } from "@/components/dashboard/team/delete-user-dialog";
import { AdminResetPasswordDialog } from "@/components/dashboard/team/admin-reset-password-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Cell component for actions to use hooks
function ActionsCell({
  user,
  onRefetch,
}: {
  user: User;
  onRefetch?: () => void;
}) {
  const {
    verifyUser,
    blockUser,
    adminSetUserPassword,
    deleteUser,
    actionLoading,
  } = useUserManagement();
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAdminResetDialog, setShowAdminResetDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);

  const handleVerifyUser = async () => {
    try {
      setCurrentAction("verify");
      const response = await verifyUser(user.id);
      toast.success("User Verified Successfully", {
        description:
          response?.message || `${user.name} has been verified successfully.`,
      });
      // Refresh the user list
      onRefetch?.();
    } catch (error: any) {
      toast.error("Verification Failed", {
        description:
          error?.message || "Failed to verify user. Please try again.",
      });
    } finally {
      setCurrentAction(null);
    }
  };

  const handleBlockUser = async () => {
    try {
      setCurrentAction("block");
      const response = await blockUser(user.id);
      toast.success("User Blocked Successfully", {
        description:
          response?.message || `${user.name} has been blocked successfully.`,
      });
      // Refresh the user list
      onRefetch?.();
      setShowBlockDialog(false);
    } catch (error: any) {
      toast.error("Block Failed", {
        description:
          error?.message || "Failed to block user. Please try again.",
      });
    } finally {
      setCurrentAction(null);
    }
  };

  const handleAdminSetPassword = async (newPassword: string) => {
    try {
      setCurrentAction("admin-reset");
      const response = await adminSetUserPassword(user.id, newPassword);

      toast.success("Password Set Successfully", {
        description:
          response?.message ||
          `Password for ${user.name} has been updated successfully.`,
      });

      // Refresh the user list
      onRefetch?.();
    } catch (error: any) {
      toast.error("Password Set Failed", {
        description:
          error?.message || "Failed to set new password. Please try again.",
      });
      throw error; // Re-throw to let dialog handle it
    } finally {
      setCurrentAction(null);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setCurrentAction("delete");
      const response = await deleteUser(user.id);
      toast.success("User Deleted Successfully", {
        description:
          response?.message || `${user.name} has been deleted successfully.`,
      });
      // Refresh the user list
      onRefetch?.();
      setShowDeleteDialog(false);
    } catch (error: any) {
      toast.error("Delete Failed", {
        description:
          error?.message || "Failed to delete user. Please try again.",
      });
    } finally {
      setCurrentAction(null);
    }
  };

  const isLoading = actionLoading && currentAction !== null;
  // Fix: Only check is_verified field, not email_verified_at timestamp
  const isVerified = user.is_verified === true;
  const isBlocked = user.is_blocked === true;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            disabled={isLoading}
          >
            <span className="sr-only">Open menu</span>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreVertical className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={handleVerifyUser}
            disabled={isLoading || isVerified}
          >
            {currentAction === "verify" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShieldCheck className="h-4 w-4" />
            )}
            {isVerified ? "Already Verified" : "Verify"}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowAdminResetDialog(true)}
            disabled={isLoading || isBlocked}
          >
            {currentAction === "admin-reset" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <KeyRound className="h-4 w-4" />
            )}
            Reset Password
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowBlockDialog(true)}
            disabled={isLoading || isBlocked}
          >
            {currentAction === "block" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShieldBan className="h-4 w-4" />
            )}
            {isBlocked ? "Already Blocked" : "Block"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive hover:text-destructive/90!"
            disabled={isLoading}
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteUserDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteUser}
        userName={user.name}
        isLoading={currentAction === "delete"}
      />
      <AdminResetPasswordDialog
        open={showAdminResetDialog}
        onOpenChange={setShowAdminResetDialog}
        onConfirm={handleAdminSetPassword}
        userName={user.name}
        isLoading={currentAction === "admin-reset"}
      />
      <AlertDialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Block User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to block {user.name}? This action will
              prevent them from accessing the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBlockUser}
              disabled={currentAction === "block"}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {currentAction === "block" ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Block User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Function to create columns with refetch callback
export const createColumns = (onRefetch?: () => void): ColumnDef<User>[] => [
  {
    accessorKey: "id",
    header: "Member ID",
    cell: ({ row }) => {
      const id = row.getValue("id") as number;
      return <div className="font-medium">#{id}</div>;
    },
  },
  {
    accessorKey: "name",
    header: "Member Name",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return <div className="font-medium">{name}</div>;
    },
  },
  {
    accessorKey: "email",
    header: "Email Address",
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return <div className="text-sm text-muted-foreground">{email}</div>;
    },
  },
  {
    accessorKey: "email_verified_at",
    header: "Status",
    cell: ({ row }) => {
      const user = row.original;
      // Fix: Only check is_verified field, not email_verified_at timestamp
      const isVerified = user.is_verified === true;
      const isBlocked = user.is_blocked === true;

      if (isBlocked) {
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            Blocked
          </span>
        );
      }

      return isVerified ? (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          Verified
        </span>
      ) : (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
          Unverified
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      return <ActionsCell user={user} onRefetch={onRefetch} />;
    },
  },
];

// Default columns for backward compatibility
export const columns = createColumns();
