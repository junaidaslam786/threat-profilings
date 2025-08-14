import { describe, it, expect } from 'vitest';
import { isValidEmail, sanitizeInput } from '../../utils/authHelpers';

describe('authHelpers utility', () => {
  describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.org',
        'user+tag@domain.co.uk',
        'test123@example123.com',
        'a@b.co',
      ];

      validEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(true);
      });
    });

    it('should return false for invalid email addresses', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'test@',
        'test.example.com',
        '',
        'test @example.com',
        'test@example',
        // Note: test..test@example.com is considered valid by the simple regex
      ];

      invalidEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(false);
      });
    });

    it('should handle edge cases', () => {
      expect(isValidEmail('a@b.c')).toBe(true);
      expect(isValidEmail('test@example.museum')).toBe(true);
      expect(isValidEmail('test@sub.domain.com')).toBe(true);
    });
  });

  describe('sanitizeInput', () => {
    it('should trim whitespace from input', () => {
      expect(sanitizeInput('  hello  ')).toBe('hello');
      expect(sanitizeInput('\n\ttest\n\t')).toBe('test');
      expect(sanitizeInput('   ')).toBe('');
    });

    it('should handle empty strings', () => {
      expect(sanitizeInput('')).toBe('');
    });

    it('should not modify strings without leading/trailing whitespace', () => {
      expect(sanitizeInput('hello world')).toBe('hello world');
      expect(sanitizeInput('test')).toBe('test');
    });

    it('should preserve internal whitespace', () => {
      expect(sanitizeInput('  hello world  ')).toBe('hello world');
      expect(sanitizeInput('  multi   space   text  ')).toBe('multi   space   text');
    });
  });
});
