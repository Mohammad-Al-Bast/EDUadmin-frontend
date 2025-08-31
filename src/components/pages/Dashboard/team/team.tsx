import { createColumns, DataTable } from "@/components/dashboard/team";
import { useUsers } from "@/hooks/users/use-users";
import { UsersTableSkeleton } from "@/components/dashboard/team/users-table-skeleton";
import { ErrorDisplay } from "@/components/ui/error-display";
import { useMemo, useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddTeamMemberForm from "@/components/dashboard/team/add-team-member";

export default function TeamsPage() {
  const { users, loading, error, refetch } = useUsers();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Create columns with refetch callback
  const columns = useMemo(() => createColumns(refetch), [refetch]);

  const handleAddClick = () => {
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <main className="overflow-x-hidden">
        <div className="mb-2">
          <h1 className="text-3xl font-bold">Teams</h1>
        </div>
        <UsersTableSkeleton />
      </main>
    );
  }

  if (error) {
    return (
      <main className="overflow-x-hidden">
        <div className="mb-2">
          <h1 className="text-3xl font-bold">Teams</h1>
        </div>
        <div className="mt-8">
          <ErrorDisplay
            error={error}
            onRetry={refetch}
            title="Failed to Load Team Members"
          />
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="overflow-x-hidden">
        <div className="mb-3 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Teams</h1>
          <Button onClick={handleAddClick}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        </div>
        <DataTable columns={columns} data={users} />
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add new team member to the system
            </DialogDescription>
          </DialogHeader>
          <AddTeamMemberForm />
          <DialogFooter>
            <Button type="submit">Send Invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
