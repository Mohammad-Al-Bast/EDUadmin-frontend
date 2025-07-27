import type { ColumnDef, Row } from "@tanstack/react-table";
import type { Course } from "@/types/courses.types";

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
]
