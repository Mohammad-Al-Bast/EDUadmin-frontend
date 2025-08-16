import { columns } from "@/components/dashboard/students"
import { DataTable } from "@/components/dashboard/students"
import { useStudents } from "@/hooks/students/use-students"
import { StudentsTableSkeleton } from "@/components/dashboard/students/students-table-skeleton"
import { ErrorDisplay } from "@/components/ui/error-display"

export default function StudentsPage() {
    const { students, loading, error, refetch } = useStudents();

    if (loading) {
        return (
            <main className="overflow-x-hidden">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">
                        Students
                    </h1>
                    <p className="text-muted-foreground">
                        Manage all students in the system
                    </p>
                </div>
                <StudentsTableSkeleton />
            </main>
        );
    }

    if (error) {
        return (
            <main className="overflow-x-hidden">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">
                        Students
                    </h1>
                    <p className="text-muted-foreground">
                        Manage all students in the system
                    </p>
                </div>
                <div className="mt-8">
                    <ErrorDisplay
                        error={error}
                        onRetry={refetch}
                        title={
                            error.status === 403 
                                ? "Access Denied - Admin Required"
                                : "Failed to Load Students"
                        }
                    />
                </div>
            </main>
        );
    }

    return (
        <main className="overflow-x-hidden">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">
                    Students
                </h1>
                <p className="text-muted-foreground">
                    Manage all students in the system ({students.length} total)
                </p>
            </div>
            <DataTable columns={columns} data={students} />
        </main>
    )
}
