import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import type { ApiError } from "@/api/baseAPI";

interface ErrorDisplayProps {
    error: ApiError;
    onRetry?: () => void;
    title?: string;
}

export function ErrorDisplay({ error, onRetry, title = "Error Loading Data" }: ErrorDisplayProps) {
    const getErrorMessage = (error: ApiError): string => {
        if (error.status === 0) {
            return "Unable to connect to the server. Please check your internet connection.";
        }

        if (error.status === 404) {
            return "The requested resource was not found.";
        }

        if (error.status === 500) {
            return "Internal server error. Please try again later.";
        }

        if (error.errors && Array.isArray(error.errors)) {
            return error.errors.join(", ");
        }

        if (error.errors && typeof error.errors === "object") {
            return Object.values(error.errors).flat().join(", ");
        }

        return error.message || "An unexpected error occurred.";
    };

    return (
        <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription className="mt-2">
                <p className="mb-3">{getErrorMessage(error)}</p>
                {onRetry && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRetry}
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className="h-3 w-3" />
                        Try Again
                    </Button>
                )}
            </AlertDescription>
        </Alert>
    );
}
