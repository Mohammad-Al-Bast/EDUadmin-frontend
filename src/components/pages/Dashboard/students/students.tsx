import { columns } from "@/components/dashboard/students"
import { DataTable } from "@/components/dashboard/students"
import { studentsData } from "@/constants/students"

export default function StudentsPage() {
    return (
        <main className="overflow-x-hidden">
            <DataTable columns={columns} data={studentsData} />
        </main>
    )
}
