import axios from "axios";
import { APIinstance } from "@/api/baseAPI";

export const importServices = {
  importStudents: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return APIinstance.post("/import/students", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  importCourses: (file: File, semester: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("semester", semester);
    return APIinstance.post("/import/courses", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
