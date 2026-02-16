import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";

import { useCreateStudent } from "@/hooks/students/use-students";
import {
	createStudentSchema,
	type CreateStudentFormData,
	campusOptions,
	schoolOptions,
	semesterOptions,
	generateYearOptions,
} from "@/schemas/create-student";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddStudentDialogProps {
	onSuccess?: () => void;
}

export function AddStudentDialog({ onSuccess }: AddStudentDialogProps) {
	const [open, setOpen] = useState(false);
	const { createStudent, loading } = useCreateStudent();
	const yearOptions = generateYearOptions();

	const form = useForm<CreateStudentFormData>({
		resolver: zodResolver(createStudentSchema),
		defaultValues: {
			university_id: "",
			student_name: "",
			campus: "",
			school: "",
			major: "",
			semester: "",
			year: "",
		},
		mode: "onChange",
	});

	const onSubmit = async (data: CreateStudentFormData) => {
		try {
			const studentData = {
				university_id: parseInt(data.university_id, 10),
				student_name: data.student_name,
				campus: data.campus || null,
				school: data.school || null,
				major: data.major || null,
				semester: data.semester || null,
				year: data.year ? parseInt(data.year, 10) : null,
			};

			const result = await createStudent(studentData);

			if (result) {
				toast.success("Student added successfully!", {
					description: `${data.student_name} (ID: ${data.university_id}) has been added to the system.`,
				});
				form.reset();
				setOpen(false);
				onSuccess?.();
			} else {
				toast.error("Failed to add student", {
					description: "Please check the form and try again.",
				});
			}
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "Failed to add student. Please try again.";
			toast.error(errorMessage);
		}
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			form.reset();
		}
		setOpen(newOpen);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button>
					<UserPlus className="mr-2 h-4 w-4" />
					Add Student
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Add New Student</DialogTitle>
					<DialogDescription>
						Fill in the details to add a new student to the system.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 mt-4"
					>
						{/* University ID - Required */}
						<FormField
							control={form.control}
							name="university_id"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										University ID{" "}
										<span className="text-destructive">
											*
										</span>
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="Enter 8-digit university ID"
											disabled={loading}
											maxLength={8}
											onChange={(e) => {
												// Only allow digits
												const value =
													e.target.value.replace(
														/\D/g,
														"",
													);
												field.onChange(value);
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Student Name - Required */}
						<FormField
							control={form.control}
							name="student_name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Student Name{" "}
										<span className="text-destructive">
											*
										</span>
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="Enter student full name"
											disabled={loading}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Campus - Optional */}
						<FormField
							control={form.control}
							name="campus"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Campus</FormLabel>
									<Select
										onValueChange={field.onChange}
										value={field.value || ""}
										disabled={loading}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select campus" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{campusOptions.map((option) => (
												<SelectItem
													key={option.value}
													value={option.value}
												>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* School - Optional */}
						<FormField
							control={form.control}
							name="school"
							render={({ field }) => (
								<FormItem>
									<FormLabel>School</FormLabel>
									<Select
										onValueChange={field.onChange}
										value={field.value || ""}
										disabled={loading}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select school" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{schoolOptions.map((option) => (
												<SelectItem
													key={option.value}
													value={option.value}
												>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Major - Optional (free text) */}
						<FormField
							control={form.control}
							name="major"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Major</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="Enter major (e.g., Computer Science)"
											disabled={loading}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Semester - Optional */}
						<FormField
							control={form.control}
							name="semester"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Semester</FormLabel>
									<Select
										onValueChange={field.onChange}
										value={field.value || ""}
										disabled={loading}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select semester" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{semesterOptions.map((option) => (
												<SelectItem
													key={option.value}
													value={option.value}
												>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Year - Optional */}
						<FormField
							control={form.control}
							name="year"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Year</FormLabel>
									<Select
										onValueChange={field.onChange}
										value={field.value || ""}
										disabled={loading}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select year" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{yearOptions.map((option) => (
												<SelectItem
													key={option.value}
													value={option.value}
												>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Form Actions */}
						<div className="flex justify-end gap-3 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => handleOpenChange(false)}
								disabled={loading}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={loading}>
								{loading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Adding...
									</>
								) : (
									<>
										<UserPlus className="mr-2 h-4 w-4" />
										Add Student
									</>
								)}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
