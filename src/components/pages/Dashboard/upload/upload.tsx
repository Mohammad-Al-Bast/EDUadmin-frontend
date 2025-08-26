import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  courseImportSchema,
  studentImportSchema,
} from "@/schemas/upload/upload";
import type {
  CourseImportFormData,
  StudentImportFormData,
} from "@/schemas/upload/upload";
import { importServices } from "@/services/import/import.service";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

export default function UploadPage() {
  // Course Import Form
  const [isCourseLoading, setIsCourseLoading] = useState(false);
  const courseFileRef = useRef<HTMLInputElement | null>(null);
  const courseForm = useForm<CourseImportFormData>({
    resolver: zodResolver(courseImportSchema),
    defaultValues: { semester: "", file: undefined },
    mode: "onChange",
  });

  // Student Import Form
  const [isStudentLoading, setIsStudentLoading] = useState(false);
  const studentFileRef = useRef<HTMLInputElement | null>(null);
  const studentForm = useForm<StudentImportFormData>({
    resolver: zodResolver(studentImportSchema),
    defaultValues: { file: undefined },
    mode: "onChange",
  });

  const handleCourseImport = async (data: CourseImportFormData) => {
    setIsCourseLoading(true);
    try {
      if (!data.file || !data.semester)
        throw new Error("File and semester are required.");

      // Log detailed debug information
      console.log("Course import debug info:", {
        fileName: data.file.name,
        fileSize: data.file.size,
        fileType: data.file.type,
        semester: data.semester,
        lastModified: new Date(data.file.lastModified).toISOString(),
      });

      // Test FormData construction
      const testFormData = new FormData();
      testFormData.append("file", data.file);
      testFormData.append("semester", data.semester);

      console.log("FormData contents:");
      for (let [key, value] of testFormData.entries()) {
        console.log(`${key}:`, value);
        if (value instanceof File) {
          console.log(
            `  File details - name: ${value.name}, size: ${value.size}, type: ${value.type}`
          );
        }
      }

      await importServices.importCourses(data.file, data.semester);
      courseForm.reset();
      if (courseFileRef.current) courseFileRef.current.value = "";
      console.log("Course import successful");
      // Optionally show success notification here
    } catch (err: any) {
      // Enhanced error logging
      console.error("Course import error:", {
        message: err?.message,
        status: err?.response?.status,
        statusText: err?.response?.statusText,
        data: err?.response?.data,
        config: {
          url: err?.config?.url,
          method: err?.config?.method,
          headers: err?.config?.headers,
        },
      });

      // Show detailed server error message if available
      if (err?.response?.data) {
        console.error("Server error details:", err.response.data);

        // Check for validation errors array (common Laravel format)
        if (err.response.data.errors) {
          console.error("Validation errors:", err.response.data.errors);

          // Format validation errors for display
          const validationErrors = Object.entries(err.response.data.errors)
            .map(
              ([field, errors]: [string, any]) =>
                `${field}: ${
                  Array.isArray(errors) ? errors.join(", ") : errors
                }`
            )
            .join("\n");

          alert(`Validation Errors:\n${validationErrors}`);
        } else {
          // Display user-friendly error message
          const errorMessage =
            err.response.data.message ||
            err.response.data.error ||
            "File upload failed. Please check your file format and try again.";
          alert(`Upload Error: ${errorMessage}`);
        }
      }
    } finally {
      setIsCourseLoading(false);
    }
  };

  const handleStudentImport = async (data: StudentImportFormData) => {
    setIsStudentLoading(true);
    try {
      if (!data.file) throw new Error("File is required.");

      // Log detailed debug information
      console.log("Student import debug info:", {
        fileName: data.file.name,
        fileSize: data.file.size,
        fileType: data.file.type,
        lastModified: new Date(data.file.lastModified).toISOString(),
      });

      await importServices.importStudents(data.file);
      studentForm.reset();
      if (studentFileRef.current) studentFileRef.current.value = "";
      console.log("Student import successful");
      // Optionally show success notification here
    } catch (err: any) {
      // Enhanced error logging
      console.error("Student import error:", {
        message: err?.message,
        status: err?.response?.status,
        statusText: err?.response?.statusText,
        data: err?.response?.data,
        config: {
          url: err?.config?.url,
          method: err?.config?.method,
          headers: err?.config?.headers,
        },
      });

      // Show detailed server error message if available
      if (err?.response?.data) {
        console.error("Server error details:", err.response.data);

        // Check for validation errors array (common Laravel format)
        if (err.response.data.errors) {
          console.error("Validation errors:", err.response.data.errors);

          // Format validation errors for display
          const validationErrors = Object.entries(err.response.data.errors)
            .map(
              ([field, errors]: [string, any]) =>
                `${field}: ${
                  Array.isArray(errors) ? errors.join(", ") : errors
                }`
            )
            .join("\n");

          alert(`Validation Errors:\n${validationErrors}`);
        } else {
          // Display user-friendly error message
          const errorMessage =
            err.response.data.message ||
            err.response.data.error ||
            "File upload failed. Please check your file format and try again.";
          alert(`Upload Error: ${errorMessage}`);
        }
      }
    } finally {
      setIsStudentLoading(false);
    }
  };

  // Template download handlers
  const handleDownloadCoursesTemplate = async () => {
    try {
      console.log("Downloading courses template...");
      const response = await importServices.getCoursesTemplate();

      // Log response details for debugging
      console.log("Template response:", {
        status: response.status,
        headers: response.headers,
        dataType: typeof response.data,
        contentType: response.headers["content-type"],
      });

      // Determine if it's CSV or Excel based on content type
      const contentType = response.headers["content-type"] || "";
      const isCSV =
        contentType.includes("text/csv") ||
        contentType.includes("application/csv");

      // Create blob with proper MIME type
      const blob = new Blob([response.data], {
        type: isCSV
          ? "text/csv"
          : contentType ||
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers["content-disposition"];
      let filename = isCSV ? "courses_template.csv" : "courses_template.xlsx";
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, "");
        }
      }

      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log("Template downloaded successfully:", filename);
    } catch (error: any) {
      console.error("Failed to download courses template:", error);
      console.error("Error details:", {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });
      alert(
        "Failed to download template. Please try again or contact support."
      );
    }
  };

  const handleDownloadStudentsTemplate = async () => {
    try {
      console.log("Downloading students template...");
      const response = await importServices.getStudentsTemplate();

      // Log response details for debugging
      console.log("Template response:", {
        status: response.status,
        headers: response.headers,
        dataType: typeof response.data,
        contentType: response.headers["content-type"],
      });

      // Determine if it's CSV or Excel based on content type
      const contentType = response.headers["content-type"] || "";
      const isCSV =
        contentType.includes("text/csv") ||
        contentType.includes("application/csv");

      // Create blob with proper MIME type
      const blob = new Blob([response.data], {
        type: isCSV
          ? "text/csv"
          : contentType ||
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers["content-disposition"];
      let filename = isCSV ? "students_template.csv" : "students_template.xlsx";
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, "");
        }
      }

      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log("Template downloaded successfully:", filename);
    } catch (error: any) {
      console.error("Failed to download students template:", error);
      console.error("Error details:", {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });
      alert(
        "Failed to download template. Please try again or contact support."
      );
    }
  };

  return (
    <main>
      <div className="grid gap-4">
        {/* Import Courses Section */}
        <Form {...courseForm}>
          <form
            onSubmit={courseForm.handleSubmit(handleCourseImport)}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Import Courses</h2>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDownloadCoursesTemplate}
                  disabled={isCourseLoading}
                >
                  Download Template
                </Button>
                <Button
                  type="submit"
                  disabled={isCourseLoading || !courseForm.formState.isValid}
                >
                  {isCourseLoading ? "Importing..." : "Import"}
                </Button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={courseForm.control}
                name="semester"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isCourseLoading}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Semester" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fall">Fall</SelectItem>
                          <SelectItem value="spring">Spring</SelectItem>
                          <SelectItem value="summer">Summer</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={courseForm.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        ref={courseFileRef}
                        disabled={isCourseLoading}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          field.onChange(file);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>

        {/* Import Students Section */}
        <Form {...studentForm}>
          <form
            onSubmit={studentForm.handleSubmit(handleStudentImport)}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Import Students</h2>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDownloadStudentsTemplate}
                  disabled={isStudentLoading}
                >
                  Download Template
                </Button>
                <Button
                  type="submit"
                  disabled={isStudentLoading || !studentForm.formState.isValid}
                >
                  {isStudentLoading ? "Importing..." : "Import"}
                </Button>
              </div>
            </div>
            <FormField
              control={studentForm.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      ref={studentFileRef}
                      disabled={isStudentLoading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </main>
  );
}
