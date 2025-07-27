import type { ColumnDef } from "@tanstack/react-table"
import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Student } from "@/types/students.types"

export const columns: ColumnDef<Student>[] = [
    {
        accessorKey: "studentId",
        header: "Student ID",
        cell: ({ row }) => {
            return <div className="font-medium">{row.getValue("studentId")}</div>
        },
    },
    {
        accessorKey: "studentName",
        header: "Student Name",
        cell: ({ row }) => {
            return <div>{row.getValue("studentName")}</div>
        },
    },
    {
        accessorKey: "campus",
        header: "Campus",
        cell: ({ row }) => {
            return <div>{row.getValue("campus")}</div>
        },
    },
    {
        accessorKey: "school",
        header: "School",
        cell: ({ row }) => {
            return <div>{row.getValue("school")}</div>
        },
    },
    {
        accessorKey: "major",
        header: "Major",
        cell: ({ row }) => {
            return <div>{row.getValue("major")}</div>
        },
    },
    {
        accessorKey: "semester",
        header: "Semester",
        cell: ({ row }) => {
            return <div>{row.getValue("semester")}</div>
        },
    },
    {
        accessorKey: "year",
        header: "Year",
        cell: ({ row }) => {
            return <div>{row.getValue("year")}</div>
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const student = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(student.id)}>
                            Copy student ID
                        </DropdownMenuItem>
                        <DropdownMenuItem>View student</DropdownMenuItem>
                        <DropdownMenuItem>Edit student</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
