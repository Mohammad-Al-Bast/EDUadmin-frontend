import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface GradeRow {
  id: string;
  gradeType: string;
  preschoolPercent: string;
  customPercent: string;
  tenPercent: string;
  grade: string;
}

export function ChangeGradeForm() {
  const [gradeRows, setGradeRows] = useState<GradeRow[]>([
    {
      id: "1",
      gradeType: "",
      preschoolPercent: "",
      customPercent: "",
      tenPercent: "10%",
      grade: "",
    },
    {
      id: "2",
      gradeType: "",
      preschoolPercent: "",
      customPercent: "",
      tenPercent: "10%",
      grade: "",
    },
  ]);

  const addGradeRow = () => {
    const newRow: GradeRow = {
      id: Date.now().toString(),
      gradeType: "",
      preschoolPercent: "",
      customPercent: "",
      tenPercent: "10%",
      grade: "",
    };
    setGradeRows([...gradeRows, newRow]);
  };

  const updateGradeRow = (id: string, field: keyof GradeRow, value: string) => {
    setGradeRows(
      gradeRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  return (
    <div className="">
      {/* Student Information Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="studentId" className="text-sm font-medium">
            Student ID
          </Label>
          <Input id="studentId" placeholder="Student ID" className="h-9" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="studentName" className="text-sm font-medium">
            Student Full Name
          </Label>
          <Input
            id="studentName"
            placeholder="Student Full Name"
            className="h-9"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="semester" className="text-sm font-medium">
            Semester/Year
          </Label>
          <Select>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select Semester/Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fall2024">Fall 2024</SelectItem>
              <SelectItem value="spring2024">Spring 2024</SelectItem>
              <SelectItem value="summer2024">Summer 2024</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Course Information Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="major" className="text-sm font-medium">
            Major
          </Label>
          <Select>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select Major" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cs">Computer Science</SelectItem>
              <SelectItem value="eng">Engineering</SelectItem>
              <SelectItem value="bus">Business</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="campus" className="text-sm font-medium">
            Campus
          </Label>
          <Select>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select Campus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="main">Main Campus</SelectItem>
              <SelectItem value="north">North Campus</SelectItem>
              <SelectItem value="south">South Campus</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="instructor" className="text-sm font-medium">
            Instructor Name
          </Label>
          <Input
            id="instructor"
            placeholder="Instructor Name"
            className="h-9"
          />
        </div>
      </div>

      {/* Course Details Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="courseCode" className="text-sm font-medium">
            Course Code
          </Label>
          <Input id="courseCode" placeholder="Course Code" className="h-9" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="courseName" className="text-sm font-medium">
            Course Name
          </Label>
          <Input id="courseName" placeholder="Course Name" className="h-9" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="section" className="text-sm font-medium">
            Section
          </Label>
          <Input id="section" placeholder="Section" className="h-9" />
        </div>
      </div>

      {/* Course Grades Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Label className="text-sm font-medium">Course Grades</Label>
          <Button type="button" onClick={addGradeRow}>
            Add Custom
          </Button>
        </div>

        {/* Grade Headers */}
        <div className="grid grid-cols-6 gap-2 mb-2 text-xs text-gray-600 font-medium">
          <div>Grade Type</div>
          <div>Preschool %</div>
          <div>Custom %</div>
          <div>10%</div>
          <div>Grade</div>
          <div></div>
        </div>

        {/* Grade Rows */}
        {gradeRows.map((row) => (
          <div key={row.id} className="grid grid-cols-6 gap-2 mb-2">
            <Select
              value={row.gradeType}
              onValueChange={(value) =>
                updateGradeRow(row.id, "gradeType", value)
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Grade Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="midterm">Midterm</SelectItem>
                <SelectItem value="final">Final</SelectItem>
                <SelectItem value="quiz">Quiz</SelectItem>
                <SelectItem value="assignment">Assignment</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={row.preschoolPercent}
              onChange={(e) =>
                updateGradeRow(row.id, "preschoolPercent", e.target.value)
              }
              placeholder="Preschool %"
              className="h-8 text-xs"
            />
            <Input
              value={row.customPercent}
              onChange={(e) =>
                updateGradeRow(row.id, "customPercent", e.target.value)
              }
              placeholder="Custom %"
              className="h-8 text-xs"
            />
            <Input
              value={row.tenPercent}
              onChange={(e) =>
                updateGradeRow(row.id, "tenPercent", e.target.value)
              }
              className="h-8 text-xs"
            />
            <Input
              value={row.grade}
              onChange={(e) => updateGradeRow(row.id, "grade", e.target.value)}
              placeholder="Grade"
              className="h-8 text-xs"
            />
            <div></div>
          </div>
        ))}
      </div>

      {/* Reason for Change */}
      <div className="mb-6">
        <Label htmlFor="reason" className="text-sm font-medium mb-2 block">
          Reason for Change
        </Label>
        <Textarea
          id="reason"
          placeholder="Type your message here."
          className="min-h-[100px] resize-none"
        />
      </div>

      {/* Report Options */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center space-x-2">
          <Checkbox id="original-report" />
          <Label htmlFor="original-report" className="text-sm">
            Copy of the original grading report showing the original grades.
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="graded-exam" />
          <Label htmlFor="graded-exam" className="text-sm">
            Copy of the graded final exam.
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="tuition-report" />
          <Label htmlFor="tuition-report" className="text-sm">
            Tuition report.
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="final-pages" />
          <Label htmlFor="final-pages" className="text-sm">
            Copy of the first 10 pages of the final report.
          </Label>
        </div>
      </div>

      {/* Send Request Button */}
      <div className="flex justify-end">
        <Button >
          Send Request
        </Button>
      </div>
    </div>
  );
}
