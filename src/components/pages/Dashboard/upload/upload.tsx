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
    } finally {
      setIsStudentLoading(false);
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
              <Button
                type="submit"
                disabled={isCourseLoading || !courseForm.formState.isValid}
              >
                {isCourseLoading ? "Importing..." : "Import"}
              </Button>
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
              <Button
                type="submit"
                disabled={isStudentLoading || !studentForm.formState.isValid}
              >
                {isStudentLoading ? "Importing..." : "Import"}
              </Button>
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
