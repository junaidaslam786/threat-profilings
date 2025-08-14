import { describe, it, expect } from 'vitest';
import { extractErrorMessage, handleApiError } from '../../utils/errorHandling';

describe('errorHandling utility', () => {
  describe('extractErrorMessage', () => {
    it('should return default message for null/undefined error', () => {
      expect(extractErrorMessage(null)).toBe('An unknown error occurred');
      expect(extractErrorMessage(undefined)).toBe('An unknown error occurred');
    });

    it('should extract message from RTK Query error with data.message', () => {
      const error = {
        data: {
          message: 'API error message',
        },
      };
      expect(extractErrorMessage(error)).toBe('API error message');
    });

    it('should extract error from RTK Query error with data.error', () => {
      const error = {
        data: {
          error: 'API error',
        },
      };
      expect(extractErrorMessage(error)).toBe('API error');
    });

    it('should extract message from error object', () => {
      const error = {
        message: 'Direct error message',
      };
      expect(extractErrorMessage(error)).toBe('Direct error message');
    });

    it('should handle string errors', () => {
      expect(extractErrorMessage('String error')).toBe('String error');
    });

    it('should handle Error objects', () => {
      const error = new Error('Error object message');
      expect(extractErrorMessage(error)).toBe('Error object message');
    });

    it('should return default message for unknown error types', () => {
      expect(extractErrorMessage(123)).toBe('An unexpected error occurred');
      expect(extractErrorMessage([])).toBe('An unexpected error occurred');
    });

    it('should prioritize data.message over data.error', () => {
      const error = {
        data: {
          message: 'Priority message',
          error: 'Secondary error',
        },
      };
      expect(extractErrorMessage(error)).toBe('Priority message');
    });

    it('should fallback to message when data.message is not available', () => {
      const error = {
        data: {
          error: 'Data error',
        },
        message: 'Fallback message',
      };
      expect(extractErrorMessage(error)).toBe('Data error');
    });
  });

  describe('handleApiError', () => {
    it('should return extracted error message', () => {
      const error = {
        data: {
          message: 'API error',
        },
      };
      expect(handleApiError(error)).toBe('API error');
    });

    it('should return extracted message when error message is not empty', () => {
      const error = { message: 'Something went wrong' };
      expect(handleApiError(error, 'Custom fallback')).toBe('Something went wrong');
    });

    it('should return extracted message for default case', () => {
      const error = {};
      expect(handleApiError(error)).toBe('An unexpected error occurred');
    });

    it('should handle null/undefined errors with default message', () => {
      expect(handleApiError(null, 'Null error fallback')).toBe('An unknown error occurred');
      expect(handleApiError(undefined, 'Undefined error fallback')).toBe('An unknown error occurred');
    });
  });
});
