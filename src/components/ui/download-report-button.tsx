import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Download,
  FileText,
  File,
  ChevronDown,
  Printer,
  TestTube,
} from "lucide-react";
import {
  generateTestPDF,
  testHTMLToPDF,
  downloadPDFBlob,
} from "@/utils/pdfGenerator";

interface DownloadReportButtonProps {
  onDownloadHTML: () => void;
  onDownloadPDF: () => void;
  onPrintToPDF?: () => void;
  isGenerating?: boolean;
  variant?: "default" | "outline" | "secondary";
  size?: "sm" | "default" | "lg";
  showDebugOptions?: boolean;
}

export const DownloadReportButton: React.FC<DownloadReportButtonProps> = ({
  onDownloadHTML,
  onDownloadPDF,
  onPrintToPDF,
  isGenerating = false,
  variant = "default",
  size = "default",
  showDebugOptions = false,
}) => {
  const handleTestPDF = async () => {
    try {
      const testBlob = await generateTestPDF();
      downloadPDFBlob(testBlob, "test-basic.pdf");
    } catch (error) {
      console.error("Basic PDF test failed:", error);
      alert(
        "Basic PDF test failed: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  const handleTestHTMLToPDF = async () => {
    try {
      const testBlob = await testHTMLToPDF();
      downloadPDFBlob(testBlob, "test-html-to-pdf.pdf");
    } catch (error) {
      console.error("HTML to PDF test failed:", error);
      alert(
        "HTML to PDF test failed: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download Report
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={onDownloadHTML}
          disabled={isGenerating}
          className="flex items-center gap-2 cursor-pointer"
        >
          <FileText className="h-4 w-4" />
          Download as HTML
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDownloadPDF}
          disabled={isGenerating}
          className="flex items-center gap-2 cursor-pointer"
        >
          <File className="h-4 w-4" />
          Download as PDF
        </DropdownMenuItem>
        {onPrintToPDF && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onPrintToPDF}
              disabled={isGenerating}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              Print to PDF
            </DropdownMenuItem>
          </>
        )}
        {showDebugOptions && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleTestPDF}
              disabled={isGenerating}
              className="flex items-center gap-2 cursor-pointer text-orange-600"
            >
              <TestTube className="h-4 w-4" />
              Test Basic PDF
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleTestHTMLToPDF}
              disabled={isGenerating}
              className="flex items-center gap-2 cursor-pointer text-orange-600"
            >
              <TestTube className="h-4 w-4" />
              Test HTML to PDF
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface SimpleDownloadButtonsProps {
  onDownloadHTML: () => void;
  onDownloadPDF: () => void;
  isGenerating?: boolean;
  variant?: "default" | "outline" | "secondary";
  size?: "sm" | "default" | "lg";
}

export const SimpleDownloadButtons: React.FC<SimpleDownloadButtonsProps> = ({
  onDownloadHTML,
  onDownloadPDF,
  isGenerating = false,
  variant = "outline",
  size = "sm",
}) => {
  return (
    <div className="flex gap-2">
      <Button
        variant={variant}
        size={size}
        onClick={onDownloadHTML}
        disabled={isGenerating}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        HTML
      </Button>
      <Button
        variant={variant}
        size={size}
        onClick={onDownloadPDF}
        disabled={isGenerating}
        className="flex items-center gap-2"
      >
        <File className="h-4 w-4" />
        PDF
      </Button>
    </div>
  );
};
