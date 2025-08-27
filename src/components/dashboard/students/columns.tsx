import type { ColumnDef, Row } from "@tanstack/react-table";
import { Eye, MoreVertical, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Student } from "@/types/students/students.types";
import { useDeleteStudent } from "@/hooks/students/use-students";
import { toast } from "sonner";
import { DeleteStudentDialog } from "./delete-student-dialog";
import { useState } from "react";

interface ColumnsProps {
  onDeleteSuccess?: () => void;
}

export const createColumns = ({
  onDeleteSuccess,
}: ColumnsProps = {}): ColumnDef<Student>[] => [
  {
    accessorKey: "university_id",
    header: "University ID",
    cell: ({ row }: { row: Row<Student> }) => {
      return <div className="font-medium">{row.getValue("university_id")}</div>;
    },
  },
  {
    accessorKey: "student_name",
    header: "Student Name",
    cell: ({ row }: { row: Row<Student> }) => {
      return <div className="font-medium">{row.getValue("student_name")}</div>;
    },
  },
  {
    accessorKey: "campus",
    header: "Campus",
    cell: ({ row }: { row: Row<Student> }) => {
      const campus = row.getValue("campus") as string | null;
      return <div>{campus || "Not specified"}</div>;
    },
  },
  {
    accessorKey: "school",
    header: "School",
    cell: ({ row }: { row: Row<Student> }) => {
      const school = row.getValue("school") as string | null;
      return (
        <div className="max-w-32 truncate">{school || "Not specified"}</div>
      );
    },
  },
  {
    accessorKey: "major",
    header: "Major",
    cell: ({ row }: { row: Row<Student> }) => {
      const major = row.getValue("major") as string | null;
      return <div className="max-w-40 truncate">{major || "Undeclared"}</div>;
    },
  },
  {
    accessorKey: "semester",
    header: "Semester",
    cell: ({ row }: { row: Row<Student> }) => {
      const semester = row.getValue("semester") as string | null;
      return semester ? (
        <Badge variant="outline">{semester}</Badge>
      ) : (
        <span className="text-muted-foreground">Not set</span>
      );
    },
  },
  {
    accessorKey: "year",
    header: "Year",
    cell: ({ row }: { row: Row<Student> }) => {
      const year = row.getValue("year") as number | null;
      return <div className="text-center">{year || "N/A"}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }: { row: Row<Student> }) => {
      const student = row.original;

      // Component to use hooks properly
      function ActionsCell({
        student,
        onDeleteSuccess,
      }: {
        student: Student;
        onDeleteSuccess?: () => void;
      }) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { deleteStudent, loading } = useDeleteStudent();
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [showDeleteDialog, setShowDeleteDialog] = useState(false);

        const handleDelete = async () => {
          const success = await deleteStudent(student.university_id);
          if (success) {
            toast.success("Student deleted successfully!", {
              description: `${student.student_name} has been removed from the system.`,
            });
            onDeleteSuccess?.();
            setShowDeleteDialog(false);
          } else {
            toast.error("Failed to delete student", {
              description: "Please try again later.",
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
                  onClick={() => {
                    // View student functionality
                  }}
                >
                  <Eye className="h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive hover:text-destructive/90!"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Student
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DeleteStudentDialog
              open={showDeleteDialog}
              onOpenChange={setShowDeleteDialog}
              onConfirm={handleDelete}
              studentName={student.student_name}
              studentId={student.university_id}
              isLoading={loading}
            />
          </>
        );
      }

      return (
        <ActionsCell student={student} onDeleteSuccess={onDeleteSuccess} />
      );
    },
  },
];
