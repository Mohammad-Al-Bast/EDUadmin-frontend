import type { Course } from "@/types/courses.types";

export const coursesData: Course[] = [
    {
        id: "1",
        courseCode: "CS101",
        course: "Introduction to Computer Science",
        instructor: "Dr. Smith",
        section: "A",
        credits: 3,
        room: "Room 101",
        schedule: {
            day: "Monday",
            time: "10:00 AM - 11:30 AM"
        },
        school: "Engineering"
    },
    {
        id: "2",
        courseCode: "MATH201",
        course: "Calculus I",
        instructor: "Prof. Johnson",
        section: "B",
        credits: 4,
        room: "Room 202",
        schedule: {
            day: "Wednesday",
            time: "1:00 PM - 2:30 PM"
        },
        school: "Science"
    }
]