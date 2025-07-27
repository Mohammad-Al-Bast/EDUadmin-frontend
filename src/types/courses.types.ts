export interface Course {
    id: string
    courseCode: string
    course: string
    instructor: string
    section: string
    credits: number
    room: string
    schedule: Schedule
    school: string
}

export interface Schedule {
    day: string
    time: string
}