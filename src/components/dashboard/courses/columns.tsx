import type { ColumnDef, Row } from "@tanstack/react-table";
import type { Course } from "@/types/courses.types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Trash2, Loader2 } from "lucide-react";
import { useDeleteCourse } from "@/hooks/courses/use-courses";
import { toast } from "sonner";
import { DeleteCourseDialog } from "./delete-course-dialog";
import { useState } from "react";

interface ColumnsProps {
  onDeleteSuccess?: () => void;
}

export const createColumns = ({
  onDeleteSuccess,
}: ColumnsProps = {}): ColumnDef<Course>[] => [
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
    cell: ({ row }: { row: Row<Course> }) => <div>{row.getValue("room")}</div>,
  },
  {
    accessorKey: "schedule",
    header: "Schedule",
    cell: ({ row }: { row: Row<Course> }) => {
      const course = row.original;
      return (
        <div className="text-sm">
          <div>
            {course.schedule} - {course.time}
          </div>
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

      // Component to use hooks properly
      function ActionsCell({
        course,
        onDeleteSuccess,
      }: {
        course: Course;
        onDeleteSuccess?: () => void;
      }) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { deleteCourse, loading } = useDeleteCourse();
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [showDeleteDialog, setShowDeleteDialog] = useState(false);

        const handleDelete = async () => {
          try {
            const success = await deleteCourse(course.course_id);
            if (success) {
              toast.success("Course deleted successfully!", {
                description: `${course.course_name} has been removed from the system.`,
              });
              onDeleteSuccess?.();
              setShowDeleteDialog(false);
            } else {
              toast.error("Failed to delete course", {
                description: "Please try again later.",
              });
            }
          } catch (error) {
            toast.error("Failed to delete course", {
              description: "An unexpected error occurred.",
            });
          }
        };

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  disabled={loading}
                >
                  <span className="sr-only">Open menu</span>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MoreVertical className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive hover:text-destructive/90!"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Course
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DeleteCourseDialog
              open={showDeleteDialog}
              onOpenChange={setShowDeleteDialog}
              onConfirm={handleDelete}
              courseName={course.course_name}
              isLoading={loading}
            />
          </>
        );
      }

      return <ActionsCell course={course} onDeleteSuccess={onDeleteSuccess} />;
    },
  },
];
