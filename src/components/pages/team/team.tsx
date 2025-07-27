import { columns, DataTable, type Member } from "@/components/dashboard/team"



// Sample data matching your image
const data: Member[] = [
    {
        id: "123",
        name: "First name Last Name",
        email: "email@example.com",
    },
    {
        id: "124",
        name: "John Doe",
        email: "john.doe@example.com",
    },
    {
        id: "125",
        name: "Jane Smith",
        email: "jane.smith@example.com",
    },
    {
        id: "126",
        name: "Mike Johnson",
        email: "mike.johnson@example.com",
    },
    {
        id: "127",
        name: "Sarah Wilson",
        email: "sarah.wilson@example.com",
    },
]

export default function TeamsPage() {
    return (
        <div>
            <div className="mb-2">
                <h1 className="text-3xl font-bold">
                    Teams
                </h1>
            </div>
            <DataTable columns={columns} data={data} />
        </div>
    )
}
