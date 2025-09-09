import { useParams, useNavigate } from "react-router-dom";
import { useStudent } from "@/hooks/students/use-students";
import { Button } from "@/components/ui/button";
import { ErrorDisplay } from "@/components/ui/error-display";
import { StudentDetailSkeleton } from "./student-detail-skeleton";
import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  Plus,
  X,
  CheckCircle,
  AlertTriangle,
  FileText,
  Mail,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCourses } from "@/hooks/courses/use-courses";
import MultipleSelector from "@/components/ui/multiple-selector";
import type { Option } from "@/components/ui/multiple-selector";
import { Label } from "@/components/ui/label";
import { useCallback, useMemo, useState } from "react";
import type { Course } from "@/types/courses.types";
import { Separator } from "@/components/ui/separator";
import { useRegisterDropCourses } from "@/hooks/register-drop-courses";
import { useCourseRegistrationReportGenerator } from "@/hooks/reports";
import type { RegisterDropCourseFormData } from "@/services/register-drop-courses";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DownloadReportButton } from "@/components/ui/download-report-button";
import {
  printCourseRegistrationReportToPDF,
  generateCourseRegistrationHTMLReport,
  convertCourseFormDataToReportData,
} from "@/utils/reportGenerator";

// Interface for individual course card data
interface CourseCard {
  id: string;
  selectedCourseCode: Option[];
  selectedCourseName: Option[];
  selectedSection: Option[];
  selectedCourse: Course | null;
}

// Time conflict detection utilities
interface ParsedSchedule {
  days: string[];
  startTime: number; // in minutes from 00:00
  endTime: number; // in minutes from 00:00
}

// Parse schedule string like "MTWTH" into individual days
const parseDays = (schedule: string): string[] => {
  const days: string[] = [];
  let i = 0;

  while (i < schedule.length) {
    if (i < schedule.length - 1 && schedule.substring(i, i + 2) === "TH") {
      days.push("TH");
      i += 2;
    } else {
      days.push(schedule[i]);
      i += 1;
    }
  }

  return days;
};

// Convert time string like "12:00" to minutes from 00:00
const timeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

// Parse time range like "12:00-13:50" into start and end minutes
const parseTimeRange = (timeRange: string): { start: number; end: number } => {
  const [startStr, endStr] = timeRange.split("-");
  return {
    start: timeToMinutes(startStr),
    end: timeToMinutes(endStr),
  };
};

// Parse full schedule and time into structured format
const parseSchedule = (schedule: string, time: string): ParsedSchedule => {
  const days = parseDays(schedule);
  const { start, end } = parseTimeRange(time);

  return {
    days,
    startTime: start,
    endTime: end,
  };
};

// Check if two time ranges overlap
const timeRangesOverlap = (
  range1: { start: number; end: number },
  range2: { start: number; end: number }
): boolean => {
  return range1.start < range2.end && range2.start < range1.end;
};

// Check if two courses have schedule conflicts
const hasTimeConflict = (course1: Course, course2: Course): boolean => {
  try {
    const schedule1 = parseSchedule(course1.schedule, course1.time);
    const schedule2 = parseSchedule(course2.schedule, course2.time);

    // Check if any days overlap
    const daysOverlap = schedule1.days.some((day) =>
      schedule2.days.includes(day)
    );

    if (!daysOverlap) {
      return false;
    }

    // Check if times overlap
    return timeRangesOverlap(
      { start: schedule1.startTime, end: schedule1.endTime },
      { start: schedule2.startTime, end: schedule2.endTime }
    );
  } catch (error) {
    console.error("Error parsing schedule:", error);
    return false;
  }
};

// Find all time conflicts among selected courses
const findTimeConflicts = (
  courseCards: CourseCard[]
): { cardId1: string; cardId2: string; course1: Course; course2: Course }[] => {
  const conflicts: {
    cardId1: string;
    cardId2: string;
    course1: Course;
    course2: Course;
  }[] = [];
  const selectedCourses = courseCards.filter((card) => card.selectedCourse);

  for (let i = 0; i < selectedCourses.length; i++) {
    for (let j = i + 1; j < selectedCourses.length; j++) {
      const card1 = selectedCourses[i];
      const card2 = selectedCourses[j];

      if (
        card1.selectedCourse &&
        card2.selectedCourse &&
        hasTimeConflict(card1.selectedCourse, card2.selectedCourse)
      ) {
        conflicts.push({
          cardId1: card1.id,
          cardId2: card2.id,
          course1: card1.selectedCourse,
          course2: card2.selectedCourse,
        });
      }
    }
  }

  return conflicts;
};

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State for comments/reason
  const [reason, setReason] = useState<string>("");

  // State for multiple course cards (register)
  const [courseCards, setCourseCards] = useState<CourseCard[]>([
    {
      id: "1",
      selectedCourseCode: [],
      selectedCourseName: [],
      selectedSection: [],
      selectedCourse: null,
    },
  ]);

  // State for multiple drop course cards
  const [dropCourseCards, setDropCourseCards] = useState<CourseCard[]>([
    {
      id: "drop-1",
      selectedCourseCode: [],
      selectedCourseName: [],
      selectedSection: [],
      selectedCourse: null,
    },
  ]);

  // Success modal and form submission state
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [submittedFormData, setSubmittedFormData] =
    useState<RegisterDropCourseFormData | null>(null);

  // Convert string ID to number
  const studentId = id ? parseInt(id, 10) : 0;

  const { student, loading, error } = useStudent(studentId);

  // Hook for register/drop courses functionality
  const {
    loading: submitLoading,
    error: submitError,
    validationErrors,
    submitForm,
  } = useRegisterDropCourses();

  // Hook for course registration report generation
  const {
    generateReportPreview,
    downloadReport,
    downloadReportPDF,
    emailReport,
  } = useCourseRegistrationReportGenerator({
    onSuccess: (_reportData) => {
      // Report generated successfully
    },
    onError: (_error) => {
      // Handle report generation error
    },
  });

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
    const uniqueNames = [
      ...new Set(courses.map((course) => course.course_name)),
    ];
    const options = uniqueNames.map((name) => ({
      value: name,
      label: name,
    }));
    return options;
  }, [courses]);

  // Detect time conflicts among selected courses
  const timeConflicts = useMemo(() => {
    return findTimeConflicts(courseCards);
  }, [courseCards]);

  // Helper function to check if a specific card has conflicts
  const getCardConflicts = useCallback(
    (cardId: string) => {
      return timeConflicts.filter(
        (conflict) => conflict.cardId1 === cardId || conflict.cardId2 === cardId
      );
    },
    [timeConflicts]
  );

  // Get available sections for a specific course card
  const getAvailableSections = useCallback(
    (cardId: string, isDropCourse: boolean = false) => {
      const cards = isDropCourse ? dropCourseCards : courseCards;
      const card = cards.find((c) => c.id === cardId);
      if (!courses || !card) return [];

      const matchingCourses = courses.filter((course) => {
        const hasMatchingCode =
          card.selectedCourseCode.length > 0 &&
          course.course_code === card.selectedCourseCode[0]?.value;
        const hasMatchingName =
          card.selectedCourseName.length > 0 &&
          course.course_name === card.selectedCourseName[0]?.value;

        if (
          card.selectedCourseCode.length > 0 &&
          card.selectedCourseName.length > 0
        ) {
          return hasMatchingCode && hasMatchingName;
        }

        return hasMatchingCode || hasMatchingName;
      });

      return matchingCourses;
    },
    [courses, courseCards, dropCourseCards]
  );

  const getSectionOptions = useCallback(
    (cardId: string, isDropCourse: boolean = false) => {
      const availableSections = getAvailableSections(cardId, isDropCourse);
      if (availableSections.length === 0) return [];

      const uniqueSections = [
        ...new Set(availableSections.map((course) => course.section)),
      ];
      const options = uniqueSections.map((section) => ({
        value: section,
        label: `Section ${section}`,
      }));
      return options;
    },
    [getAvailableSections]
  );

  // Add new course card
  const addCourseCard = useCallback(() => {
    const newCard: CourseCard = {
      id: Date.now().toString(),
      selectedCourseCode: [],
      selectedCourseName: [],
      selectedSection: [],
      selectedCourse: null,
    };
    setCourseCards((prev) => [...prev, newCard]);
  }, []);

  // Remove course card
  const removeCourseCard = useCallback((cardId: string) => {
    setCourseCards((prev) => prev.filter((card) => card.id !== cardId));
  }, []);

  // Add new drop course card
  const addDropCourseCard = useCallback(() => {
    const newCard: CourseCard = {
      id: `drop-${Date.now()}`,
      selectedCourseCode: [],
      selectedCourseName: [],
      selectedSection: [],
      selectedCourse: null,
    };
    setDropCourseCards((prev) => [...prev, newCard]);
  }, []);

  // Remove drop course card
  const removeDropCourseCard = useCallback((cardId: string) => {
    setDropCourseCards((prev) => prev.filter((card) => card.id !== cardId));
  }, []);

  // Update course card field
  const updateCourseCard = useCallback(
    (
      cardId: string,
      field: keyof CourseCard,
      value: any,
      isDropCourse: boolean = false
    ) => {
      if (isDropCourse) {
        setDropCourseCards((prev) =>
          prev.map((card) =>
            card.id === cardId ? { ...card, [field]: value } : card
          )
        );
      } else {
        setCourseCards((prev) =>
          prev.map((card) =>
            card.id === cardId ? { ...card, [field]: value } : card
          )
        );
      }
    },
    []
  );

  // Handler for course code selection
  const handleCourseCodeChange = useCallback(
    (cardId: string, options: Option[], isDropCourse: boolean = false) => {
      const cards = isDropCourse ? dropCourseCards : courseCards;
      const card = cards.find((c) => c.id === cardId);
      if (!card) return;

      updateCourseCard(cardId, "selectedCourseCode", options, isDropCourse);

      if (options.length > 0 && courses) {
        const selectedCode = options[0].value;
        const courseWithCode = courses.find(
          (course) => course.course_code === selectedCode
        );

        if (courseWithCode) {
          updateCourseCard(
            cardId,
            "selectedCourseName",
            [
              {
                value: courseWithCode.course_name,
                label: courseWithCode.course_name,
              },
            ],
            isDropCourse
          );
          updateCourseCard(
            cardId,
            "selectedCourse",
            courseWithCode,
            isDropCourse
          );
        }
      } else {
        updateCourseCard(cardId, "selectedCourseName", [], isDropCourse);
        updateCourseCard(cardId, "selectedCourse", null, isDropCourse);
      }

      updateCourseCard(cardId, "selectedSection", [], isDropCourse);
    },
    [courses, courseCards, dropCourseCards, updateCourseCard]
  );

  // Handler for course name selection
  const handleCourseNameChange = useCallback(
    (cardId: string, options: Option[], isDropCourse: boolean = false) => {
      const cards = isDropCourse ? dropCourseCards : courseCards;
      const card = cards.find((c) => c.id === cardId);
      if (!card) return;

      updateCourseCard(cardId, "selectedCourseName", options, isDropCourse);

      if (options.length > 0 && courses) {
        const selectedName = options[0].value;
        const courseWithName = courses.find(
          (course) => course.course_name === selectedName
        );

        if (courseWithName) {
          updateCourseCard(
            cardId,
            "selectedCourseCode",
            [
              {
                value: courseWithName.course_code,
                label: courseWithName.course_code,
              },
            ],
            isDropCourse
          );
          updateCourseCard(
            cardId,
            "selectedCourse",
            courseWithName,
            isDropCourse
          );
        }
      } else {
        updateCourseCard(cardId, "selectedCourseCode", [], isDropCourse);
        updateCourseCard(cardId, "selectedCourse", null, isDropCourse);
      }

      updateCourseCard(cardId, "selectedSection", [], isDropCourse);
    },
    [courses, courseCards, dropCourseCards, updateCourseCard]
  );

  // Handler for section selection
  const handleSectionChange = useCallback(
    (cardId: string, options: Option[], isDropCourse: boolean = false) => {
      const cards = isDropCourse ? dropCourseCards : courseCards;
      const card = cards.find((c) => c.id === cardId);
      if (!card) return;

      updateCourseCard(cardId, "selectedSection", options, isDropCourse);

      if (
        options.length > 0 &&
        courses &&
        card.selectedCourseCode.length > 0 &&
        card.selectedCourseName.length > 0
      ) {
        const selectedSectionValue = options[0].value;
        const selectedCodeValue = card.selectedCourseCode[0].value;
        const selectedNameValue = card.selectedCourseName[0].value;

        const exactCourse = courses.find(
          (course) =>
            course.course_code === selectedCodeValue &&
            course.course_name === selectedNameValue &&
            course.section === selectedSectionValue
        );

        if (exactCourse) {
          updateCourseCard(cardId, "selectedCourse", exactCourse, isDropCourse);
        }
      } else if (
        courses &&
        card.selectedCourseCode.length > 0 &&
        card.selectedCourseName.length > 0
      ) {
        const selectedCodeValue = card.selectedCourseCode[0].value;
        const selectedNameValue = card.selectedCourseName[0].value;

        const courseWithCodeAndName = courses.find(
          (course) =>
            course.course_code === selectedCodeValue &&
            course.course_name === selectedNameValue
        );

        if (courseWithCodeAndName) {
          updateCourseCard(
            cardId,
            "selectedCourse",
            courseWithCodeAndName,
            isDropCourse
          );
        }
      } else {
        updateCourseCard(cardId, "selectedCourse", null, isDropCourse);
      }
    },
    [courses, courseCards, dropCourseCards, updateCourseCard]
  );

  // Form submission handler
  const handleSubmit = useCallback(async () => {
    if (!student) {
      return;
    }

    // Prepare courses data
    const registerCourses = courseCards
      .filter((card) => card.selectedCourse)
      .map((card) => ({
        courseId: card.selectedCourse!.course_id,
        action: "register" as const,
      }));

    const dropCourses = dropCourseCards
      .filter((card) => card.selectedCourse)
      .map((card) => ({
        courseId: card.selectedCourse!.course_id,
        action: "drop" as const,
      }));

    const allCourses = [...registerCourses, ...dropCourses];

    if (allCourses.length === 0) {
      return;
    }

    const formData: RegisterDropCourseFormData = {
      university_id: student.university_id,
      courses: allCourses,
      reason: reason.trim(),
    };

    try {
      await submitForm(formData);
      setSubmittedFormData(formData);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Form submission error:", error);
      // Additional logging for debugging
      if (error && typeof error === "object") {
        console.error("Error details:", {
          message: (error as any).message,
          errors: (error as any).errors,
          status: (error as any).status,
        });

        // Log specific university_id validation errors
        if ((error as any).errors && (error as any).errors.university_id) {
          console.error(
            "University ID validation errors:",
            (error as any).errors.university_id
          );
        }
      }
    }
  }, [student, reason, courseCards, dropCourseCards, submitForm]);

  // Report generation handlers using proper course registration report generator
  const handlePreviewReport = useCallback(() => {
    if (!submittedFormData || !student || !courses) return;
    generateReportPreview(submittedFormData, student, courses);
  }, [submittedFormData, student, courses, generateReportPreview]);

  const handleDownloadReport = useCallback(() => {
    if (!submittedFormData || !student || !courses) return;
    downloadReport(submittedFormData, student, courses);
  }, [submittedFormData, student, courses, downloadReport]);

  const handleDownloadReportPDF = useCallback(() => {
    if (!submittedFormData || !student || !courses) return;
    downloadReportPDF(submittedFormData, student, courses);
  }, [submittedFormData, student, courses, downloadReportPDF]);

  const handlePrintReportToPDF = useCallback(() => {
    if (!submittedFormData || !student || !courses) return;

    // Get the current user info (simplified version)
    const submitterInfo = {
      name: "Current User",
      email: "user@liu.edu.lb",
      role: "Academic Advisor",
      ip: "192.168.1.100",
    };

    // Generate the report data and HTML
    const reportData = convertCourseFormDataToReportData(
      submittedFormData,
      student,
      courses,
      submitterInfo
    );
    const htmlContent = generateCourseRegistrationHTMLReport(reportData);

    // Use print function
    printCourseRegistrationReportToPDF(htmlContent);
  }, [submittedFormData, student, courses]);

  const handleEmailReport = useCallback(() => {
    if (!submittedFormData || !student || !courses) return;
    emailReport(submittedFormData, student, courses);
  }, [submittedFormData, student, courses, emailReport]);

  if (loading) {
    return (
      <main className="container mx-auto space-y-6">
        <StudentDetailSkeleton />
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

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Register Courses</h2>
          <Button
            onClick={addCourseCard}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Course
          </Button>
        </div>

        {/* Multiple Course Cards */}
        <div className="space-y-6">
          {courseCards.map((card, index) => {
            const sectionOptions = getSectionOptions(card.id, false);

            return (
              <Card key={card.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-green-500 font-semibold">
                      # Course {index + 1}
                    </CardTitle>
                    {courseCards.length > 1 && (
                      <Button
                        onClick={() => removeCourseCard(card.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Course Selection Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor={`courseCode-${card.id}`}
                        className="text-sm font-medium"
                      >
                        Course Code
                        <span className="text-sm text-gray-500 ml-1">
                          Only one value can be selected
                        </span>
                      </Label>
                      <div className="relative">
                        <MultipleSelector
                          value={card.selectedCourseCode}
                          onChange={(options) =>
                            handleCourseCodeChange(card.id, options, false)
                          }
                          options={courseCodeOptions}
                          placeholder={
                            coursesLoading
                              ? "Loading courses..."
                              : "Select course code"
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
                      <Label
                        htmlFor={`courseName-${card.id}`}
                        className="text-sm font-medium"
                      >
                        Course Name
                        <span className="text-sm text-gray-500 ml-1">
                          Only one value can be selected
                        </span>
                      </Label>
                      <div className="relative">
                        <MultipleSelector
                          value={card.selectedCourseName}
                          onChange={(options) =>
                            handleCourseNameChange(card.id, options, false)
                          }
                          options={courseNameOptions}
                          placeholder={
                            coursesLoading
                              ? "Loading courses..."
                              : "Select course name"
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
                      <Label
                        htmlFor={`section-${card.id}`}
                        className="text-sm font-medium"
                      >
                        Section
                        <span className="text-sm text-gray-500 ml-1">
                          Only one value can be selected
                        </span>
                      </Label>
                      <div className="relative">
                        <MultipleSelector
                          value={card.selectedSection}
                          onChange={(options) =>
                            handleSectionChange(card.id, options, false)
                          }
                          options={sectionOptions}
                          placeholder={
                            coursesLoading
                              ? "Loading sections..."
                              : !card.selectedCourse
                              ? "Select a course first"
                              : sectionOptions.length === 0
                              ? "No sections available"
                              : "Select section"
                          }
                          maxSelected={1}
                          disabled={
                            coursesLoading ||
                            !card.selectedCourse ||
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
                      {!coursesError &&
                        card.selectedCourse &&
                        sectionOptions.length === 0 && (
                          <div className="flex items-center gap-1 text-xs text-amber-600 mt-1">
                            <AlertCircle className="h-3 w-3" />
                            <span>No sections available for this course</span>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Course Information Display */}
                  {card.selectedCourse && (
                    <div className="mt-6">
                      <h3 className="text-md font-medium mb-3">
                        Course Information
                      </h3>
                      <div className="grid grid-cols-4 gap-x-4 gap-y-3 text-sm">
                        <div>
                          <div className="text-gray-500">Course Code</div>
                          <div className="font-medium">
                            {card.selectedCourse.course_code}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Course Name</div>
                          <div className="font-medium">
                            {card.selectedCourse.course_name}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Section</div>
                          <div className="font-medium">
                            {card.selectedCourse.section}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Instructor</div>
                          <div className="font-medium">
                            {card.selectedCourse.instructor}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Credits</div>
                          <div className="font-medium">
                            {card.selectedCourse.credits}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Room</div>
                          <div className="font-medium">
                            {card.selectedCourse.room}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Schedule</div>
                          <div className="font-medium">
                            {card.selectedCourse.schedule}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Days</div>
                          <div className="font-medium">
                            {card.selectedCourse.days}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Time</div>
                          <div className="font-medium">
                            {card.selectedCourse.time}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">School</div>
                          <div className="font-medium">
                            {card.selectedCourse.school}
                          </div>
                        </div>
                      </div>

                      {/* Time Conflict Warning */}
                      {(() => {
                        const conflicts = getCardConflicts(card.id);
                        if (conflicts.length > 0) {
                          return (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                                <div>
                                  <h4 className="text-sm font-medium text-red-800 mb-2">
                                    Time Conflict Detected
                                  </h4>
                                  <div className="space-y-1">
                                    {conflicts.map(
                                      (conflict, conflictIndex) => {
                                        const conflictingCourse =
                                          conflict.cardId1 === card.id
                                            ? conflict.course2
                                            : conflict.course1;
                                        const conflictingCardIndex =
                                          courseCards.findIndex(
                                            (c) =>
                                              c.id ===
                                              (conflict.cardId1 === card.id
                                                ? conflict.cardId2
                                                : conflict.cardId1)
                                          );

                                        return (
                                          <div
                                            key={conflictIndex}
                                            className="text-sm text-red-700"
                                          >
                                            This course conflicts with{" "}
                                            <strong>
                                              Course {conflictingCardIndex + 1}
                                            </strong>
                                            :
                                            <br />
                                            <span className="font-medium">
                                              {conflictingCourse.course_code} -{" "}
                                              {conflictingCourse.course_name}
                                            </span>
                                            <br />
                                            <span className="text-xs text-red-600">
                                              Schedule:{" "}
                                              {conflictingCourse.schedule} |
                                              Time: {conflictingCourse.time}
                                            </span>
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Separator />

      <div className="mb-6 mt-3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Drop Courses</h2>
          <Button
            onClick={addDropCourseCard}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Course
          </Button>
        </div>

        {/* Multiple Drop Course Cards */}
        <div className="space-y-6">
          {dropCourseCards.map((card, index) => {
            const sectionOptions = getSectionOptions(card.id, true);

            return (
              <Card key={card.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base font-semibold text-red-600">
                      # Drop Course {index + 1}
                    </CardTitle>
                    {dropCourseCards.length > 1 && (
                      <Button
                        onClick={() => removeDropCourseCard(card.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Course Selection Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor={`dropCourseCode-${card.id}`}
                        className="text-sm font-medium"
                      >
                        Course Code
                        <span className="text-sm text-gray-500 ml-1">
                          Only one value can be selected
                        </span>
                      </Label>
                      <div className="relative">
                        <MultipleSelector
                          value={card.selectedCourseCode}
                          onChange={(options) =>
                            handleCourseCodeChange(card.id, options, true)
                          }
                          options={courseCodeOptions}
                          placeholder={
                            coursesLoading
                              ? "Loading courses..."
                              : "Select course code"
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
                      <Label
                        htmlFor={`dropCourseName-${card.id}`}
                        className="text-sm font-medium"
                      >
                        Course Name
                        <span className="text-sm text-gray-500 ml-1">
                          Only one value can be selected
                        </span>
                      </Label>
                      <div className="relative">
                        <MultipleSelector
                          value={card.selectedCourseName}
                          onChange={(options) =>
                            handleCourseNameChange(card.id, options, true)
                          }
                          options={courseNameOptions}
                          placeholder={
                            coursesLoading
                              ? "Loading courses..."
                              : "Select course name"
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
                      <Label
                        htmlFor={`dropSection-${card.id}`}
                        className="text-sm font-medium"
                      >
                        Section
                        <span className="text-sm text-gray-500 ml-1">
                          Only one value can be selected
                        </span>
                      </Label>
                      <div className="relative">
                        <MultipleSelector
                          value={card.selectedSection}
                          onChange={(options) =>
                            handleSectionChange(card.id, options, true)
                          }
                          options={sectionOptions}
                          placeholder={
                            coursesLoading
                              ? "Loading sections..."
                              : !card.selectedCourse
                              ? "Select a course first"
                              : sectionOptions.length === 0
                              ? "No sections available"
                              : "Select section"
                          }
                          maxSelected={1}
                          disabled={
                            coursesLoading ||
                            !card.selectedCourse ||
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
                      {!coursesError &&
                        card.selectedCourse &&
                        sectionOptions.length === 0 && (
                          <div className="flex items-center gap-1 text-xs text-amber-600 mt-1">
                            <AlertCircle className="h-3 w-3" />
                            <span>No sections available for this course</span>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Course Information Display */}
                  {card.selectedCourse && (
                    <div className="mt-6">
                      <h3 className="text-md font-medium mb-3">
                        Course Information
                      </h3>
                      <div className="grid grid-cols-4 gap-x-4 gap-y-3 text-sm">
                        <div>
                          <div className="text-gray-500">Course Code</div>
                          <div className="font-medium">
                            {card.selectedCourse.course_code}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Course Name</div>
                          <div className="font-medium">
                            {card.selectedCourse.course_name}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Section</div>
                          <div className="font-medium">
                            {card.selectedCourse.section}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Instructor</div>
                          <div className="font-medium">
                            {card.selectedCourse.instructor}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Credits</div>
                          <div className="font-medium">
                            {card.selectedCourse.credits}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Room</div>
                          <div className="font-medium">
                            {card.selectedCourse.room}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Schedule</div>
                          <div className="font-medium">
                            {card.selectedCourse.schedule}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Days</div>
                          <div className="font-medium">
                            {card.selectedCourse.days}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Time</div>
                          <div className="font-medium">
                            {card.selectedCourse.time}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">School</div>
                          <div className="font-medium">
                            {card.selectedCourse.school}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Your Comments Section */}
      <div className="mt-8">
        <h2 className="text-lg font-medium mb-2">Your Comments</h2>
        <div className="relative">
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Type your reason for course registration/drop here..."
            className="min-h-[120px] resize-none text-sm"
          />

          {(submitError || validationErrors) && (
            <div className="mt-2 space-y-2">
              {submitError && (
                <div className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="h-3 w-3" />
                  <span>{submitError}</span>
                </div>
              )}
              {validationErrors && (
                <div className="space-y-1">
                  {Object.entries(validationErrors).map(([field, errors]) => (
                    <div key={field} className="text-xs text-red-500">
                      <strong className="capitalize">{field}:</strong>{" "}
                      {Array.isArray(errors) ? errors.join(", ") : errors}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end mt-4">
            <Button
              onClick={handleSubmit}
              disabled={
                submitLoading ||
                (courseCards.every((card) => !card.selectedCourse) &&
                  dropCourseCards.every((card) => !card.selectedCourse)) ||
                !!submittedFormData
              }
              className="bg-black text-white text-sm px-6 py-2 rounded"
            >
              {submitLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : submittedFormData ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submitted Successfully
                </>
              ) : (
                "Send Request"
              )}
            </Button>
            {submittedFormData && (
              <>
                <Button
                  variant="default"
                  onClick={() => setShowSuccessModal(true)}
                  className="ml-2"
                >
                  Generate Reports
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/dashboard/students")}
                  className="ml-2"
                >
                  Back to Students
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Request Submitted Successfully!
            </DialogTitle>
            <DialogDescription>
              Your course registration/drop request has been submitted and is
              being processed.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4 font-medium">
                Generate Report
              </p>
              <div className="flex gap-2 justify-center flex-wrap">
                <Button
                  variant="outline"
                  onClick={() => {
                    handlePreviewReport();
                    setShowSuccessModal(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Preview
                </Button>

                <DownloadReportButton
                  onDownloadHTML={() => {
                    handleDownloadReport();
                    setShowSuccessModal(false);
                  }}
                  onDownloadPDF={() => {
                    handleDownloadReportPDF();
                    setShowSuccessModal(false);
                  }}
                  onPrintToPDF={() => {
                    handlePrintReportToPDF();
                    setShowSuccessModal(false);
                  }}
                  variant="outline"
                  showDebugOptions={true}
                />

                <Button
                  variant="outline"
                  onClick={() => {
                    handleEmailReport();
                    setShowSuccessModal(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </Button>
              </div>
            </div>

            <div className="flex justify-center gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowSuccessModal(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate("/dashboard/students");
                }}
              >
                Back to Students
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
