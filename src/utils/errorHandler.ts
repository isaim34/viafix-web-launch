
import { toast } from '@/hooks/use-toast';

export interface ErrorWithCode extends Error {
  code?: string;
  status?: number;
}

export const handleAsyncError = (error: unknown, context?: string) => {
  console.error(`Error in ${context || 'operation'}:`, error);
  
  let message = 'An unexpected error occurred';
  let title = 'Error';

  if (error instanceof Error) {
    const err = error as ErrorWithCode;
    
    // Handle specific error types
    if (err.message?.includes('network') || err.message?.includes('fetch')) {
      title = 'Connection Error';
      message = 'Please check your internet connection and try again';
    } else if (err.message?.includes('unauthorized') || err.status === 401) {
      title = 'Authentication Error';
      message = 'Please log in again to continue';
    } else if (err.message?.includes('not found') || err.status === 404) {
      title = 'Not Found';
      message = 'The requested resource was not found';
    } else if (err.message?.includes('timeout')) {
      title = 'Timeout Error';
      message = 'The operation took too long. Please try again';
    } else if (err.message) {
      message = err.message;
    }
  }

  toast({
    title,
    description: message,
    variant: 'destructive',
  });

  return { title, message };
};

export const withErrorHandler = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: string
): T => {
  return (async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleAsyncError(error, context);
      throw error; // Re-throw so calling code can handle it if needed
    }
  }) as T;
};

export const safeAsync = async <T>(
  operation: () => Promise<T>,
  fallback?: T,
  context?: string
): Promise<T | undefined> => {
  try {
    return await operation();
  } catch (error) {
    handleAsyncError(error, context);
    return fallback;
  }
};
