import { columns } from "@/components/dashboard/courses"
import { DataTable } from "@/components/dashboard/courses"
import { useCourses } from "@/hooks/courses/use-courses"
import { CoursesTableSkeleton } from "@/components/dashboard/courses/courses-table-skeleton"
import { ErrorDisplay } from "@/components/ui/error-display"

export default function CoursesPage() {
    const { courses, loading, error, refetch } = useCourses();

    if (loading) {
        return (
            <main className="overflow-x-hidden">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">
                        Courses
                    </h1>
                    <p className="text-muted-foreground">
                        Manage all courses in the system
                    </p>
                </div>
                <CoursesTableSkeleton />
            </main>
        );
    }

    if (error) {
        return (
            <main className="overflow-x-hidden">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">
                        Courses
                    </h1>
                    <p className="text-muted-foreground">
                        Manage all courses in the system
                    </p>
                </div>
                <div className="mt-8">
                    <ErrorDisplay
                        error={error}
                        onRetry={refetch}
                        title="Failed to Load Courses"
                    />
                </div>
            </main>
        );
    }

    return (
        <main className="overflow-x-hidden">
            <div className="mb-2">
                <h1 className="text-3xl font-bold">
                    Courses
                </h1>
                <p className="text-muted-foreground">
                    Manage all courses in the system ({courses.length} total)
                </p>
            </div>
            <DataTable columns={columns} data={courses} />
        </main>
    )
}
