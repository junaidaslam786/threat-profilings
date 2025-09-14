import { decodeJWT } from './jwtHelpers';
import { getIdToken, getAccessToken } from './authStorage';

export const debugTokenDetails = () => {
  const idToken = getIdToken();
  const accessToken = getAccessToken();
  
  console.group('🔍 Token Debug Information');
  
  if (idToken) {
    const decodedId = decodeJWT(idToken);
    console.group('📝 ID Token Details');
    console.log('Raw Token (first 50 chars):', idToken.substring(0, 50) + '...');
    console.log('Decoded Payload:', decodedId);
    console.log('Issuer (iss):', decodedId?.iss);
    console.log('Audience (aud):', decodedId?.aud);
    console.log('Subject (sub):', decodedId?.sub);
    console.log('Email:', decodedId?.email);
    console.log('Token Use:', decodedId?.token_use);
    console.log('Expires At:', decodedId?.exp ? new Date(decodedId.exp * 1000).toISOString() : 'N/A');
    console.log('Issued At:', decodedId?.iat ? new Date(decodedId.iat * 1000).toISOString() : 'N/A');
    console.groupEnd();
  }
  
  if (accessToken) {
    const decodedAccess = decodeJWT(accessToken);
    console.group('🔑 Access Token Details');
    console.log('Raw Token (first 50 chars):', accessToken.substring(0, 50) + '...');
    console.log('Decoded Payload:', decodedAccess);
    console.log('Issuer (iss):', decodedAccess?.iss);
    console.log('Audience (aud):', decodedAccess?.aud);
    console.log('Client ID:', decodedAccess?.client_id);
    console.log('Token Use:', decodedAccess?.token_use);
    console.log('Expires At:', decodedAccess?.exp ? new Date(decodedAccess.exp * 1000).toISOString() : 'N/A');
    console.groupEnd();
  }
  
  console.group('🌍 Environment Details');
  console.log('Current URL:', window.location.href);
  console.log('Environment:', import.meta.env.MODE);
  console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
  console.log('App URL:', import.meta.env.VITE_APP_URL);
  console.log('Cognito Domain:', import.meta.env.VITE_COGNITO_DOMAIN);
  console.log('User Pool ID:', import.meta.env.VITE_COGNITO_USER_POOL_ID);
  console.log('Client ID:', import.meta.env.VITE_COGNITO_CLIENT_ID);
  console.groupEnd();
  
  console.groupEnd();
  
  return {
    idToken: idToken ? decodeJWT(idToken) : null,
    accessToken: accessToken ? decodeJWT(accessToken) : null,
    environment: {
      mode: import.meta.env.MODE,
      apiUrl: import.meta.env.VITE_API_BASE_URL,
      appUrl: import.meta.env.VITE_APP_URL,
      cognitoDomain: import.meta.env.VITE_COGNITO_DOMAIN,
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      clientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
    }
  };
};

// Enhanced API call debugging
export const debugApiCall = async (url: string, options: RequestInit = {}) => {
  const idToken = getIdToken();
  
  console.group(`🌐 API Call Debug: ${url}`);
  console.log('Full URL:', url);
  console.log('Request Options:', options);
  
  // Safely extract Authorization header
  let authHeader = 'Not set';
  if (options.headers) {
    if (options.headers instanceof Headers) {
      authHeader = options.headers.get('Authorization') || 'Not set';
    } else if (typeof options.headers === 'object') {
      authHeader = (options.headers as Record<string, string>)['Authorization'] || 'Not set';
    }
  }
  console.log('Authorization Header:', authHeader);
  console.log('ID Token (first 50 chars):', idToken ? idToken.substring(0, 50) + '...' : 'Not found');
  
  try {
    const response = await fetch(url, options);
    console.log('Response Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Response Body:', responseText);
    
    console.groupEnd();
    
    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseText
    };
  } catch (error) {
    console.error('API Call Error:', error);
    console.groupEnd();
    throw error;
  }
};
