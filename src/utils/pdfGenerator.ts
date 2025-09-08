import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface PDFGenerationOptions {
  filename?: string;
  format?: "a4" | "letter";
  orientation?: "portrait" | "landscape";
  margin?: number;
  quality?: number;
}

/**
 * Convert HTML content to PDF using html2canvas and jsPDF
 * This method renders the HTML to canvas and then converts to PDF
 */
export const generatePDFFromHTML = async (
  htmlContent: string,
  options: PDFGenerationOptions = {}
): Promise<Blob> => {
  const {
    format = "a4",
    orientation = "portrait",
    margin = 10,
    quality = 1.0,
  } = options;

  try {
    // Create a temporary iframe for better rendering isolation
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.left = "-9999px";
    iframe.style.top = "0";
    iframe.style.width = "800px";
    iframe.style.height = "1200px";
    iframe.style.border = "none";

    document.body.appendChild(iframe);

    // Wait for iframe to be ready
    await new Promise((resolve) => {
      iframe.onload = resolve;
      iframe.src = "about:blank";
    });

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      throw new Error("Unable to access iframe document");
    }

    // Create complete HTML document with proper styling
    const completeHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Report</title>
        <style>
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            background: #ffffff;
            padding: 20px;
            width: 800px;
            min-height: 1000px;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            background: #fff;
          }
          
          th, td {
            border: 1px solid #ddd;
            padding: 8px 12px;
            vertical-align: top;
            text-align: left;
          }
          
          th {
            background-color: #f5f5f5;
            font-weight: 600;
          }
          
          .header-section {
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #0f4c81;
          }
          
          .logo-section {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
          }
          
          .organization-name {
            font-size: 18px;
            font-weight: 600;
            color: #0f4c81;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .department {
            font-size: 14px;
            color: #555;
            margin-top: 2px;
          }
          
          .report-title {
            font-size: 22px;
            font-weight: 600;
            margin-top: 10px;
            color: #222;
          }
          
          .report-meta {
            font-size: 12px;
            color: #777;
            margin-top: 4px;
          }
          
          .section-title {
            font-weight: 600;
            font-size: 14px;
            margin: 15px 0 8px 0;
            color: #0f4c81;
          }
          
          .info-table {
            background: #f7f9fc;
            border: 1px solid #dbe2ea;
            border-radius: 4px;
            overflow: hidden;
          }
          
          .info-table td {
            padding: 12px 16px;
            border: none;
            border-bottom: 1px solid #e5ebf1;
          }
          
          .info-table td:first-child {
            font-weight: 500;
            color: #444;
            width: 120px;
          }
          
          .info-table td:last-child {
            color: #222;
          }
          
          .course-table th {
            background-color: #0f4c81;
            color: white;
            font-weight: 600;
            text-align: center;
          }
          
          .course-table td {
            text-align: center;
            padding: 10px 8px;
          }
          
          .status-pending {
            color: #f59e0b;
            font-weight: 500;
          }
          
          .no-print {
            display: none !important;
          }
          
          .page-wrapper {
            max-width: 800px;
            margin: 0 auto;
          }
          
          /* Print styles */
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .no-print {
              display: none !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="page-wrapper">
          ${htmlContent}
        </div>
      </body>
      </html>
    `;

    // Write HTML to iframe
    iframeDoc.open();
    iframeDoc.write(completeHTML);
    iframeDoc.close();

    // Wait for content to render and styles to load
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Get the body element for canvas generation
    const bodyElement = iframeDoc.body;
    if (!bodyElement) {
      throw new Error("Unable to find body element in iframe");
    }

    console.log("Starting canvas generation from iframe content...");
    console.log(
      "Body element dimensions:",
      bodyElement.scrollWidth,
      "x",
      bodyElement.scrollHeight
    );

    // Generate canvas from the iframe content
    const canvas = await html2canvas(bodyElement, {
      allowTaint: true,
      foreignObjectRendering: true,
      scale: quality,
      useCORS: true,
      logging: true,
      width: bodyElement.scrollWidth,
      height: bodyElement.scrollHeight,
      backgroundColor: "#ffffff",
      removeContainer: false,
      imageTimeout: 10000,
      onclone: (clonedDoc) => {
        // Ensure styles are properly applied in cloned document
        const clonedBody = clonedDoc.body as HTMLElement;
        if (clonedBody) {
          clonedBody.style.width = "800px";
          clonedBody.style.backgroundColor = "#ffffff";
          clonedBody.style.padding = "20px";
          clonedBody.style.fontFamily = "Arial, sans-serif";
        }
      },
    });

    // Clean up iframe
    document.body.removeChild(iframe);

    console.log("Canvas generated:", canvas.width, "x", canvas.height);

    // Validate canvas
    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error("Generated canvas is empty or invalid");
    }

    // Create PDF
    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    console.log("Image data generated, length:", imgData.length);

    if (imgData.length < 1000) {
      throw new Error("Generated image data appears to be empty");
    }

    const pdf = new jsPDF({
      orientation,
      unit: "mm",
      format,
    });

    // Calculate dimensions to fit the content properly
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    console.log("PDF page dimensions:", pageWidth, "x", pageHeight);
    console.log("Image dimensions for PDF:", imgWidth, "x", imgHeight);

    let heightLeft = imgHeight;
    let position = margin;

    // Add first page
    pdf.addImage(imgData, "JPEG", margin, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - margin * 2;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + margin;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - margin * 2;
    }

    const pdfBlob = pdf.output("blob");
    console.log("PDF generated successfully, size:", pdfBlob.size, "bytes");

    if (pdfBlob.size < 1000) {
      throw new Error("Generated PDF appears to be empty");
    }

    return pdfBlob;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error(
      `Failed to generate PDF from HTML: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

/**
 * Download PDF blob as file
 */
export const downloadPDFBlob = (blob: Blob, filename: string): void => {
  try {
    if (!blob || blob.size === 0) {
      throw new Error("Invalid or empty PDF blob");
    }

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();

    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error("Error downloading PDF:", error);
    alert("Failed to download PDF. Please try again.");
  }
};

/**
 * Alternative method using the browser's print API
 * This method opens a print dialog where the user can save as PDF
 */
export const printHTMLToPDF = (htmlContent: string): void => {
  try {
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) {
      alert("Popup blocked. Please allow popups and try again.");
      return;
    }

    const enhancedHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Report</title>
        <style>
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .no-print { display: none !important; }
            table { page-break-inside: avoid; }
            tr { page-break-inside: avoid; }
          }
          body { 
            font-family: Arial, sans-serif; 
            font-size: 12px; 
            line-height: 1.4; 
            color: #333;
            margin: 20px;
            background: white;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
          }
          .page-break { 
            page-break-before: always; 
          }
        </style>
      </head>
      <body>
        ${htmlContent}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              // Close window after print dialog
              setTimeout(function() {
                window.close();
              }, 1000);
            }, 500);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(enhancedHTML);
    printWindow.document.close();
  } catch (error) {
    console.error("Error opening print dialog:", error);
    alert("Failed to open print dialog. Please try another download method.");
  }
};

/**
 * Enhanced PDF generation with better formatting for reports
 */
export const generateReportPDF = async (
  htmlContent: string,
  reportType: "change-grade" | "course-registration",
  studentId: string
): Promise<Blob> => {
  const timestamp = new Date().toISOString().split("T")[0];
  const filename = `${reportType}-report-${studentId}-${timestamp}.pdf`;

  try {
    console.log("Starting PDF generation for:", reportType, studentId);
    console.log("HTML content length:", htmlContent.length);

    // Log first 500 characters of HTML for debugging
    console.log("HTML preview:", htmlContent.substring(0, 500));

    // First try the main PDF generation method
    const enhancedHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Report</title>
        <style>
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .no-print { display: none !important; }
            table { page-break-inside: avoid; }
            tr { page-break-inside: avoid; }
          }
          body { 
            font-family: Arial, sans-serif; 
            font-size: 12px; 
            line-height: 1.4; 
            color: #333;
            margin: 0;
            padding: 20px;
            background: white;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 10px;
          }
          td, th {
            padding: 8px;
            border: 1px solid #ddd;
            vertical-align: top;
          }
          .page-break { 
            page-break-before: always; 
          }
          img {
            max-width: 100%;
            height: auto;
          }
          .no-print {
            display: none !important;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;

    const result = await generatePDFFromHTML(enhancedHTML, {
      filename,
      format: "a4",
      orientation: "portrait",
      margin: 15,
      quality: 1.0, // Reduced quality for better performance
    });

    console.log("PDF generation successful, size:", result.size);
    return result;
  } catch (error) {
    console.warn("Primary PDF generation failed:", error);
    console.log("Trying fallback method...");
    // Fallback to simpler PDF generation
    return await generateSimplePDF(htmlContent, filename);
  }
};

/**
 * Fallback PDF generation method using jsPDF text methods
 */
export const generateSimplePDF = async (
  htmlContent: string,
  _filename: string
): Promise<Blob> => {
  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Simple text extraction from HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;

    // Remove script and style tags
    const scripts = tempDiv.querySelectorAll("script, style, .no-print");
    scripts.forEach((el) => el.remove());

    const textContent = tempDiv.textContent || tempDiv.innerText || "";
    const lines = textContent
      .split("\n")
      .filter((line) => line.trim().length > 0);

    // Add title
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Report Generated", 20, 20);

    // Add content
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");

    let yPosition = 40;
    const lineHeight = 5;
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;

    lines.forEach((line) => {
      if (yPosition > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }

      // Split long lines
      const maxWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
      const splitText = pdf.splitTextToSize(line.trim(), maxWidth);

      splitText.forEach((splitLine: string) => {
        if (yPosition > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(splitLine, margin, yPosition);
        yPosition += lineHeight;
      });
    });

    // Add footer
    const pageCount = pdf.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.text(
        `Generated on ${new Date().toLocaleDateString()} - Page ${i} of ${pageCount}`,
        margin,
        pageHeight - 10
      );
    }

    return pdf.output("blob");
  } catch (error) {
    console.error("Fallback PDF generation failed:", error);
    throw new Error("All PDF generation methods failed");
  }
};

/**
 * Test function to generate a simple PDF for debugging
 */
export const generateTestPDF = async (): Promise<Blob> => {
  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Add simple text
    pdf.setFontSize(16);
    pdf.text("Test PDF Generation", 20, 30);

    pdf.setFontSize(12);
    pdf.text(
      "This is a test PDF to verify jsPDF is working correctly.",
      20,
      50
    );
    pdf.text(
      "If you can see this text, the basic PDF generation works.",
      20,
      70
    );

    // Add current date
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, 90);

    return pdf.output("blob");
  } catch (error) {
    console.error("Test PDF generation failed:", error);
    throw error;
  }
};

/**
 * Alternative PDF generation method that preserves HTML styling better
 * Uses a different approach with better style handling
 */
export const generateStyledPDFFromHTML = async (
  htmlContent: string,
  options: PDFGenerationOptions = {}
): Promise<Blob> => {
  const {
    format = "a4",
    orientation = "portrait",
    margin = 10,
    quality = 1.0,
  } = options;

  try {
    // Create a new window for better isolation
    const printWindow = window.open("", "_blank", "width=800,height=1200");
    if (!printWindow) {
      throw new Error("Unable to open print window - popup blocked");
    }

    const enhancedHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Report PDF Generation</title>
        <style>
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            background: #ffffff;
            padding: 20px;
            width: 800px;
            margin: 0 auto;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            background: #fff;
          }
          
          th, td {
            border: 1px solid #ddd;
            padding: 8px 12px;
            vertical-align: top;
            text-align: left;
          }
          
          th {
            background-color: #f5f5f5;
            font-weight: 600;
          }
          
          /* Enhanced styling for report elements */
          [style*="color:#0f4c81"], .text-blue {
            color: #0f4c81 !important;
          }
          
          [style*="background:#f7f9fc"], .bg-light {
            background: #f7f9fc !important;
          }
          
          [style*="border:1px solid #dbe2ea"], .border-light {
            border: 1px solid #dbe2ea !important;
          }
          
          [style*="font-weight:600"], .font-semibold {
            font-weight: 600 !important;
          }
          
          .organization-name {
            font-size: 18px;
            font-weight: 600;
            color: #0f4c81;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .report-title {
            font-size: 22px;
            font-weight: 600;
            margin: 10px 0;
            color: #222;
          }
          
          .no-print {
            display: none !important;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;

    printWindow.document.write(enhancedHTML);
    printWindow.document.close();

    // Wait for content to load
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate canvas from the new window
    const canvas = await html2canvas(printWindow.document.body, {
      allowTaint: true,
      foreignObjectRendering: true,
      scale: quality,
      useCORS: true,
      logging: true,
      backgroundColor: "#ffffff",
      width: 800,
      height: printWindow.document.body.scrollHeight,
    });

    // Close the print window
    printWindow.close();

    console.log("Styled canvas generated:", canvas.width, "x", canvas.height);

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error("Styled canvas generation failed");
    }

    // Create PDF
    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF({
      orientation,
      unit: "mm",
      format,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = margin;

    pdf.addImage(imgData, "JPEG", margin, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - margin * 2;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + margin;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - margin * 2;
    }

    return pdf.output("blob");
  } catch (error) {
    console.error("Styled PDF generation failed:", error);
    throw error;
  }
};

/**
 * Test HTML to PDF conversion with simple content
 */
export const testHTMLToPDF = async (): Promise<Blob> => {
  const simpleHTML = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h1 style="color: #0f4c81; margin-bottom: 20px;">Test HTML to PDF Conversion</h1>
      <p>This is a test to verify HTML to PDF conversion is working with proper styling.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f5f5f5;">
            <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Column 1</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Column 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Test Cell 1</td>
            <td style="border: 1px solid #ddd; padding: 8px;">Test Cell 2</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Test Cell 3</td>
            <td style="border: 1px solid #ddd; padding: 8px;">Test Cell 4</td>
          </tr>
        </tbody>
      </table>
      <div style="background: #f7f9fc; border: 1px solid #dbe2ea; padding: 15px; border-radius: 4px;">
        <p style="margin: 0; color: #555;">This is a styled box to test background colors and borders.</p>
      </div>
      <p style="margin-top: 20px; font-size: 11px; color: #666;">Generated on: ${new Date().toLocaleString()}</p>
    </div>
  `;

  try {
    // Try the new styled PDF generation first
    return await generateStyledPDFFromHTML(simpleHTML, {
      format: "a4",
      orientation: "portrait",
      margin: 15,
      quality: 1.0,
    });
  } catch (error) {
    console.warn("Styled PDF generation failed, trying basic method:", error);
    // Fallback to basic method
    return await generatePDFFromHTML(simpleHTML, {
      format: "a4",
      orientation: "portrait",
      margin: 15,
      quality: 1.0,
    });
  }
};
