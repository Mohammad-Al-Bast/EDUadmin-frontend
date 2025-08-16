import type { ColumnDef, Row } from "@tanstack/react-table";
import type { Course } from "@/types/courses.types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Trash2, Edit, Eye } from "lucide-react";

export const columns: ColumnDef<Course>[] = [
    {
        accessorKey: "course_code",
        header: "Course Code",
        cell: ({ row }: { row: Row<Course> }) => (
            <div className="font-medium">{row.getValue("course_code")}</div>
        ),
    },
    {
        accessorKey: "course_name",
        header: "Course Name",
        cell: ({ row }: { row: Row<Course> }) => (
            <div className="max-w-48 truncate">{row.getValue("course_name")}</div>
        ),
    },
    {
        accessorKey: "instructor",
        header: "Instructor",
        cell: ({ row }: { row: Row<Course> }) => (
            <div>{row.getValue("instructor")}</div>
        ),
    },
    {
        accessorKey: "section",
        header: "Section",
        cell: ({ row }: { row: Row<Course> }) => (
            <Badge variant="outline">{row.getValue("section")}</Badge>
        ),
    },
    {
        accessorKey: "credits",
        header: "Credits",
        cell: ({ row }: { row: Row<Course> }) => (
            <div className="text-center">{row.getValue("credits")}</div>
        ),
    },
    {
        accessorKey: "room",
        header: "Room",
        cell: ({ row }: { row: Row<Course> }) => (
            <div>{row.getValue("room")}</div>
        ),
    },
    {
        accessorKey: "schedule",
        header: "Schedule",
        cell: ({ row }: { row: Row<Course> }) => {
            const course = row.original;
            return (
                <div className="text-sm">
                    <div>{course.schedule} - {course.time}</div>
                    <div className="text-muted-foreground text-xs">{course.days}</div>
                </div>
            );
        },
    },
    {
        accessorKey: "school",
        header: "School",
        cell: ({ row }: { row: Row<Course> }) => (
            <div className="max-w-32 truncate">{row.getValue("school")}</div>
        ),
    },
    {
        id: "actions",
        cell: ({ row }: { row: Row<Course> }) => {
            const course = row.original;
            
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => console.log('View course:', course.course_id)}>
                            <Eye className="h-4 w-4" />
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => console.log('Edit course:', course.course_id)}>
                            <Edit className="h-4 w-4" />
                            Edit Course
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            className="text-destructive hover:text-destructive/90!"
                            onClick={() => console.log('Delete course:', course.course_id)}
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete Course
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    }
]
