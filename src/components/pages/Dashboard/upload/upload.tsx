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

      await importServices.importCourses(data.file, data.semester);
      courseForm.reset();
      if (courseFileRef.current) courseFileRef.current.value = "";
      // Course import successful
    } catch (err: any) {
      // Handle import error
    } finally {
      setIsCourseLoading(false);
    }
  };

  const handleStudentImport = async (data: StudentImportFormData) => {
    setIsStudentLoading(true);
    try {
      if (!data.file) throw new Error("File is required.");

      await importServices.importStudents(data.file);
      studentForm.reset();
      if (studentFileRef.current) studentFileRef.current.value = "";
      // Student import successful
    } catch (err: any) {
      // Handle import error
    } finally {
      setIsStudentLoading(false);
    }
  };

  // Template download handlers
  const handleDownloadCoursesTemplate = async () => {
    try {
      const response = await importServices.getCoursesTemplate();

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

      // Template downloaded successfully
    } catch (error: any) {
      // Handle download error
    }
  };

  const handleDownloadStudentsTemplate = async () => {
    try {
      const response = await importServices.getStudentsTemplate();

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

      // Template downloaded successfully
    } catch (error: any) {
      // Handle download error
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
                        accept=".csv,.xls,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
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
                      accept=".csv,.xls,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
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
