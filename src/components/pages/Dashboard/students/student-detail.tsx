import { useParams, useNavigate } from "react-router-dom";
import { useStudent } from "@/hooks/students/use-students";
import { Button } from "@/components/ui/button";
import { ErrorDisplay } from "@/components/ui/error-display";
// import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useCourses } from "@/hooks/courses/use-courses";
import MultipleSelector from "@/components/ui/multiple-selector";
import type { Option } from "@/components/ui/multiple-selector";
import { Label } from "@/components/ui/label";
import { useCallback, useMemo, useState } from "react";
import type { Course } from "@/types/courses.types";

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State for course details selectors
  const [selectedCourseCode, setSelectedCourseCode] = useState<Option[]>([]);
  const [selectedCourseName, setSelectedCourseName] = useState<Option[]>([]);
  const [selectedSection, setSelectedSection] = useState<Option[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Convert string ID to number
  const studentId = id ? parseInt(id, 10) : 0;

  const { student, loading, error } = useStudent(studentId);

  // Hook for fetching courses data
  const {
    courses,
    loading: coursesLoading,
    error: coursesError,
    refetch: refetchCourses,
  } = useCourses();

  // Transform courses data to options format
  const courseCodeOptions: Option[] = useMemo(() => {
    if (!courses) return [];
    // Get unique course codes
    const uniqueCodes = [
      ...new Set(courses.map((course) => course.course_code)),
    ];
    const options = uniqueCodes.map((code) => ({
      value: code,
      label: code,
    }));
    return options;
  }, [courses]);

  const courseNameOptions: Option[] = useMemo(() => {
    if (!courses) return [];
    // Get unique course names
    const uniqueNames = [
      ...new Set(courses.map((course) => course.course_name)),
    ];
    const options = uniqueNames.map((name) => ({
      value: name,
      label: name,
    }));
    return options;
  }, [courses]);

  // Get available sections for the selected course code/name combination
  const availableSections = useMemo(() => {
    if (!courses || !selectedCourse) return [];

    // Find all courses that match either the selected code or name
    const matchingCourses = courses.filter((course) => {
      const hasMatchingCode =
        selectedCourseCode.length > 0 &&
        course.course_code === selectedCourseCode[0]?.value;
      const hasMatchingName =
        selectedCourseName.length > 0 &&
        course.course_name === selectedCourseName[0]?.value;

      // If both are selected, match both
      if (selectedCourseCode.length > 0 && selectedCourseName.length > 0) {
        return hasMatchingCode && hasMatchingName;
      }

      // If only one is selected, match that one
      return hasMatchingCode || hasMatchingName;
    });

    return matchingCourses;
  }, [courses, selectedCourse, selectedCourseCode, selectedCourseName]);

  const sectionOptions: Option[] = useMemo(() => {
    if (availableSections.length === 0) return [];

    // Get unique sections from matching courses
    const uniqueSections = [
      ...new Set(availableSections.map((course) => course.section)),
    ];
    const options = uniqueSections.map((section) => ({
      value: section,
      label: `Section ${section}`,
    }));
    return options;
  }, [availableSections]);

  // Handler for course code selection
  const handleCourseCodeChange = useCallback(
    (options: Option[]) => {
      setSelectedCourseCode(options);

      if (options.length > 0 && courses) {
        // Find the course with this code
        const selectedCode = options[0].value;
        const courseWithCode = courses.find(
          (course) => course.course_code === selectedCode
        );

        if (courseWithCode) {
          // Auto-fill course name
          setSelectedCourseName([
            {
              value: courseWithCode.course_name,
              label: courseWithCode.course_name,
            },
          ]);
          setSelectedCourse(courseWithCode);
        }
      } else {
        // Clear course name and selected course if no code is selected
        setSelectedCourseName([]);
        setSelectedCourse(null);
      }

      // Always clear section when course changes
      setSelectedSection([]);
    },
    [courses]
  );

  // Handler for course name selection
  const handleCourseNameChange = useCallback(
    (options: Option[]) => {
      setSelectedCourseName(options);

      if (options.length > 0 && courses) {
        // Find the course with this name
        const selectedName = options[0].value;
        const courseWithName = courses.find(
          (course) => course.course_name === selectedName
        );

        if (courseWithName) {
          // Auto-fill course code
          setSelectedCourseCode([
            {
              value: courseWithName.course_code,
              label: courseWithName.course_code,
            },
          ]);
          setSelectedCourse(courseWithName);
        }
      } else {
        // Clear course code and selected course if no name is selected
        setSelectedCourseCode([]);
        setSelectedCourse(null);
      }

      // Always clear section when course changes
      setSelectedSection([]);
    },
    [courses]
  );

  // Handler for section selection
  const handleSectionChange = useCallback(
    (options: Option[]) => {
      setSelectedSection(options);

      // When section is selected, find and set the complete course
      if (
        options.length > 0 &&
        courses &&
        selectedCourseCode.length > 0 &&
        selectedCourseName.length > 0
      ) {
        const selectedSectionValue = options[0].value;
        const selectedCodeValue = selectedCourseCode[0].value;
        const selectedNameValue = selectedCourseName[0].value;

        // Find the exact course that matches code, name, and section
        const exactCourse = courses.find(
          (course) =>
            course.course_code === selectedCodeValue &&
            course.course_name === selectedNameValue &&
            course.section === selectedSectionValue
        );

        if (exactCourse) {
          setSelectedCourse(exactCourse);
        }
      } else {
        // Clear selected course if no section is selected
        setSelectedCourse(null);
      }
    },
    [courses, selectedCourseCode, selectedCourseName]
  );

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

      <div className="">
        {/* Course Details Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="courseCode" className="text-sm font-medium">
              Course Code
              <span className="text-sm text-gray-500 ml-1">
                Only one value can be selected
              </span>
            </Label>
            <div className="relative">
              <MultipleSelector
                value={selectedCourseCode}
                onChange={handleCourseCodeChange}
                options={courseCodeOptions}
                placeholder={
                  coursesLoading ? "Loading courses..." : "Select course code"
                }
                maxSelected={1}
                disabled={coursesLoading}
                className={coursesError ? "border-red-300" : ""}
              />
              {coursesLoading && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                </div>
              )}
            </div>
            {coursesError && (
              <div className="flex items-center gap-1 text-xs text-red-500 mt-1">
                <AlertCircle className="h-3 w-3" />
                <span>Failed to load courses</span>
                <button
                  onClick={refetchCourses}
                  className="text-blue-500 underline hover:no-underline"
                  type="button"
                >
                  Retry
                </button>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="courseName" className="text-sm font-medium">
              Course Name
              <span className="text-sm text-gray-500 ml-1">
                Only one value can be selected
              </span>
            </Label>
            <div className="relative">
              <MultipleSelector
                value={selectedCourseName}
                onChange={handleCourseNameChange}
                options={courseNameOptions}
                placeholder={
                  coursesLoading ? "Loading courses..." : "Select course name"
                }
                maxSelected={1}
                disabled={coursesLoading}
                className={coursesError ? "border-red-300" : ""}
              />
              {coursesLoading && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                </div>
              )}
            </div>
            {coursesError && (
              <div className="flex items-center gap-1 text-xs text-red-500 mt-1">
                <AlertCircle className="h-3 w-3" />
                <span>Failed to load courses</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="section" className="text-sm font-medium">
              Section
              <span className="text-sm text-gray-500 ml-1">
                Only one value can be selected
              </span>
            </Label>
            <div className="relative">
              <MultipleSelector
                value={selectedSection}
                onChange={handleSectionChange}
                options={sectionOptions}
                placeholder={
                  coursesLoading
                    ? "Loading sections..."
                    : !selectedCourse
                    ? "Select a course first"
                    : sectionOptions.length === 0
                    ? "No sections available"
                    : "Select section"
                }
                maxSelected={1}
                disabled={
                  coursesLoading ||
                  !selectedCourse ||
                  sectionOptions.length === 0
                }
                className={coursesError ? "border-red-300" : ""}
              />
              {coursesLoading && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                </div>
              )}
            </div>
            {coursesError && (
              <div className="flex items-center gap-1 text-xs text-red-500 mt-1">
                <AlertCircle className="h-3 w-3" />
                <span>Failed to load sections</span>
              </div>
            )}
            {!coursesError && selectedCourse && sectionOptions.length === 0 && (
              <div className="flex items-center gap-1 text-xs text-amber-600 mt-1">
                <AlertCircle className="h-3 w-3" />
                <span>No sections available for this course</span>
              </div>
            )}
          </div>
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
