import { createColumns, DataTable } from "@/components/dashboard/team"
import { useUsers } from "@/hooks/users/use-users"
import { UsersTableSkeleton } from "@/components/dashboard/team/users-table-skeleton"
import { ErrorDisplay } from "@/components/ui/error-display"
import { useMemo } from "react"

export default function TeamsPage() {
    const { users, loading, error, refetch } = useUsers();

    // Create columns with refetch callback
    const columns = useMemo(() => createColumns(refetch), [refetch]);

    // Debug: Log the users data to console to see what's being received from API
    console.log('Users data from API:', users);

    if (loading) {
        return (
            <main className="overflow-x-hidden">
                <div className="mb-2">
                    <h1 className="text-3xl font-bold">
                        Teams
                    </h1>
                </div>
                <UsersTableSkeleton />
            </main>
        );
    }

    if (error) {
        return (
            <main className="overflow-x-hidden">
                <div className="mb-2">
                    <h1 className="text-3xl font-bold">
                        Teams
                    </h1>
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
        <main className="overflow-x-hidden">
            <div className="mb-2">
                <h1 className="text-3xl font-bold">
                    Teams
                </h1>
            </div>
            <DataTable columns={columns} data={users} />
        </main>
    )
}
