import { columns, DataTable } from "@/components/dashboard/team"
import { useUsers } from "@/hooks/users/use-users"
import { UsersTableSkeleton } from "@/components/dashboard/team/users-table-skeleton"
import { ErrorDisplay } from "@/components/ui/error-display"

export default function TeamsPage() {
    const { users, loading, error, refetch } = useUsers();

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
