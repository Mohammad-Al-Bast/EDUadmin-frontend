"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UploadPage() {
    return (
        <main>
            <div className="grid gap-6">
                {/* Import Courses Section */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Import Courses</h2>
                        <Button>Import</Button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Semester" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="fall-2023">Fall 2023</SelectItem>
                                <SelectItem value="spring-2024">Spring 2024</SelectItem>
                                <SelectItem value="summer-2024">Summer 2024</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input id="course-file" type="file" />
                    </div>
                </div>

                {/* Import Students Section */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Import Students</h2>
                        <Button>Import</Button>
                    </div>
                    <Input id="student-file" type="file" />
                </div>
            </div>
        </main>
    )
}
