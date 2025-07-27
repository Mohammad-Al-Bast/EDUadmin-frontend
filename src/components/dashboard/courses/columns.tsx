import type { ColumnDef, Row } from "@tanstack/react-table";
import type { Course } from "@/types/courses.types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash2 } from "lucide-react";

export const columns: ColumnDef<Course>[] = [
    {
        accessorKey: "courseCode",
        header: "Course Code",
        cell: ({ row }: { row: Row<Course> }) => <div className="font-medium">{row.getValue("courseCode")}</div>,
    },
    {
        accessorKey: "course",
        header: "Course Name",
        cell: ({ row }: { row: Row<Course> }) => <div>{row.getValue("course")}</div>,
    },
    {
        accessorKey: "instructor",
        header: "Instructor",
        cell: ({ row }: { row: Row<Course> }) => <div>{row.getValue("instructor")}</div>,
    },
    {
        accessorKey: "section",
        header: "Section",
        cell: ({ row }: { row: Row<Course> }) => <div>{row.getValue("section")}</div>,
    },
    {
        accessorKey: "credits",
        header: "Credits",
        cell: ({ row }: { row: Row<Course> }) => <div>{row.getValue("credits")}</div>,
    },
    {
        accessorKey: "room",
        header: "Room",
        cell: ({ row }: { row: Row<Course> }) => <div>{row.getValue("room")}</div>,
    },
    {
        accessorKey: "schedule",
        header: "Schedule",
        cell: ({ row }: { row: Row<Course> }) => {
            const schedule = row.original.schedule;
            return <div>{schedule.day}, {schedule.time}</div>;
        },
    },
    {
        accessorKey: "school",
        header: "School",
        cell: ({ row }: { row: Row<Course> }) => <div>{row.getValue("school")}</div>,
    },
    {
        id: "actions",
        cell: () => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem className="text-destructive hover:text-destructive/90!">
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    }
]
