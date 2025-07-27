import { columns } from "@/components/dashboard/students/columns"
import { DataTable } from "@/components/dashboard/students/data-table"
import { studentsData } from "@/constants/students"

export default function StudentsPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Students</h1>
                <p className="text-muted-foreground">Manage and view all student information</p>
            </div>
            <DataTable columns={columns} data={studentsData} />
        </div>
    )
}
