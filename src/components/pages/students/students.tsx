import { columns } from "@/components/dashboard/students/columns"
import { DataTable } from "@/components/dashboard/students/data-table"
import { studentsData } from "@/constants/students"

export default function StudentsPage() {
    return (
        <div>
            <DataTable columns={columns} data={studentsData} />
        </div>
    )
}
