import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import MultipleSelector from "@/components/ui/multiple-selector";
import type { Option } from "@/components/ui/multiple-selector";
import { useStudent } from "@/hooks/students/use-students";
import { useCourses } from "@/hooks/courses/use-courses";
import { universityIdSchema, studentIdInputSchema } from "@/schemas/students";
import type { Student } from "@/types/students/students.types";
import { Loader2, AlertCircle } from "lucide-react";

interface GradeRow {
  id: string;
  gradeType: string;
  preschoolPercent: string;
  customPercent: string;
  tenPercent: string;
  grade: string;
}

export function ChangeGradeForm() {
  // State for student ID and related data
  const [studentId, setStudentId] = useState<string>("");
  const [validStudentId, setValidStudentId] = useState<number | null>(null);
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [inputError, setInputError] = useState<string>("");

  // State for course details selectors
  const [selectedCourseCode, setSelectedCourseCode] = useState<Option[]>([]);
  const [selectedCourseName, setSelectedCourseName] = useState<Option[]>([]);
  const [selectedSection, setSelectedSection] = useState<Option[]>([]);

  // Hook for fetching student data
  const {
    student,
    loading: studentLoading,
    error: studentError,
  } = useStudent(validStudentId!);

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
    const options = courses.map((course) => ({
      value: course.course_code,
      label: `${course.course_code}`,
    }));
    return options;
  }, [courses]);

  const courseNameOptions: Option[] = useMemo(() => {
    if (!courses) return [];
    const options = courses.map((course) => ({
      value: course.course_name,
      label: course.course_name,
    }));
    return options;
  }, [courses]);

  const sectionOptions: Option[] = useMemo(() => {
    if (!courses) return [];
    // Get unique sections from all courses
    const uniqueSections = [
      ...new Set(courses.map((course) => course.section)),
    ];
    const options = uniqueSections.map((section) => ({
      value: section,
      label: `Section ${section}`,
    }));
    return options;
  }, [courses]);

  const [gradeRows, setGradeRows] = useState<GradeRow[]>([
    {
      id: "1",
      gradeType: "",
      preschoolPercent: "",
      customPercent: "",
      tenPercent: "10%",
      grade: "",
    },
    {
      id: "2",
      gradeType: "",
      preschoolPercent: "",
      customPercent: "",
      tenPercent: "10%",
      grade: "",
    },
  ]);

  // Effect to update student data when fetched
  useEffect(() => {
    if (student) {
      setStudentData(student);
    }
  }, [student]);

  // Effect to clear student data and errors when validStudentId changes
  useEffect(() => {
    if (!validStudentId) {
      setStudentData(null);
    }
  }, [validStudentId]);

  // Handler for student ID input change
  const handleStudentIdChange = useCallback((value: string) => {
    // Reset previous errors
    setInputError("");

    // Validate input format (only digits, max 8 characters)
    const inputValidation = studentIdInputSchema.safeParse(value);
    if (!inputValidation.success) {
      setInputError("Only digits allowed, maximum 8 characters");
      return;
    }

    setStudentId(value);

    // If we have exactly 8 digits, validate and fetch student data
    if (value.length === 8) {
      const validation = universityIdSchema.safeParse(value);
      if (validation.success) {
        setValidStudentId(validation.data);
      } else {
        setInputError(
          validation.error.issues[0]?.message || "Invalid student ID"
        );
        setValidStudentId(null);
      }
    } else {
      // Clear student data if input is not complete
      setValidStudentId(null);
    }
  }, []);

  const addGradeRow = () => {
    const newRow: GradeRow = {
      id: Date.now().toString(),
      gradeType: "",
      preschoolPercent: "",
      customPercent: "",
      tenPercent: "10%",
      grade: "",
    };
    setGradeRows([...gradeRows, newRow]);
  };

  const updateGradeRow = (id: string, field: keyof GradeRow, value: string) => {
    setGradeRows(
      gradeRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  return (
    <div className="">
      {/* Student Information Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Student id */}
        <div className="space-y-2">
          <Label htmlFor="studentId" className="text-sm font-medium">
            Student ID
          </Label>
          <div className="relative">
            <Input
              id="studentId"
              placeholder="Enter 8-digit Student ID"
              className={`h-9 pr-8 ${inputError ? "border-red-500" : ""}`}
              value={studentId}
              onChange={(e) => handleStudentIdChange(e.target.value)}
              maxLength={8}
            />
            {studentLoading && studentId.length > 0 && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
              </div>
            )}
          </div>
          {inputError && (
            <p className="text-xs text-red-500 mt-1">{inputError}</p>
          )}
          {studentError && !inputError && (
            <p className="text-xs text-red-500 mt-1">
              {studentError.message || "Failed to fetch student data"}
            </p>
          )}
        </div>

        {/* Student full name */}
        <div className="space-y-2">
          <Label htmlFor="studentName" className="text-sm font-medium">
            Student Full Name
          </Label>
          <Input
            id="studentName"
            placeholder="Auto-filled from student ID"
            className="h-9"
            value={studentData?.student_name || ""}
            disabled
          />
        </div>

        {/* Semester/Year */}
        <div className="space-y-2">
          <Label htmlFor="semester" className="text-sm font-medium">
            Semester/Year
          </Label>
          <Input
            id="semester"
            placeholder="Auto-filled from student ID"
            className="h-9"
            value={
              studentData
                ? `${studentData.semester || "N/A"}/${
                    studentData.year || "N/A"
                  }`
                : ""
            }
            disabled
          />
        </div>
      </div>

      {/* Course Information Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Major */}
        <div className="space-y-2">
          <Label htmlFor="major" className="text-sm font-medium">
            Major
          </Label>
          <Input
            id="major"
            placeholder="Auto-filled from student ID"
            className="h-9"
            value={studentData?.major || ""}
            disabled
          />
        </div>

        {/* Campus */}
        <div className="space-y-2">
          <Label htmlFor="campus" className="text-sm font-medium">
            Campus
          </Label>
          <Input
            id="campus"
            placeholder="Auto-filled from student ID"
            className="h-9"
            value={studentData?.campus || ""}
            disabled
          />
        </div>
      </div>

      {/* Course Details Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="courseCode" className="text-sm font-medium">
            Course Code
            <span className="text-sm text-gray-500">
              Only one value can be selected
            </span>
          </Label>
          <div className="relative">
            <MultipleSelector
              value={selectedCourseCode}
              onChange={setSelectedCourseCode}
              options={courseCodeOptions}
              placeholder={
                coursesLoading ? "Loading courses..." : "Select course code"
              }
              maxSelected={1}
              disabled={coursesLoading}
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
            <span className="text-sm text-gray-500">
              Only one value can be selected
            </span>
          </Label>
          <div className="relative">
            <MultipleSelector
              value={selectedCourseName}
              onChange={setSelectedCourseName}
              options={courseNameOptions}
              placeholder={
                coursesLoading ? "Loading courses..." : "Select course name"
              }
              maxSelected={1}
              disabled={coursesLoading}
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
            <span className="text-sm text-gray-500">
              Only one value can be selected
            </span>
          </Label>
          <div className="relative">
            <MultipleSelector
              value={selectedSection}
              onChange={setSelectedSection}
              options={sectionOptions}
              placeholder={
                coursesLoading ? "Loading sections..." : "Select section"
              }
              maxSelected={1}
              disabled={coursesLoading}
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
        </div>
      </div>

      {/* Course Grades Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Label className="text-sm font-medium">Course Grades</Label>
          <Button type="button" onClick={addGradeRow}>
            Add Custom
          </Button>
        </div>

        {/* Grade Headers */}
        <div className="grid grid-cols-6 gap-2 mb-2 text-xs text-gray-600 font-medium">
          <div>Grade Type</div>
          <div>Preschool %</div>
          <div>Custom %</div>
          <div>10%</div>
          <div>Grade</div>
          <div></div>
        </div>

        {/* Grade Rows */}
        {gradeRows.map((row) => (
          <div key={row.id} className="grid grid-cols-6 gap-2 mb-2">
            <Select
              value={row.gradeType}
              onValueChange={(value) =>
                updateGradeRow(row.id, "gradeType", value)
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Grade Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="midterm">Midterm</SelectItem>
                <SelectItem value="final">Final</SelectItem>
                <SelectItem value="quiz">Quiz</SelectItem>
                <SelectItem value="assignment">Assignment</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={row.preschoolPercent}
              onChange={(e) =>
                updateGradeRow(row.id, "preschoolPercent", e.target.value)
              }
              placeholder="Preschool %"
              className="h-8 text-xs"
            />
            <Input
              value={row.customPercent}
              onChange={(e) =>
                updateGradeRow(row.id, "customPercent", e.target.value)
              }
              placeholder="Custom %"
              className="h-8 text-xs"
            />
            <Input
              value={row.tenPercent}
              onChange={(e) =>
                updateGradeRow(row.id, "tenPercent", e.target.value)
              }
              className="h-8 text-xs"
            />
            <Input
              value={row.grade}
              onChange={(e) => updateGradeRow(row.id, "grade", e.target.value)}
              placeholder="Grade"
              className="h-8 text-xs"
            />
            <div></div>
          </div>
        ))}
      </div>

      {/* Reason for Change */}
      <div className="mb-6">
        <Label htmlFor="reason" className="text-sm font-medium mb-2 block">
          Reason for Change
        </Label>
        <Textarea
          id="reason"
          placeholder="Type your message here."
          className="min-h-[100px] resize-none"
        />
      </div>

      {/* Report Options */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center space-x-2">
          <Checkbox id="original-report" />
          <Label htmlFor="original-report" className="text-sm">
            Copy of the original grading report showing the original grades.
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="graded-exam" />
          <Label htmlFor="graded-exam" className="text-sm">
            Copy of the graded final exam.
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="tuition-report" />
          <Label htmlFor="tuition-report" className="text-sm">
            Tuition report.
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="final-pages" />
          <Label htmlFor="final-pages" className="text-sm">
            Copy of the first 10 pages of the final report.
          </Label>
        </div>
      </div>

      {/* Send Request Button */}
      <div className="flex justify-end">
        <Button>Send Request</Button>
      </div>
    </div>
  );
}
