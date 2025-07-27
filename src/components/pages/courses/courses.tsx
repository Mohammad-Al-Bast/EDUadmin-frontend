import { columns } from "@/components/dashboard/courses"
import { DataTable } from "@/components/dashboard/courses"
import { coursesData } from "@/constants/courses"

export default function CoursesPage() {
    return (
        <main className="overflow-x-hidden">
            <DataTable columns={columns} data={coursesData} />
        </main>
    )
}
