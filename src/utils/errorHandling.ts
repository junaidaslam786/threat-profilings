// Error handling utilities for consistent error management across the app

export interface ApiError {
  data?: {
    message?: string;
    error?: string;
  };
  status?: number;
  message?: string;
}

export const extractErrorMessage = (error: unknown): string => {
  if (!error) return "An unknown error occurred";
  
  // Handle RTK Query errors
  if (typeof error === "object" && error !== null) {
    const apiError = error as ApiError;
    
    if (apiError.data?.message) {
      return apiError.data.message;
    }
    
    if (apiError.data?.error) {
      return apiError.data.error;
    }
    
    if (apiError.message) {
      return apiError.message;
    }
  }
  
  // Handle string errors
  if (typeof error === "string") {
    return error;
  }
  
  // Handle Error objects
  if (error instanceof Error) {
    return error.message;
  }
  
  return "An unexpected error occurred";
};

export const handleApiError = (error: unknown, fallbackMessage = "Operation failed"): string => {
  const message = extractErrorMessage(error);
  return message || fallbackMessage;
};