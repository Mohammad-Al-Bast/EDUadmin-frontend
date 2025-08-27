import { APIinstance } from "@/api/baseAPI";

export const importServices = {
  /**
   * * Import students from file (Admin only)
   * * @param {File} file - CSV/Excel file containing student data
   * * @returns {Promise<any>} - Import response
   */
  importStudents: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    // Note: Don't set Content-Type header for FormData - browser sets it automatically
    return APIinstance.post("/admin/import/students", formData);
  },

  /**
   * * Import courses from file (Admin only)
   * * @param {File} file - CSV/Excel file containing course data
   * * @param {string} semester - Semester for the courses
   * * @returns {Promise<any>} - Import response
   */
  importCourses: (file: File, semester: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("semester", semester);
    
    // Note: Don't set Content-Type header for FormData - browser sets it automatically
    return APIinstance.post("/admin/import/courses", formData);
  },

  /**
   * * Get template information for imports (Admin only)
   * * @returns {Promise<any>} - Template information
   */
  getTemplateInfo: () => {
    return APIinstance.get("/admin/import/template-info");
  },

  /**
   * * Download students import template (Admin only)
   * * @returns {Promise<any>} - Template file download
   */
  getStudentsTemplate: () => {
    return APIinstance.get("/admin/import/template/students", {
      responseType: 'blob'
    });
  },

  /**
   * * Download courses import template (Admin only)
   * * @returns {Promise<any>} - Template file download
   */
  getCoursesTemplate: () => {
    return APIinstance.get("/admin/import/template/courses", {
      responseType: 'blob'
    });
  },
};
