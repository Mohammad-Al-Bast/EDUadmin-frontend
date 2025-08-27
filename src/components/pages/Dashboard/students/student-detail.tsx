import { useParams, useNavigate } from "react-router-dom";
import { useStudent } from "@/hooks/students/use-students";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorDisplay } from "@/components/ui/error-display";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Convert string ID to number
  const studentId = id ? parseInt(id, 10) : 0;

  const { student, loading, error } = useStudent(studentId);

  if (loading) {
    return (
      <main className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/dashboard/students")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Students
          </Button>
        </div>
        <ErrorDisplay error={error} onRetry={() => window.location.reload()} />
      </main>
    );
  }

  if (!student) {
    return (
      <main className="container mx-auto p-6">
        <Card>
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold text-muted-foreground">
              Student not found
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              The student with ID {id} could not be found.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="">
      {/* Student Information Card */}
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-4 gap-x-8 gap-y-2 text-sm">
            <div>
              <div className="text-gray-500">Student ID</div>
              <div>{student.university_id}</div>
            </div>
            <div>
              <div className="text-gray-500">Campus</div>
              <div>{student.campus}</div>
            </div>
            <div>
              <div className="text-gray-500">Major</div>
              <div>{student.major}</div>
            </div>
            <div>
              <div className="text-gray-500">Year</div>
              <div>{student.year}</div>
            </div>
            <div>
              <div className="text-gray-500">Student Name</div>
              <div>{student.student_name}</div>
            </div>
            <div>
              <div className="text-gray-500">School</div>
              <div>{student.school}</div>
            </div>
            <div>
              <div className="text-gray-500">Semester</div>
              <div>{student.semester}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
