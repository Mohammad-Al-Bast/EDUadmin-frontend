import { useParams, useNavigate } from "react-router-dom";
import { useStudent } from "@/hooks/students/use-students";
import { Button } from "@/components/ui/button";
import { ErrorDisplay } from "@/components/ui/error-display";
// import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Convert string ID to number
  const studentId = id ? parseInt(id, 10) : 0;

  const { student, loading, error } = useStudent(studentId);

  if (loading) {
    return <main className="container mx-auto p-6 space-y-6">loading...</main>;
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
      <h2 className="text-lg font-medium mb-2">Overview</h2>

      <div className="grid grid-cols-4 gap-x-4 gap-y-2 text-sm mb-4">
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

      {/* Your Comments Section */}
      <div>
        <h2 className="text-lg font-medium mb-2">Your Comments</h2>
        <div className="relative">
          <Textarea
            placeholder="Type your message here."
            className="min-h-[120px] resize-none border-gray-200 text-sm"
          />

          <div className="flex justify-end mt-4">
            <Button className="bg-black text-white text-sm px-6 py-2 rounded">
              Send Request
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
