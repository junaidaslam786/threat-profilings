// src/utils/authHelpers.ts
// This file can contain utility functions that don't directly deal with UI or state.
// For static UI without Firebase, these might not be directly used,
// but they represent where such logic would be placed in a full application.

// Example: A simple email validation function that could be used in multiple forms
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Example: A function to sanitize string inputs
export const sanitizeInput = (input: string): string => {
  return input.trim();
};
