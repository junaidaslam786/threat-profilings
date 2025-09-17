import { getIdToken, getAccessToken, removeAuthTokens } from './authStorage';

export interface CognitoIdTokenPayload {
  sub: string;
  email_verified: boolean;
  iss: string;
  'cognito:username': string;
  given_name?: string;
  family_name?: string;
  aud: string;
  event_id: string;
  token_use: 'id';
  auth_time: number;
  exp: number;
  iat: number;
  email: string;
  [key: string]: unknown;
}

export interface CognitoAccessTokenPayload {
  sub: string;
  iss: string;
  version: number;
  client_id: string;
  event_id: string;
  token_use: 'access';
  scope: string;
  auth_time: number;
  exp: number;
  iat: number;
  jti: string;
  username: string;
  [key: string]: unknown;
}

export interface TokenValidationResult {
  isValid: boolean;
  isExpired: boolean;
  payload: CognitoIdTokenPayload | CognitoAccessTokenPayload | null;
  error?: string;
}

/**
 * Decodes a JWT token and returns the payload
 */
export const decodeToken = <T = CognitoIdTokenPayload | CognitoAccessTokenPayload>(
  token: string
): T | null => {
  try {
    if (!token || token.split('.').length !== 3) {
      return null;
    }

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Add padding if needed
    const paddedBase64 = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    
    const jsonPayload = decodeURIComponent(
      atob(paddedBase64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload) as T;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

/**
 * Validates if a token is structurally valid and not expired
 */
export const validateToken = (token: string | null): TokenValidationResult => {
  if (!token) {
    return {
      isValid: false,
      isExpired: false,
      payload: null,
      error: 'Token is null or undefined'
    };
  }

  const payload = decodeToken(token);
  
  if (!payload) {
    return {
      isValid: false,
      isExpired: false,
      payload: null,
      error: 'Failed to decode token'
    };
  }

  // Check if token has expiration
  if (!payload.exp) {
    return {
      isValid: false,
      isExpired: false,
      payload,
      error: 'Token does not have expiration time'
    };
  }

  // Check if token is expired (with 30 second buffer for clock skew)
  const now = Math.floor(Date.now() / 1000);
  const isExpired = payload.exp <= (now + 30);

  return {
    isValid: !isExpired,
    isExpired,
    payload,
    error: isExpired ? 'Token is expired' : undefined
  };
};

/**
 * Validates the ID token from localStorage
 */
export const validateIdToken = (): TokenValidationResult => {
  const idToken = getIdToken();
  return validateToken(idToken || null);
};

/**
 * Validates the access token from localStorage
 */
export const validateAccessToken = (): TokenValidationResult => {
  const accessToken = getAccessToken();
  return validateToken(accessToken || null);
};

/**
 * Validates both ID and access tokens
 */
export const validateBothTokens = (): {
  idToken: TokenValidationResult;
  accessToken: TokenValidationResult;
  bothValid: boolean;
} => {
  const idTokenResult = validateIdToken();
  const accessTokenResult = validateAccessToken();
  
  return {
    idToken: idTokenResult,
    accessToken: accessTokenResult,
    bothValid: idTokenResult.isValid && accessTokenResult.isValid
  };
};

/**
 * Checks if tokens are valid, and if not, clears them
 * Returns true if tokens are valid, false if they were invalid and cleared
 */
export const validateAndCleanupTokens = (): boolean => {
  const { bothValid } = validateBothTokens();
  
  if (!bothValid) {
    console.warn('Invalid or expired tokens detected, clearing auth tokens');
    removeAuthTokens();
    return false;
  }
  
  return true;
};

/**
 * Gets user information from the ID token payload
 */
export const getUserInfoFromToken = (): {
  sub: string;
  email: string;
  username: string;
  emailVerified: boolean;
} | null => {
  const idTokenResult = validateIdToken();
  
  if (!idTokenResult.isValid || !idTokenResult.payload) {
    return null;
  }

  const payload = idTokenResult.payload as CognitoIdTokenPayload;
  
  return {
    sub: payload.sub,
    email: payload.email,
    username: payload['cognito:username'],
    emailVerified: payload.email_verified
  };
};

/**
 * Checks if the current session is authenticated with valid tokens
 */
export const isAuthenticated = (): boolean => {
  return validateAndCleanupTokens();
};

/**
 * Gets the expiration time of the ID token in seconds since epoch
 */
export const getTokenExpiration = (): number | null => {
  const idTokenResult = validateIdToken();
  return idTokenResult.payload?.exp || null;
};

/**
 * Gets the time until token expiration in seconds
 */
export const getTimeUntilExpiration = (): number | null => {
  const exp = getTokenExpiration();
  if (!exp) return null;
  
  const now = Math.floor(Date.now() / 1000);
  return Math.max(0, exp - now);
};