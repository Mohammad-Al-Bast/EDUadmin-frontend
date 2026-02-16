import { z } from "zod";

// Validation schema for creating a new student (form input types)
// Matches API: POST /api/admin/students
export const createStudentSchema = z.object({
	university_id: z
		.string()
		.min(1, "University ID is required")
		.regex(/^\d{8}$/, "University ID must be exactly 8 digits"),
	student_name: z
		.string()
		.min(1, "Student name is required")
		.min(2, "Student name must be at least 2 characters")
		.max(255, "Student name must be less than 255 characters"),
	campus: z
		.string()
		.max(255, "Campus must be less than 255 characters")
		.optional(),
	school: z
		.string()
		.max(255, "School must be less than 255 characters")
		.optional(),
	major: z
		.string()
		.max(255, "Major must be less than 255 characters")
		.optional(),
	semester: z
		.string()
		.max(255, "Semester must be less than 255 characters")
		.optional(),
	year: z.string().optional(),
});

export type CreateStudentFormData = z.infer<typeof createStudentSchema>;

// Campus options for the select dropdown
export const campusOptions = [
	{ value: "Beirut", label: "Beirut" },
	{ value: "Tripoli", label: "Tripoli" },
	{ value: "Saida", label: "Saida" },
	{ value: "Nabatieh", label: "Nabatieh" },
	{ value: "Bekaa", label: "Bekaa" },
	{ value: "Rayak", label: "Rayak" },
] as const;

// School options for the select dropdown
export const schoolOptions = [
	{ value: "Arts & Sciences", label: "Arts & Sciences" },
	{ value: "Business", label: "Business" },
	{ value: "Engineering", label: "Engineering" },
	{ value: "Education", label: "Education" },
	{ value: "Health Sciences", label: "Health Sciences" },
	{ value: "Pharmacy", label: "Pharmacy" },
	{ value: "Medicine", label: "Medicine" },
	{ value: "Architecture & Design", label: "Architecture & Design" },
] as const;

// Semester options for the select dropdown
export const semesterOptions = [
	{ value: "Fall", label: "Fall" },
	{ value: "Spring", label: "Spring" },
	{ value: "Summer", label: "Summer" },
] as const;

// Generate year options (current year and 5 years back/forward)
export const generateYearOptions = () => {
	const currentYear = new Date().getFullYear();
	const years = [];
	for (let i = currentYear + 2; i >= currentYear - 5; i--) {
		years.push({ value: i.toString(), label: i.toString() });
	}
	return years;
};
