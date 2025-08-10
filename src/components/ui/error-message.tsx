import React from 'react';
import { AlertCircle, ShieldX, Wifi, Server } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { ApiError } from '@/api/baseAPI';
import { formatApiError } from '@/lib/utils';

interface ErrorMessageProps {
    error: ApiError | null;
    className?: string;
}

const getErrorIcon = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('not verified') || lowerMessage.includes('verify')) {
        return <ShieldX className="h-4 w-4" />;
    }
    
    if (lowerMessage.includes('network') || lowerMessage.includes('connection')) {
        return <Wifi className="h-4 w-4" />;
    }
    
    if (lowerMessage.includes('server')) {
        return <Server className="h-4 w-4" />;
    }
    
    return <AlertCircle className="h-4 w-4" />;
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, className }) => {
    if (!error) return null;

    const { title, description } = formatApiError(error);

    return (
        <Alert variant="destructive" className={className}>
            {getErrorIcon(error.message)}
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>
                {description}
                {error.errors && typeof error.errors === 'object' && (
                    <ul className="mt-2 list-disc list-inside text-xs space-y-1">
                        {Object.entries(error.errors).map(([field, messages]) => (
                            <li key={field}>
                                <span className="font-medium capitalize">{field}:</span>{' '}
                                {Array.isArray(messages) ? messages.join(', ') : String(messages)}
                            </li>
                        ))}
                    </ul>
                )}
            </AlertDescription>
        </Alert>
    );
};

export default ErrorMessage;
