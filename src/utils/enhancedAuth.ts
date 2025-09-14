import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import { getIdToken, setAuthTokens } from './authStorage';

/**
 * Enhanced token retrieval with fallback mechanisms
 */
export const getValidToken = async (): Promise<string | null> => {
  try {
    // First try to get token from local storage
    const idToken = getIdToken();
    
    if (idToken) {
      // Verify token is not expired
      try {
        const payload = JSON.parse(atob(idToken.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (payload.exp && payload.exp > currentTime) {
          console.log('✅ Using cached ID token');
          return idToken;
        } else {
          console.warn('⚠️ Cached token is expired, fetching fresh token');
        }
      } catch {
        console.warn('⚠️ Could not parse cached token, fetching fresh token');
      }
    }
    
    // Try to get fresh token from Amplify
    try {
      const session = await fetchAuthSession();
      const freshIdToken = session.tokens?.idToken?.toString();
      const freshAccessToken = session.tokens?.accessToken?.toString();
      
      if (freshIdToken && freshAccessToken) {
        console.log('✅ Retrieved fresh tokens from Amplify');
        setAuthTokens(freshIdToken, freshAccessToken);
        return freshIdToken;
      }
    } catch (amplifyError) {
      console.warn('⚠️ Could not fetch fresh tokens from Amplify:', amplifyError);
    }
    
    // Final fallback - check if user is authenticated
    try {
      await getCurrentUser();
      console.log('✅ User is authenticated but no tokens available');
      // User is authenticated but we don't have tokens - might need re-login
      return null;
    } catch (userError) {
      console.warn('⚠️ User is not authenticated:', userError);
      return null;
    }
    
  } catch (error) {
    console.error('❌ Error in getValidToken:', error);
    return null;
  }
};

/**
 * Enhanced API request wrapper with token refresh
 */
export const makeAuthenticatedRequest = async (
  url: string, 
  options: RequestInit = {}
): Promise<Response> => {
  const idToken = await getValidToken();
  
  if (!idToken) {
    throw new Error('No valid authentication token available');
  }
  
  const requestOptions: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      'Authorization': `Bearer ${idToken}`,
    },
  };
  
  console.log(`🌐 Making authenticated request to: ${url}`);
  
  const response = await fetch(url, requestOptions);
  
  if (response.status === 401) {
    console.warn('⚠️ Received 401, attempting token refresh...');
    
    // Try to get a fresh token
    const freshToken = await getValidToken();
    if (freshToken && freshToken !== idToken) {
      console.log('🔄 Retrying with fresh token');
      
      const retryOptions: RequestInit = {
        ...requestOptions,
        headers: {
          ...requestOptions.headers,
          'Authorization': `Bearer ${freshToken}`,
        },
      };
      
      return fetch(url, retryOptions);
    }
  }
  
  return response;
};
