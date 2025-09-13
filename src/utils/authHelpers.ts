// src/utils/authHelpers.ts
import { signOut } from 'aws-amplify/auth';
import { performLogout } from './authStorage';
import { getCognitoConfig } from './cognitoHelpers';

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

// AWS Cognito sign out utilities
export const performAmplifySignOut = async (redirectPath: string = '/auth') => {
  try {
    // Sign out from AWS Cognito
    await signOut();
  } catch (error) {
    console.error('Error signing out from Cognito:', error);
  } finally {
    // Always perform the local logout regardless of Cognito signout result
    performLogout(redirectPath);
  }
};

export const performCombinedSignOut = async () => {
  await performAmplifySignOut('/auth');
};

// Redirect to Cognito Hosted UI on custom domain
export const redirectToCognitoHostedUI = () => {
  const cognitoConfig = getCognitoConfig();
  const cognitoDomain = `https://${cognitoConfig.domain}`;
  const clientId = cognitoConfig.clientId;
  const redirectUri = encodeURIComponent(`${cognitoConfig.appUrl}/auth-redirect-handler`);
  
  const url = `${cognitoDomain}/login?client_id=${clientId}&response_type=token&scope=email+openid+phone&redirect_uri=${redirectUri}`;
  
  window.location.href = url;
};

// For forgot password flow using Cognito hosted UI
export const redirectToForgotPassword = () => {
  const cognitoConfig = getCognitoConfig();
  const cognitoDomain = `https://${cognitoConfig.domain}`;
  const clientId = cognitoConfig.clientId;
  const redirectUri = encodeURIComponent(`${cognitoConfig.appUrl}/auth-redirect-handler`);
  
  const url = `${cognitoDomain}/forgotPassword?client_id=${clientId}&response_type=token&scope=email+openid+phone&redirect_uri=${redirectUri}`;
  
  window.location.href = url;
};
