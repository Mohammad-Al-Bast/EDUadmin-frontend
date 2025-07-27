import { columns } from "@/components/dashboard/students/columns"
import { DataTable } from "@/components/dashboard/students/data-table"
import { studentsData } from "@/constants/students"

export default function CoursesPage() {
    return (
        <main className="overflow-x-hidden">
            <DataTable columns={columns} data={studentsData} />
        </main>
    )
}
