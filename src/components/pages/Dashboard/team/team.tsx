import { columns, DataTable } from "@/components/dashboard/team"
import type { User } from "@/types/users/users.types"

// Sample data matching your image
const data: User[] = [
    {
        id: "123",
        name: "First name Last Name",
        email: "email@example.com",
        email_verified_at: null,
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z",
    },
    {
        id: "124",
        name: "John Doe",
        email: "john.doe@example.com",
        email_verified_at: "2023-01-02T00:00:00Z",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-02T00:00:00Z",
    },
    {
        id: "125",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        email_verified_at: "2023-01-03T00:00:00Z",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-03T00:00:00Z",
    },
    {
        id: "126",
        name: "Mike Johnson",
        email: "mike.johnson@example.com",
        email_verified_at: "2023-01-04T00:00:00Z",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-04T00:00:00Z",
    },
    {
        id: "127",
        name: "Sarah Wilson",
        email: "sarah.wilson@example.com",
        email_verified_at: "2023-01-05T00:00:00Z",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-05T00:00:00Z",
    },
]

export default function TeamsPage() {
    return (
        <main className="overflow-x-hidden">
            <div className="mb-2">
                <h1 className="text-3xl font-bold">
                    Teams
                </h1>
            </div>
            <DataTable columns={columns} data={data} />
        </main>
    )
}
