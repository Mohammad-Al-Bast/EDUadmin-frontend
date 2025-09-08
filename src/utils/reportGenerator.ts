import type { ChangeGradeFormData } from "@/services/change-grade";
import type { RegisterDropCourseFormData } from "@/services/register-drop-courses";
import type { Course } from "@/types/courses.types";
import type { Student } from "@/types/students/students.types";
import {
  generateReportPDF,
  downloadPDFBlob,
  printHTMLToPDF,
} from "./pdfGenerator";

export interface ReportData {
  // Organization info
  logo_url: string;
  organization_name: string;
  department_or_faculty: string;

  // Report meta
  report_id: string;
  report_generated_at: string;

  // Submission details
  submitted_at: string;
  submitted_by_name: string;
  submitted_by_role: string;
  submitted_by_email: string;
  submitted_by_ip: string;
  status: string;

  // Student & Course
  student_name: string;
  student_id: string;
  student_major: string;
  course_code: string;
  course_name: string;
  course_section: string;
  semester: string;
  campus: string;

  // Grade change
  original_grade: string;
  requested_grade: string;
  reason_for_change: string;

  // Grade breakdown
  quizzes_score: string;
  tests_score: string;
  midterm_score: string;
  final_score: string;
  curve_value: string;
  final_numeric_grade: string;
  final_letter_grade: string;

  // Signatures (initially empty for new submissions)
  instructor_name: string;
  instructor_signed_at: string;
  chair_name: string;
  chair_signed_at: string;
  dean_name: string;
  dean_signed_at: string;
  academic_director_name: string;
  academic_director_signed_at: string;
  vpa_admin_name: string;
  vpa_admin_signed_at: string;
  registrar_name: string;
  registrar_signed_at: string;

  // Additional
  documents_available: boolean;
  additional_notes: string;
}

export const generateReportId = (): string => {
  const timestamp = new Date().getTime();
  const random = Math.random().toString(36).substring(2, 8);
  return `CGF-${timestamp}-${random.toUpperCase()}`;
};

export const getCurrentDateTime = (): string => {
  return new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });
};

export const convertFormDataToReportData = (
  formData: ChangeGradeFormData,
  submitterInfo: {
    name: string;
    email: string;
    role: string;
    ip: string;
  }
): ReportData => {
  const reportId = generateReportId();
  const currentDateTime = getCurrentDateTime();

  // Extract individual grade scores from grades array
  const gradeBreakdown = {
    quizzes_score: "",
    tests_score: "",
    midterm_score: "",
    final_score: "",
  };

  formData.grades.forEach((grade) => {
    switch (grade.gradeType.toLowerCase()) {
      case "quiz":
        gradeBreakdown.quizzes_score = `${grade.grade} (${grade.gradePercentage})`;
        break;
      case "test":
        gradeBreakdown.tests_score = `${grade.grade} (${grade.gradePercentage})`;
        break;
      case "midterm":
        gradeBreakdown.midterm_score = `${grade.grade} (${grade.gradePercentage})`;
        break;
      case "final":
        gradeBreakdown.final_score = `${grade.grade} (${grade.gradePercentage})`;
        break;
      default:
        // Handle other grade types
        if (!gradeBreakdown.quizzes_score) {
          gradeBreakdown.quizzes_score = `${grade.grade} (${grade.gradePercentage})`;
        }
        break;
    }
  });

  return {
    // Organization info
    logo_url: "/images/liu.png", // Update with actual logo path
    organization_name: "Lebanese International University",
    department_or_faculty: "Academic Affairs",

    // Report meta
    report_id: reportId,
    report_generated_at: currentDateTime,

    // Submission details
    submitted_at: currentDateTime,
    submitted_by_name: submitterInfo.name,
    submitted_by_role: submitterInfo.role,
    submitted_by_email: submitterInfo.email,
    submitted_by_ip: submitterInfo.ip,
    status: "Pending Review",

    // Student & Course
    student_name: formData.student_full_name,
    student_id: formData.university_id.toString(),
    student_major: formData.major,
    course_code: formData.course_code,
    course_name: formData.course_name,
    course_section: formData.section,
    semester: formData.semester_year,
    campus: formData.campus,

    // Grade change
    original_grade: "N/A", // This would come from existing grade records
    requested_grade: formData.letter_grade,
    reason_for_change: formData.reason_for_change,

    // Grade breakdown
    quizzes_score: gradeBreakdown.quizzes_score || "N/A",
    tests_score: gradeBreakdown.tests_score || "N/A",
    midterm_score: gradeBreakdown.midterm_score || "N/A",
    final_score: gradeBreakdown.final_score || "N/A",
    curve_value: formData.curve.toString(),
    final_numeric_grade: formData.final_grade.toFixed(1),
    final_letter_grade: formData.letter_grade,

    // Signatures (empty for new submissions)
    instructor_name: formData.instructor_name,
    instructor_signed_at: "Pending",
    chair_name: "Pending",
    chair_signed_at: "Pending",
    dean_name: "Pending",
    dean_signed_at: "Pending",
    academic_director_name: "Pending",
    academic_director_signed_at: "Pending",
    vpa_admin_name: "Pending",
    vpa_admin_signed_at: "Pending",
    registrar_name: "Pending",
    registrar_signed_at: "Pending",

    // Additional
    documents_available: Object.values(formData.attachments).some(Boolean),
    additional_notes: formData.attachments.original_report
      ? "Original grading report attached. "
      : "" + formData.attachments.graded_exam
      ? "Graded final exam attached. "
      : "" + formData.attachments.tuition_report
      ? "Tuition report attached. "
      : "" + formData.attachments.final_pages
      ? "Final report pages attached."
      : "",
  };
};

// HTML Template - Your provided template with placeholder replacements
export const getReportHTMLTemplate = (): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Change of Grade Submission Report</title>
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<style>
/* Print & general fallback styles (email clients that keep <style>) */
@page {
  size: A4;
  margin: 10mm 12mm;
}
@media print {
  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    font-size: 9pt;
    line-height: 1.2;
  }
  .no-print { display: none !important; }
  .page-wrapper {
    box-shadow: none !important;
    margin: 0 !important;
    border: none !important;
    max-width: none !important;
  }
  a { color: #000 !important; text-decoration: none !important; }
  
  /* Compact spacing for print */
  .compact-header { padding: 12px 16px !important; }
  .compact-content { padding: 8px 16px !important; }
  .compact-section { padding: 6px 16px !important; }
  .compact-table td, .compact-table th { padding: 4px 6px !important; }
  .compact-meta-table td { padding: 2px 0 !important; }
  .compact-title { font-size: 18px !important; margin-top: 6px !important; }
  .compact-subtitle { font-size: 10px !important; margin-top: 2px !important; }
  .compact-section-title { font-size: 12px !important; margin: 0 0 4px 0 !important; }
}

/* Base styles optimized for single page */
body {
  font-size: 11px;
  line-height: 1.3;
}
</style>
</head>
<body style="margin:0; padding:0; background:#f2f4f7; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; color:#222; line-height:1.4;">
  <!-- Wrapper (kept narrow for email clients, centered for print) -->
  <div class="page-wrapper" style="max-width:800px; margin:16px auto; background:#ffffff; border:1px solid #d9dde3; border-radius:6px; box-shadow:0 2px 6px rgba(0,0,0,0.08); overflow:hidden;">
    
    <!-- Header with Logo & Title -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse; background:#ffffff;">
      <tr>
        <td class="compact-header" style="padding:16px 20px; border-bottom:2px solid #0f4c81;">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;">
            <tr>
              <td valign="middle" style="width:60px; padding:0 12px 0 0;">
                <!-- Replace src with actual logo URL -->
                <img src="{{logo_url}}" alt="Company Logo" style="display:block; max-width:60px; height:auto;" />
              </td>
              <td valign="middle" style="padding:0;">
                <div style="font-size:16px; font-weight:600; letter-spacing:.5px; color:#0f4c81; text-transform:uppercase;">{{organization_name}}</div>
                <div style="font-size:12px; color:#555; margin-top:1px;">{{department_or_faculty}}</div>
                <div class="compact-title" style="font-size:20px; font-weight:600; margin-top:8px; color:#222;">Change of Grade Form Submission</div>
                <div class="compact-subtitle" style="font-size:11px; color:#777; margin-top:3px;">Report ID: {{report_id}} &nbsp;|&nbsp; Generated: {{report_generated_at}}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Notice / Intro -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;">
      <tr>
        <td class="compact-content" style="padding:12px 20px 6px 20px;">
          <p style="margin:0 0 6px 0; font-size:12px; color:#555;">
            Below is a structured summary of the submitted Change of Grade request. Please review all fields carefully.
          </p>
        </td>
      </tr>
    </table>

    <!-- Submission Meta Section -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse; font-size:12px;">
      <tr>
        <td class="compact-section" style="padding:3px 20px 12px 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse; background:#f7f9fc; border:1px solid #dbe2ea; border-radius:4px;">
            <tr>
              <td style="padding:10px 12px; vertical-align:top; width:50%;">
                <div class="compact-section-title" style="font-weight:600; font-size:13px; margin:0 0 5px 0; color:#0f4c81;">Submission Details</div>
                <table cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse; width:100%; font-size:11px;">
                  <tr>
                    <td class="compact-meta-table" style="padding:2px 0; width:100px; color:#444;">Submitted At:</td>
                    <td class="compact-meta-table" style="padding:2px 0; font-weight:500; color:#222;">{{submitted_at}}</td>
                  </tr>
                  <tr>
                    <td class="compact-meta-table" style="padding:2px 0; color:#444;">Submitted By:</td>
                    <td class="compact-meta-table" style="padding:2px 0; font-weight:500; color:#222;">{{submitted_by_name}} ({{submitted_by_role}})</td>
                  </tr>
                  <tr>
                    <td class="compact-meta-table" style="padding:2px 0; color:#444;">User Email:</td>
                    <td class="compact-meta-table" style="padding:2px 0; color:#222;">{{submitted_by_email}}</td>
                  </tr>
                </table>
              </td>
              <td style="padding:10px 12px; vertical-align:top; width:50%;">
                <div class="compact-section-title" style="font-weight:600; font-size:13px; margin:0 0 5px 0; color:#0f4c81;">Student & Course</div>
                <table cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse; width:100%; font-size:11px;">
                  <tr>
                    <td class="compact-meta-table" style="padding:2px 0; width:100px; color:#444;">Student Name:</td>
                    <td class="compact-meta-table" style="padding:2px 0; font-weight:500; color:#222;">{{student_name}}</td>
                  </tr>
                  <tr>
                    <td class="compact-meta-table" style="padding:2px 0; color:#444;">Student ID:</td>
                    <td class="compact-meta-table" style="padding:2px 0; color:#222;">{{student_id}}</td>
                  </tr>
                  <tr>
                    <td class="compact-meta-table" style="padding:2px 0; color:#444;">Major:</td>
                    <td class="compact-meta-table" style="padding:2px 0; color:#222;">{{student_major}}</td>
                  </tr>
                  <tr>
                    <td class="compact-meta-table" style="padding:2px 0; color:#444;">Course Code:</td>
                    <td class="compact-meta-table" style="padding:2px 0; color:#222;">{{course_code}}</td>
                  </tr>
                  <tr>
                    <td class="compact-meta-table" style="padding:2px 0; color:#444;">Course Name:</td>
                    <td class="compact-meta-table" style="padding:2px 0; color:#222;">{{course_name}}</td>
                  </tr>
                  <tr>
                    <td class="compact-meta-table" style="padding:2px 0; color:#444;">Section:</td>
                    <td class="compact-meta-table" style="padding:2px 0; color:#222;">{{course_section}}</td>
                  </tr>
                  <tr>
                    <td class="compact-meta-table" style="padding:2px 0; color:#444;">Semester:</td>
                    <td class="compact-meta-table" style="padding:2px 0; color:#222;">{{semester}}</td>
                  </tr>
                  <tr>
                    <td class="compact-meta-table" style="padding:2px 0; color:#444;">Campus:</td>
                    <td class="compact-meta-table" style="padding:2px 0; color:#222;">{{campus}}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Requested Change -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse; font-size:12px;">
      <tr>
        <td class="compact-section" style="padding:0 20px 10px 20px;">
          <div style="background:#ffffff; border:1px solid #dbe2ea; border-radius:4px;">
            <div style="padding:8px 12px; border-bottom:1px solid #e5ebf1; background:#f0f5fa; font-weight:600; font-size:12px; color:#0f4c81;">
              Requested Grade Change
            </div>
            <div style="padding:10px 12px;">
              <p style="margin:0 0 6px 0; font-size:12px; color:#333;">
                Please change the grade from <strong style="color:#b00020;">{{original_grade}}</strong> to
                <strong style="color:#0f4c81;">{{requested_grade}}</strong>.
              </p>
              <p style="margin:0; font-size:11px; color:#555;">
                Reason(s) for change: <span style="font-weight:500; color:#222;">{{reason_for_change}}</span>
              </p>
            </div>
          </div>
        </td>
      </tr>
    </table>

    <!-- Grade Breakdown Table -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;">
      <tr>
        <td class="compact-section" style="padding:0 20px 10px 20px;">
          <div class="compact-section-title" style="font-weight:600; font-size:13px; margin:0 0 6px 0; color:#0f4c81;">Breakdown of the Grade</div>
          <table class="compact-table" width="100%" cellpadding="0" cellspacing="0" role="table" aria-label="Grade Breakdown" style="border-collapse:collapse; font-size:11px; table-layout:fixed; background:#fff; border:1px solid #d0d7de;">
            <thead>
              <tr>
                <th class="compact-table" style="padding:6px 4px; background:#f7f9fc; border-right:1px solid #d0d7de; border-bottom:1px solid #d0d7de; text-align:center; font-weight:600; color:#333;">Quizzes</th>
                <th class="compact-table" style="padding:6px 4px; background:#f7f9fc; border-right:1px solid #d0d7de; border-bottom:1px solid #d0d7de; text-align:center; font-weight:600; color:#333;">Tests</th>
                <th class="compact-table" style="padding:6px 4px; background:#f7f9fc; border-right:1px solid #d0d7de; border-bottom:1px solid #d0d7de; text-align:center; font-weight:600; color:#333;">Midterm</th>
                <th class="compact-table" style="padding:6px 4px; background:#f7f9fc; border-right:1px solid #d0d7de; border-bottom:1px solid #d0d7de; text-align:center; font-weight:600; color:#333;">Final</th>
                <th class="compact-table" style="padding:6px 4px; background:#f7f9fc; border-right:1px solid #d0d7de; border-bottom:1px solid #d0d7de; text-align:center; font-weight:600; color:#333;">Curve</th>
                <th class="compact-table" style="padding:6px 4px; background:#f7f9fc; border-right:1px solid #d0d7de; border-bottom:1px solid #d0d7de; text-align:center; font-weight:600; color:#333;">Final Grade</th>
                <th class="compact-table" style="padding:6px 4px; background:#f7f9fc; border-bottom:1px solid #d0d7de; text-align:center; font-weight:600; color:#333;">Letter Grade</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="compact-table" style="padding:6px 4px; text-align:center; border-right:1px solid #d0d7de; border-bottom:1px solid #d0d7de; color:#222;">{{quizzes_score}}</td>
                <td class="compact-table" style="padding:6px 4px; text-align:center; border-right:1px solid #d0d7de; border-bottom:1px solid #d0d7de; color:#222;">{{tests_score}}</td>
                <td class="compact-table" style="padding:6px 4px; text-align:center; border-right:1px solid #d0d7de; border-bottom:1px solid #d0d7de; color:#222;">{{midterm_score}}</td>
                <td class="compact-table" style="padding:6px 4px; text-align:center; border-right:1px solid #d0d7de; border-bottom:1px solid #d0d7de; color:#222;">{{final_score}}</td>
                <td class="compact-table" style="padding:6px 4px; text-align:center; border-right:1px solid #d0d7de; border-bottom:1px solid #d0d7de; color:#222;">{{curve_value}}</td>
                <td class="compact-table" style="padding:6px 4px; text-align:center; border-right:1px solid #d0d7de; border-bottom:1px solid #d0d7de; font-weight:600; color:#0f4c81;">{{final_numeric_grade}}</td>
                <td class="compact-table" style="padding:6px 4px; text-align:center; border-bottom:1px solid #d0d7de; font-weight:600; color:#0f4c81;">{{final_letter_grade}}</td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </table>

    <!-- Signatures Section -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;">
      <tr>
        <td class="compact-section" style="padding:0 20px 10px 20px;">
          <div class="compact-section-title" style="font-weight:600; font-size:13px; margin:0 0 6px 0; color:#0f4c81;">Authorization & Signatures</div>
          <table class="compact-table" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse; font-size:11px; border:1px solid #d0d7de; background:#ffffff;">
            <tbody>
              <tr>
                <td class="compact-table" style="padding:6px 8px; width:33%; border-right:1px solid #d0d7de; border-bottom:1px solid #d0d7de;">
                  <div style="font-weight:600; color:#333;">Instructor</div>
                  <div style="margin-top:10px; margin-bottom: 10px; border-top:1px solid #ccc; padding-top:3px; font-size:10px; color:#444;">{{instructor_name}}</div>
                </td>
                <td class="compact-table" style="padding:6px 8px; width:33%; border-right:1px solid #d0d7de; border-bottom:1px solid #d0d7de;">
                  <div style="font-weight:600; color:#333;">Chair / Associate Chair</div>
                  <div style="margin-top:10px; margin-bottom: 10px; border-top:1px solid #ccc; padding-top:3px; font-size:10px; color:#444;">{{chair_name}}</div>
                </td>
                <td class="compact-table" style="padding:6px 8px; width:34%; border-bottom:1px solid #d0d7de;">
                  <div style="font-weight:600; color:#333;">Dean</div>
                  <div style="margin-top:10px; margin-bottom: 10px; border-top:1px solid #ccc; padding-top:3px; font-size:10px; color:#444;">{{dean_name}}</div>
                </td>
              </tr>
              <tr>
                <td class="compact-table" style="padding:6px 8px; width:33%; border-right:1px solid #d0d7de;">
                  <div style="font-weight:600; color:#333;">Academic Director</div>
                  <div style="margin-top:10px; margin-bottom: 10px; border-top:1px solid #ccc; padding-top:3px; font-size:10px; color:#444;">{{academic_director_name}}</div>
                </td>
                <td class="compact-table" style="padding:6px 8px; width:33%; border-right:1px solid #d0d7de;">
                  <div style="font-weight:600; color:#333;">VPA / Admin</div>
                  <div style="margin-top:10px; margin-bottom: 10px; border-top:1px solid #ccc; padding-top:3px; font-size:10px; color:#444;">{{vpa_admin_name}}</div>
                </td>
                <td class="compact-table" style="padding:6px 8px; width:34%;">
                  <div style="font-weight:600; color:#333;">Registrar</div>
                  <div style="margin-top:10px; margin-bottom: 10px; border-top:1px solid #ccc; padding-top:3px; font-size:10px; color:#444;">{{registrar_name}}</div>
                </td>
              </tr>
            </tbody>
          </table>
          <div style="font-size:10px; color:#666; margin-top:4px;">(Digital timestamps represent electronic approval where applicable.)</div>
        </td>
      </tr>
    </table>

    <!-- Additional Notes -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;">
      <tr>
        <td class="compact-section" style="padding:0 20px 16px 20px;">
          <div class="compact-section-title" style="font-weight:600; font-size:13px; margin:0 0 4px 0; color:#0f4c81;">Additional Notes</div>
          <div style="padding:8px 10px; border:1px solid #dbe2ea; background:#f9fbfd; border-radius:4px; font-size:11px; color:#333; min-height:30px;">
            {{additional_notes}}
          </div>
        </td>
      </tr>
    </table>

    <!-- Footer -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse; background:#0f4c81;">
      <tr>
        <td style="padding:12px 24px; text-align:center; font-size:11px; color:#e0ecf5;">
          Confidential academic record. Generated automatically on {{report_generated_at}}. Reference: {{report_id}}.
        </td>
      </tr>
    </table>
  </div>

  <!-- Optional action hints (hidden in print) -->
  <div class="no-print" style="text-align:center; font-size:11px; color:#8a8f98; margin:12px 0 24px 0;">
    <span style="display:inline-block; margin:0 6px;">To print: Ctrl/Cmd + P</span>
  </div>

</body>
</html>`;
};

export const generateHTMLReport = (reportData: ReportData): string => {
  let htmlTemplate = getReportHTMLTemplate();

  // Replace all placeholders with actual data
  Object.entries(reportData).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    htmlTemplate = htmlTemplate.replace(
      new RegExp(placeholder, "g"),
      String(value)
    );
  });

  return htmlTemplate;
};

export const openReportInNewWindow = (htmlContent: string): void => {
  const newWindow = window.open("", "_blank", "width=800,height=600");
  if (newWindow) {
    newWindow.document.write(htmlContent);
    newWindow.document.close();
  }
};

export const downloadReportAsHTML = (
  htmlContent: string,
  filename: string = "change-grade-report.html"
): void => {
  const blob = new Blob([htmlContent], { type: "text/html" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const downloadReportAsPDF = async (
  htmlContent: string,
  studentId: string,
  courseCode: string = ""
): Promise<void> => {
  try {
    console.log("Starting PDF generation for student:", studentId);
    const pdfBlob = await generateReportPDF(
      htmlContent,
      "change-grade",
      studentId
    );
    console.log("PDF generated successfully, size:", pdfBlob.size);

    const filename = `change-grade-report-${studentId}${
      courseCode ? "-" + courseCode : ""
    }.pdf`;
    downloadPDFBlob(pdfBlob, filename);
    console.log("PDF download initiated:", filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert(
      "Failed to generate PDF report. Please try downloading as HTML instead."
    );
    throw new Error("Failed to generate PDF report");
  }
};

export const printReportToPDF = (htmlContent: string): void => {
  printHTMLToPDF(htmlContent);
};

// ===============================
// COURSE REGISTRATION REPORT DATA
// ===============================

export interface CourseRegistrationReportData {
  // Organization info
  logo_url: string;
  organization_name: string;
  department_or_faculty: string;

  // Report meta
  report_id: string;
  report_generated_at: string;

  // Submission details
  submitted_at: string;
  submitted_by_name: string;
  submitted_by_role: string;
  submitted_by_email: string;
  submitted_by_ip: string;
  status: string;

  // Student info
  student_name: string;
  student_id: string;
  student_major: string;
  semester: string;
  campus: string;

  // Courses
  registered_courses: CourseInfo[];
  dropped_courses: CourseInfo[];

  // Signatures (initially empty for new submissions)
  instructor_name: string;
  instructor_signed_at: string;
  chair_name: string;
  chair_signed_at: string;
  dean_name: string;
  dean_signed_at: string;
  academic_director_name: string;
  academic_director_signed_at: string;
  vpa_admin_name: string;
  vpa_admin_signed_at: string;
  registrar_name: string;
  registrar_signed_at: string;

  // Additional
  additional_notes: string;
}

export interface CourseInfo {
  course_code: string;
  course_name: string;
  section: string;
  semester: string;
  campus: string;
  instructor?: string;
  credits?: number;
  room?: string;
  schedule?: string;
  days?: string;
  time?: string;
}

export const convertCourseFormDataToReportData = (
  formData: RegisterDropCourseFormData,
  studentData: Student,
  coursesData: Course[],
  submitterInfo: {
    name: string;
    email: string;
    role: string;
    ip: string;
  }
): CourseRegistrationReportData => {
  const reportId = generateReportId();
  const currentDateTime = getCurrentDateTime();

  // Separate registered and dropped courses
  const registeredCourseIds = formData.courses
    .filter((course) => course.action === "register")
    .map((course) => course.courseId);

  const droppedCourseIds = formData.courses
    .filter((course) => course.action === "drop")
    .map((course) => course.courseId);

  // Get course details from coursesData
  const registeredCourses: CourseInfo[] = registeredCourseIds.map(
    (courseId) => {
      const courseDetail = coursesData.find((c) => c.course_id === courseId);
      return courseDetail
        ? {
            course_code: courseDetail.course_code,
            course_name: courseDetail.course_name,
            section: courseDetail.section,
            semester: `${studentData.semester || "N/A"}/${
              studentData.year || "N/A"
            }`,
            campus: studentData.campus || "N/A",
            instructor: courseDetail.instructor,
            credits: courseDetail.credits,
            room: courseDetail.room,
            schedule: courseDetail.schedule,
            days: courseDetail.days,
            time: courseDetail.time,
          }
        : {
            course_code: "N/A",
            course_name: "Course not found",
            section: "N/A",
            semester: `${studentData.semester || "N/A"}/${
              studentData.year || "N/A"
            }`,
            campus: studentData.campus || "N/A",
          };
    }
  );

  const droppedCourses: CourseInfo[] = droppedCourseIds.map((courseId) => {
    const courseDetail = coursesData.find((c) => c.course_id === courseId);
    return courseDetail
      ? {
          course_code: courseDetail.course_code,
          course_name: courseDetail.course_name,
          section: courseDetail.section,
          semester: `${studentData.semester || "N/A"}/${
            studentData.year || "N/A"
          }`,
          campus: studentData.campus || "N/A",
          instructor: courseDetail.instructor,
          credits: courseDetail.credits,
          room: courseDetail.room,
          schedule: courseDetail.schedule,
          days: courseDetail.days,
          time: courseDetail.time,
        }
      : {
          course_code: "N/A",
          course_name: "Course not found",
          section: "N/A",
          semester: `${studentData.semester || "N/A"}/${
            studentData.year || "N/A"
          }`,
          campus: studentData.campus || "N/A",
        };
  });

  return {
    // Organization info
    logo_url: "/images/liu.png",
    organization_name: "Lebanese International University",
    department_or_faculty: "Academic Affairs",

    // Report meta
    report_id: reportId,
    report_generated_at: currentDateTime,

    // Submission details
    submitted_at: currentDateTime,
    submitted_by_name: submitterInfo.name,
    submitted_by_role: submitterInfo.role,
    submitted_by_email: submitterInfo.email,
    submitted_by_ip: submitterInfo.ip,
    status: "Pending Review",

    // Student info
    student_name: studentData.student_name,
    student_id: studentData.university_id.toString(),
    student_major: studentData.major || "N/A",
    semester: `${studentData.semester || "N/A"}/${studentData.year || "N/A"}`,
    campus: studentData.campus || "N/A",

    // Courses
    registered_courses: registeredCourses,
    dropped_courses: droppedCourses,

    // Signatures (empty for new submissions)
    instructor_name: "Pending",
    instructor_signed_at: "Pending",
    chair_name: "Pending",
    chair_signed_at: "Pending",
    dean_name: "Pending",
    dean_signed_at: "Pending",
    academic_director_name: "Pending",
    academic_director_signed_at: "Pending",
    vpa_admin_name: "Pending",
    vpa_admin_signed_at: "Pending",
    registrar_name: "Pending",
    registrar_signed_at: "Pending",

    // Additional
    additional_notes: formData.reason || "No additional notes provided.",
  };
};

// Course Registration HTML Template
export const getCourseRegistrationReportHTMLTemplate = (): string => {
  return `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <title>Course Registration Submission Report</title>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <style>
    /* Print & general fallback styles (email clients that keep <style>) */
    @page {
      size: A4;
      margin: 10mm 12mm;
    }

    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        font-size: 9pt;
        line-height: 1.2;
      }

      .no-print {
        display: none !important;
      }

      .page-wrapper {
        box-shadow: none !important;
        margin: 0 !important;
        border: none !important;
        max-width: none !important;
      }

      a {
        color: #000 !important;
        text-decoration: none !important;
      }
      
      /* Compact spacing for print */
      .compact-header { padding: 12px 16px !important; }
      .compact-content { padding: 8px 16px !important; }
      .compact-section { padding: 6px 16px !important; }
      .compact-table td, .compact-table th { padding: 4px 6px !important; }
      .compact-meta-table td { padding: 2px 0 !important; }
      .compact-title { font-size: 18px !important; margin-top: 6px !important; }
      .compact-subtitle { font-size: 10px !important; margin-top: 2px !important; }
      .compact-section-title { font-size: 12px !important; margin: 0 0 4px 0 !important; }
    }

    /* Base styles optimized for single page */
    body {
      font-size: 11px;
      line-height: 1.3;
    }
  </style>
</head>

<body
  style="margin:0; padding:0; background:#f2f4f7; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; color:#222; line-height:1.4;">
  <!-- Wrapper (kept narrow for email clients, centered for print) -->
  <div class="page-wrapper"
    style="max-width:800px; margin:16px auto; background:#ffffff; border:1px solid #d9dde3; border-radius:6px; box-shadow:0 2px 6px rgba(0,0,0,0.08); overflow:hidden;">

    <!-- Header with Logo & Title -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
      style="border-collapse:collapse; background:#ffffff;">
      <tr>
        <td class="compact-header" style="padding:16px 20px; border-bottom:2px solid #0f4c81;">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;">
            <tr>
              <td valign="middle" style="width:60px; padding:0 12px 0 0;">
                <!-- Replace src with actual logo URL -->
                <img src="{{logo_url}}" alt="Company Logo" style="display:block; max-width:60px; height:auto;" />
              </td>
              <td valign="middle" style="padding:0;">
                <div
                  style="font-size:16px; font-weight:600; letter-spacing:.5px; color:#0f4c81; text-transform:uppercase;">
                  {{organization_name}}</div>
                <div style="font-size:12px; color:#555; margin-top:1px;">{{department_or_faculty}}</div>
                <div class="compact-title" style="font-size:20px; font-weight:600; margin-top:8px; color:#222;">Course Registration Form
                  Submission</div>
                <div class="compact-subtitle" style="font-size:11px; color:#777; margin-top:3px;">Report ID: {{report_id}} &nbsp;|&nbsp;
                  Generated: {{report_generated_at}}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Notice / Intro -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;">
      <tr>
        <td class="compact-content" style="padding:12px 20px 6px 20px;">
          <p style="margin:0 0 6px 0; font-size:12px; color:#555;">
            Below is a structured summary of the submitted Course Registration request. Please review all fields carefully.
          </p>
        </td>
      </tr>
    </table>

    <!-- Submission Meta Section -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
      style="border-collapse:collapse; font-size:12px;">
      <tr>
        <td class="compact-section" style="padding:3px 20px 12px 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
            style="border-collapse:collapse; background:#f7f9fc; border:1px solid #dbe2ea; border-radius:4px;">
            <tr>
              <td style="padding:10px 12px; vertical-align:top; width:50%;">
                <div class="compact-section-title" style="font-weight:600; font-size:13px; margin:0 0 5px 0; color:#0f4c81;">Submission Details</div>
                <table cellpadding="0" cellspacing="0" role="presentation"
                  style="border-collapse:collapse; width:100%; font-size:11px;">
                  <tr>
                    <td class="compact-meta-table" style="padding:2px 0; width:100px; color:#444;">Submitted At:</td>
                    <td class="compact-meta-table" style="padding:2px 0; font-weight:500; color:#222;">{{submitted_at}}</td>
                  </tr>
                  <tr>
                    <td class="compact-meta-table" style="padding:2px 0; color:#444;">Submitted By:</td>
                    <td class="compact-meta-table" style="padding:2px 0; font-weight:500; color:#222;">{{submitted_by_name}}
                      ({{submitted_by_role}})</td>
                  </tr>
                  <tr>
                    <td class="compact-meta-table" style="padding:2px 0; color:#444;">User Email:</td>
                    <td class="compact-meta-table" style="padding:2px 0; color:#222;">{{submitted_by_email}}</td>
                  </tr>
                </table>
              </td>
              <td style="padding:10px 12px; vertical-align:top; width:50%;">
                <div class="compact-section-title" style="font-weight:600; font-size:13px; margin:0 0 5px 0; color:#0f4c81;">Student</div>
                <table cellpadding="0" cellspacing="0" role="presentation"
                  style="border-collapse:collapse; width:100%; font-size:11px;">
                  <tr>
                    <td class="compact-meta-table" style="padding:2px 0; width:100px; color:#444;">Student Name:</td>
                    <td class="compact-meta-table" style="padding:2px 0; font-weight:500; color:#222;">{{student_name}}</td>
                  </tr>
                  <tr>
                    <td class="compact-meta-table" style="padding:2px 0; color:#444;">Student ID:</td>
                    <td class="compact-meta-table" style="padding:2px 0; color:#222;">{{student_id}}</td>
                  </tr>
                  <tr>
                    <td class="compact-meta-table" style="padding:2px 0; color:#444;">Major:</td>
                    <td class="compact-meta-table" style="padding:2px 0; color:#222;">{{student_major}}</td>
                  </tr>
                  <tr>
                    <td class="compact-meta-table" style="padding:2px 0; color:#444;">Semester:</td>
                    <td class="compact-meta-table" style="padding:2px 0; color:#222;">{{semester}}</td>
                  </tr>
                  <tr>
                    <td class="compact-meta-table" style="padding:2px 0; color:#444;">Campus:</td>
                    <td class="compact-meta-table" style="padding:2px 0; color:#222;">{{campus}}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Registered Courses -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
      style="border-collapse:collapse; font-size:12px;">
      <tr>
        <td class="compact-section" style="padding:0 20px 10px 20px;">
          <div style="background:#ffffff; border:1px solid #dbe2ea; border-radius:4px;">
            <div
              style="padding:8px 12px; border-bottom:1px solid #e5ebf1; background:#f0f5fa; font-weight:600; font-size:12px; color:#0f4c81;">
              Registered Courses
            </div>
            <div style="padding:10px 12px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                style="border-collapse:collapse; font-size:11px;">
                {{registered_courses_table_content}}
              </table>
            </div>
          </div>
        </td>
      </tr>
    </table>

    <!-- Dropped Courses -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
      style="border-collapse:collapse; font-size:12px;">
      <tr>
        <td class="compact-section" style="padding:0 20px 10px 20px;">
          <div style="background:#ffffff; border:1px solid #dbe2ea; border-radius:4px;">
            <div
              style="padding:8px 12px; border-bottom:1px solid #e5ebf1; background:#f0f5fa; font-weight:600; font-size:12px; color:#b00020;">
              Dropped Courses
            </div>
            <div style="padding:10px 12px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                style="border-collapse:collapse; font-size:11px;">
                {{dropped_courses_table_content}}
              </table>
            </div>
          </div>
        </td>
      </tr>
    </table>

    <!-- Signatures Section -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;">
      <tr>
        <td class="compact-section" style="padding:0 20px 10px 20px;">
          <div class="compact-section-title" style="font-weight:600; font-size:13px; margin:0 0 6px 0; color:#0f4c81;">Authorization & Signatures
          </div>
          <table class="compact-table" width="100%" cellpadding="0" cellspacing="0" role="presentation"
            style="border-collapse:collapse; font-size:11px; border:1px solid #d0d7de; background:#ffffff;">
            <tbody>
              <tr>
                <td class="compact-table"
                  style="padding:6px 8px; width:33%; border-right:1px solid #d0d7de; border-bottom:1px solid #d0d7de;">
                  <div style="font-weight:600; color:#333;">Instructor</div>
                  <div style="margin-top:10px; margin-bottom: 10px; border-top:1px solid #ccc; padding-top:3px; font-size:10px; color:#444;">
                    {{instructor_name}}</div>
                </td>
                <td class="compact-table"
                  style="padding:6px 8px; width:33%; border-right:1px solid #d0d7de; border-bottom:1px solid #d0d7de;">
                  <div style="font-weight:600; color:#333;">Chair / Associate Chair</div>
                  <div style="margin-top:10px; margin-bottom: 10px; border-top:1px solid #ccc; padding-top:3px; font-size:10px; color:#444;">
                    {{chair_name}}</div>
                </td>
                <td class="compact-table" style="padding:6px 8px; width:34%; border-bottom:1px solid #d0d7de;">
                  <div style="font-weight:600; color:#333;">Dean</div>
                  <div style="margin-top:10px; margin-bottom: 10px; border-top:1px solid #ccc; padding-top:3px; font-size:10px; color:#444;">
                    {{dean_name}}</div>
                </td>
              </tr>
              <tr>
                <td class="compact-table" style="padding:6px 8px; width:33%; border-right:1px solid #d0d7de;">
                  <div style="font-weight:600; color:#333;">Academic Director</div>
                  <div style="margin-top:10px; margin-bottom: 10px; border-top:1px solid #ccc; padding-top:3px; font-size:10px; color:#444;">
                    {{academic_director_name}}</div>
                </td>
                <td class="compact-table" style="padding:6px 8px; width:33%; border-right:1px solid #d0d7de;">
                  <div style="font-weight:600; color:#333;">VPA / Admin</div>
                  <div style="margin-top:10px; margin-bottom: 10px; border-top:1px solid #ccc; padding-top:3px; font-size:10px; color:#444;">
                    {{vpa_admin_name}}</div>
                </td>
                <td class="compact-table" style="padding:6px 8px; width:34%;">
                  <div style="font-weight:600; color:#333;">Registrar</div>
                  <div style="margin-top:10px; margin-bottom: 10px; border-top:1px solid #ccc; padding-top:3px; font-size:10px; color:#444;">
                    {{registrar_name}}</div>
                </td>
              </tr>
            </tbody>
          </table>
          <div style="font-size:10px; color:#666; margin-top:4px;">(Digital timestamps represent electronic approval
            where applicable.)</div>
        </td>
      </tr>
    </table>

    <!-- Additional Notes -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;">
      <tr>
        <td class="compact-section" style="padding:0 20px 16px 20px;">
          <div class="compact-section-title" style="font-weight:600; font-size:13px; margin:0 0 4px 0; color:#0f4c81;">Additional Notes</div>
          <div
            style="padding:8px 10px; border:1px solid #dbe2ea; background:#f9fbfd; border-radius:4px; font-size:11px; color:#333; min-height:30px;">
            {{additional_notes}}
          </div>
        </td>
      </tr>
    </table>

    <!-- Footer -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
      style="border-collapse:collapse; background:#0f4c81;">
      <tr>
        <td style="padding:8px 20px; text-align:center; font-size:10px; color:#e0ecf5;">
          Confidential academic record. Generated automatically on {{report_generated_at}}. Reference: {{report_id}}.
        </td>
      </tr>
    </table>
  </div>

  <!-- Optional action hints (hidden in print) -->
  <div class="no-print" style="text-align:center; font-size:10px; color:#8a8f98; margin:8px 0 16px 0;">
    <span style="display:inline-block; margin:0 6px;">To print: Ctrl/Cmd + P</span>
  </div>

</body>
</html>`;
};

export const generateCourseRegistrationHTMLReport = (
  reportData: CourseRegistrationReportData
): string => {
  let htmlTemplate = getCourseRegistrationReportHTMLTemplate();

  // Generate course rows with compact styling
  const generateCourseRows = (courses: CourseInfo[]) => {
    return courses
      .map(
        (course) => `
      <tr>
        <td style="padding:6px; border-bottom:1px solid #e5ebf1; color:#333; font-size:11px;">${course.course_code}</td>
        <td style="padding:6px; border-bottom:1px solid #e5ebf1; color:#333; font-size:11px;">${course.course_name}</td>
        <td style="padding:6px; border-bottom:1px solid #e5ebf1; color:#333; font-size:11px;">${course.section}</td>
        <td style="padding:6px; border-bottom:1px solid #e5ebf1; color:#333; font-size:11px;">${course.semester}</td>
        <td style="padding:6px; border-bottom:1px solid #e5ebf1; color:#333; font-size:11px;">${course.campus}</td>
      </tr>
    `
      )
      .join("");
  };

  // Generate table content for registered courses
  const generateRegisteredCoursesTableContent = () => {
    if (reportData.registered_courses.length === 0) {
      return `<tbody>
        <tr>
          <td style="padding:12px; color:#666; text-align:center; font-style:italic; font-size:11px;">No registered courses found.</td>
        </tr>
      </tbody>`;
    }

    return `<thead>
      <tr style="background:#f0f5fa;">
        <th style="padding:6px; border-bottom:1px solid #e5ebf1; color:#0f4c81; font-weight:600; text-align:left; font-size:11px;">Course Code</th>
        <th style="padding:6px; border-bottom:1px solid #e5ebf1; color:#0f4c81; font-weight:600; text-align:left; font-size:11px;">Course Name</th>
        <th style="padding:6px; border-bottom:1px solid #e5ebf1; color:#0f4c81; font-weight:600; text-align:left; font-size:11px;">Section</th>
        <th style="padding:6px; border-bottom:1px solid #e5ebf1; color:#0f4c81; font-weight:600; text-align:left; font-size:11px;">Semester</th>
        <th style="padding:6px; border-bottom:1px solid #e5ebf1; color:#0f4c81; font-weight:600; text-align:left; font-size:11px;">Campus</th>
      </tr>
    </thead>
    <tbody>
      ${generateCourseRows(reportData.registered_courses)}
    </tbody>`;
  };

  // Generate table content for dropped courses
  const generateDroppedCoursesTableContent = () => {
    if (reportData.dropped_courses.length === 0) {
      return `<tbody>
        <tr>
          <td style="padding:12px; color:#666; text-align:center; font-style:italic; font-size:11px;">No dropped courses found.</td>
        </tr>
      </tbody>`;
    }

    return `<thead>
      <tr style="background:#f0f5fa;">
        <th style="padding:6px; border-bottom:1px solid #e5ebf1; color:#b00020; font-weight:600; text-align:left; font-size:11px;">Course Code</th>
        <th style="padding:6px; border-bottom:1px solid #e5ebf1; color:#b00020; font-weight:600; text-align:left; font-size:11px;">Course Name</th>
        <th style="padding:6px; border-bottom:1px solid #e5ebf1; color:#b00020; font-weight:600; text-align:left; font-size:11px;">Section</th>
        <th style="padding:6px; border-bottom:1px solid #e5ebf1; color:#b00020; font-weight:600; text-align:left; font-size:11px;">Semester</th>
        <th style="padding:6px; border-bottom:1px solid #e5ebf1; color:#b00020; font-weight:600; text-align:left; font-size:11px;">Campus</th>
      </tr>
    </thead>
    <tbody>
      ${generateCourseRows(reportData.dropped_courses)}
    </tbody>`;
  };

  // Replace table content placeholders
  htmlTemplate = htmlTemplate.replace(
    "{{registered_courses_table_content}}",
    generateRegisteredCoursesTableContent()
  );
  htmlTemplate = htmlTemplate.replace(
    "{{dropped_courses_table_content}}",
    generateDroppedCoursesTableContent()
  );

  // Replace all other placeholders with actual data
  Object.entries(reportData).forEach(([key, value]) => {
    if (key !== "registered_courses" && key !== "dropped_courses") {
      const placeholder = `{{${key}}}`;
      htmlTemplate = htmlTemplate.replace(
        new RegExp(placeholder, "g"),
        String(value)
      );
    }
  });

  return htmlTemplate;
};

export const openCourseRegistrationReportInNewWindow = (
  htmlContent: string
): void => {
  const newWindow = window.open("", "_blank", "width=800,height=600");
  if (newWindow) {
    newWindow.document.write(htmlContent);
    newWindow.document.close();
  }
};

export const downloadCourseRegistrationReportAsHTML = (
  htmlContent: string,
  filename: string = "course-registration-report.html"
): void => {
  const blob = new Blob([htmlContent], { type: "text/html" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const downloadCourseRegistrationReportAsPDF = async (
  htmlContent: string,
  studentId: string
): Promise<void> => {
  try {
    console.log(
      "Starting course registration PDF generation for student:",
      studentId
    );
    console.log("HTML content received, length:", htmlContent?.length || 0);

    if (!htmlContent || htmlContent.length < 100) {
      throw new Error("HTML content is empty or too short");
    }

    const pdfBlob = await generateReportPDF(
      htmlContent,
      "course-registration",
      studentId
    );
    console.log(
      "Course registration PDF generated successfully, size:",
      pdfBlob.size
    );

    if (pdfBlob.size < 1000) {
      throw new Error("Generated PDF is too small, likely empty");
    }

    const filename = `course-registration-report-${studentId}.pdf`;
    downloadPDFBlob(pdfBlob, filename);
    console.log("Course registration PDF download initiated:", filename);
  } catch (error) {
    console.error("Error generating course registration PDF:", error);
    alert(
      `Failed to generate PDF report: ${
        error instanceof Error ? error.message : "Unknown error"
      }. Please try downloading as HTML instead.`
    );
    throw error;
  }
};

export const printCourseRegistrationReportToPDF = (
  htmlContent: string
): void => {
  printHTMLToPDF(htmlContent);
};
