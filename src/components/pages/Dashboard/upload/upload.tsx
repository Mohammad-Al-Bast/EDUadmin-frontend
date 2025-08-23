import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { courseImportSchema, studentImportSchema } from "@/schemas/upload/upload"
import type { CourseImportFormData, StudentImportFormData } from "@/schemas/upload/upload"
import { importServices } from "@/services/import/import.service"
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"

export default function UploadPage() {
    // Course Import Form
    const [isCourseLoading, setIsCourseLoading] = useState(false)
    const courseFileRef = useRef<HTMLInputElement | null>(null)
    const courseForm = useForm<CourseImportFormData>({
        resolver: zodResolver(courseImportSchema),
        defaultValues: { semester: '', file: undefined },
        mode: 'onChange',
    })

    // Student Import Form
    const [isStudentLoading, setIsStudentLoading] = useState(false)
    const studentFileRef = useRef<HTMLInputElement | null>(null)
    const studentForm = useForm<StudentImportFormData>({
        resolver: zodResolver(studentImportSchema),
        defaultValues: { file: undefined },
        mode: 'onChange',
    })

    const handleCourseImport = async (data: CourseImportFormData) => {
        setIsCourseLoading(true)
        try {
            if (!data.file || !data.semester) throw new Error("File and semester are required.");
            await importServices.importCourses(data.file, data.semester);
            courseForm.reset();
            if (courseFileRef.current) courseFileRef.current.value = "";
            // Optionally show success notification here
        } catch (err) {
            // Optionally show error notification here
            console.log(err);
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
            // Optionally show success notification here
        } catch (err) {
            // Optionally show error notification here
            console.log(err);
        } finally {
            setIsStudentLoading(false);
        }
    };

    return (
        <main>
            <div className="grid gap-4">
                {/* Import Courses Section */}
                <Form {...courseForm}>
                    <form onSubmit={courseForm.handleSubmit(handleCourseImport)} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Import Courses</h2>
                            <Button type="submit" disabled={isCourseLoading || !courseForm.formState.isValid}>
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
                                                onChange={e => {
                                                    const file = e.target.files?.[0]
                                                    field.onChange(file)
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
                    <form onSubmit={studentForm.handleSubmit(handleStudentImport)} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Import Students</h2>
                            <Button type="submit" disabled={isStudentLoading || !studentForm.formState.isValid}>
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
                                            onChange={e => {
                                                const file = e.target.files?.[0]
                                                field.onChange(file)
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
    )
}
