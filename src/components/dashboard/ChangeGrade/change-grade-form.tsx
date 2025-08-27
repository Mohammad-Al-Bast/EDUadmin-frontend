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
import type { Course } from "@/types/courses.types";
import { Loader2, AlertCircle, Plus, Minus, Trash2 } from "lucide-react";

interface GradeRow {
  id: string;
  gradeType: string;
  predefinedPercent: string;
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
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

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

  const [gradeRows, setGradeRows] = useState<GradeRow[]>([
    {
      id: "1",
      gradeType: "",
      predefinedPercent: "",
      customPercent: "",
      tenPercent: "10%",
      grade: "",
    },
    {
      id: "2",
      gradeType: "",
      predefinedPercent: "",
      customPercent: "",
      tenPercent: "10%",
      grade: "",
    },
  ]);

  // State for curve adjustment
  const [curve, setCurve] = useState<number>(0);

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
  const handleSectionChange = useCallback((options: Option[]) => {
    setSelectedSection(options);
  }, []);

  // Handlers for curve adjustment
  const increaseCurve = useCallback(() => {
    setCurve((prev) => prev + 1);
  }, []);

  const decreaseCurve = useCallback(() => {
    setCurve((prev) => Math.max(0, prev - 1));
  }, []);

  const handleCurveInputChange = useCallback((value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setCurve(numValue);
    } else if (value === "") {
      setCurve(0);
    }
  }, []);

  // Function to convert numerical grade to letter grade
  const getLetterGrade = useCallback((grade: number): string => {
    if (grade >= 90) return "A";
    if (grade >= 85) return "B+";
    if (grade >= 80) return "B";
    if (grade >= 75) return "C+";
    if (grade >= 70) return "C";
    if (grade >= 65) return "D+";
    if (grade >= 60) return "D";
    return "F";
  }, []);

  // Function to calculate weighted final grade
  const calculateWeightedGrade = useCallback(() => {
    let weightedSum = 0;
    let totalWeight = 0;

    gradeRows.forEach((row) => {
      const grade = parseFloat(row.grade) || 0;
      const percentageStr = row.tenPercent.replace("%", "");
      const percentage = parseFloat(percentageStr) || 0;

      weightedSum += grade * percentage;
      totalWeight += percentage;
    });

    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }, [gradeRows]);

  // Function to validate if percentages sum to 100%
  const validatePercentages = useCallback(() => {
    const totalPercentage = gradeRows.reduce((sum, row) => {
      const percentageStr = row.tenPercent.replace("%", "");
      const percentage = parseFloat(percentageStr) || 0;
      return sum + percentage;
    }, 0);

    return Math.abs(totalPercentage - 100) < 0.01; // Allow for small floating point errors
  }, [gradeRows]);

  // Get validation error message
  const getPercentageError = useCallback(() => {
    const totalPercentage = gradeRows.reduce((sum, row) => {
      const percentageStr = row.tenPercent.replace("%", "");
      const percentage = parseFloat(percentageStr) || 0;
      return sum + percentage;
    }, 0);

    if (Math.abs(totalPercentage - 100) >= 0.01) {
      return `Grade percentages must equal 100% (currently ${totalPercentage.toFixed(
        1
      )}%)`;
    }
    return null;
  }, [gradeRows]);

  // Effect to clear course selections when courses data changes
  useEffect(() => {
    if (coursesError) {
      setSelectedCourseCode([]);
      setSelectedCourseName([]);
      setSelectedSection([]);
      setSelectedCourse(null);
    }
  }, [coursesError]);

  const addGradeRow = () => {
    const newRow: GradeRow = {
      id: Date.now().toString(),
      gradeType: "",
      predefinedPercent: "",
      customPercent: "",
      tenPercent: "10%",
      grade: "",
    };
    setGradeRows([...gradeRows, newRow]);
  };

  const removeGradeRow = (id: string) => {
    // Only allow removal if there are more than 2 rows and the row is not one of the initial rows
    if (gradeRows.length > 2 && id !== "1" && id !== "2") {
      setGradeRows(gradeRows.filter((row) => row.id !== id));
    }
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
                coursesLoading || !selectedCourse || sectionOptions.length === 0
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
          {/* <div>Predefined %</div>
          <div>Custom %</div> */}
          <div>Grade Percentage</div>
          <div>Grade</div>
          <div>Remove</div>
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
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Grade Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="participation">Participation</SelectItem>
                <SelectItem value="quiz">Quiz</SelectItem>
                <SelectItem value="assignment">Assignment</SelectItem>
                <SelectItem value="midterm">Midterm</SelectItem>
                <SelectItem value="final">Final</SelectItem>
                
              </SelectContent>
            </Select>
            {/* <Input
              value={row.predefinedPercent}
              onChange={(e) =>
                updateGradeRow(row.id, "predefinedPercent", e.target.value)
              }
              placeholder="Predefined %"
              className="text-xs"
            />
            <Input
              value={row.customPercent}
              onChange={(e) =>
                updateGradeRow(row.id, "customPercent", e.target.value)
              }
              placeholder="Custom %"
              className="text-xs"
            /> */}
            <Input
              value={row.tenPercent}
              onChange={(e) =>
                updateGradeRow(row.id, "tenPercent", e.target.value)
              }
              className="text-xs"
            />
            <Input
              value={row.grade}
              onChange={(e) => updateGradeRow(row.id, "grade", e.target.value)}
              placeholder="Grade"
              className="text-xs"
            />
            <div className="flex justify-start">
              {gradeRows.length > 2 && row.id !== "1" && row.id !== "2" ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeGradeRow(row.id)}
                  className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              ) : (
                <div className="h-7 w-7"></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Validation Error */}
      {getPercentageError() && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">{getPercentageError()}</span>
          </div>
        </div>
      )}

      {/* Curve and Final Grade Headers */}
      <div className="grid grid-cols-6 gap-2 mb-2 text-xs text-gray-600 font-medium">
        <div>Curve Adjustment</div>
        <div>Final Grade</div>
        <div>Letter Grade</div>
        <div></div>
        <div></div>
      </div>

      {/* Curve and Final Grade Row */}
      <div className="grid grid-cols-6 gap-2 mb-6">
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={decreaseCurve}
            className="h-7 w-7 p-0"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <Input
            id="curve"
            value={curve.toString()}
            onChange={(e) => handleCurveInputChange(e.target.value)}
            className="text-xs text-center h-7"
            placeholder="0"
            min="0"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={increaseCurve}
            className="h-7 w-7 p-0"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <Input
          id="final-grade"
          value={(calculateWeightedGrade() + curve).toFixed(1)}
          disabled
          className="text-xs"
        />
        <Input
          id="letter-grade"
          value={getLetterGrade(calculateWeightedGrade() + curve)}
          disabled
          className="text-xs text-center font-medium"
        />
        <div></div>
        <div></div>
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
