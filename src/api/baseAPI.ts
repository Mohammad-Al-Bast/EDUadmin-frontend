import axios from 'axios';
import type { Method, AxiosResponse, AxiosError } from 'axios';

const API_BASE_URL: string = 'http://localhost:8000/api/v1';
const API_TIMEOUT: number = 30000;

export const APIinstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: API_TIMEOUT,
});

// Define specific types for API responses and requests
type ApiClientResponse<T = unknown> = T;
type ApiParams = Record<string, string | number | boolean | null | undefined>;
type RequestData = Record<string, unknown> | unknown[] | string | number | boolean | null;

// Define error response structure
interface ErrorResponse {
    message?: string;
    errors?: Record<string, string[]> | string[];
    code?: string | number;
}

// Define custom error type
export interface ApiError {
    status?: number;
    message: string;
    errors?: Record<string, string[]> | string[] | null;
    code?: string | number | null;
}

const APIClient = async <T = unknown>(
    method: Method,
    url: string,
    data?: RequestData,
    params?: ApiParams
): Promise<ApiClientResponse<T>> => {
    try {
        const response: AxiosResponse<T> = await APIinstance({
            method,
            url,
            data,
            params,
        });

        return response.data;
    } catch (error: unknown) {
        const axiosError = error as AxiosError<ErrorResponse>;

        if (axiosError.response) {
            const errorData: ApiError = {
                status: axiosError.response.status,
                message: axiosError.response.data?.message || 'Server error occurred',
                errors: axiosError.response.data?.errors || null,
                code: axiosError.response.data?.code || null,
            };
            throw errorData;
        } else if (axiosError.request) {
            const networkError: ApiError = {
                status: 0,
                message: 'No response from server. Please check your internet connection.',
            };
            throw networkError;
        } else {
            const requestError: ApiError = {
                message: axiosError.message || 'An error occurred while preparing the request',
            };
            throw requestError;
        }
    }
};

export const API = {
    get: <T = unknown>(url: string, params?: ApiParams): Promise<ApiClientResponse<T>> =>
        APIClient<T>('GET', url, undefined, params),
    post: <T = unknown>(url: string, data?: RequestData, params?: ApiParams): Promise<ApiClientResponse<T>> =>
        APIClient<T>('POST', url, data, params),
    put: <T = unknown>(url: string, data?: RequestData, params?: ApiParams): Promise<ApiClientResponse<T>> =>
        APIClient<T>('PUT', url, data, params),
    patch: <T = unknown>(url: string, data?: RequestData, params?: ApiParams): Promise<ApiClientResponse<T>> =>
        APIClient<T>('PATCH', url, data, params),
    delete: <T = unknown>(url: string, params?: ApiParams): Promise<ApiClientResponse<T>> =>
        APIClient<T>('DELETE', url, undefined, params),
};