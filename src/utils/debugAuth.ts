// Debug function to help troubleshoot authentication issues
export const debugAuth = () => {
  const idToken = localStorage.getItem('id_token');
  const accessToken = localStorage.getItem('access_token');
  
  console.log('=== Auth Debug Info ===');
  console.log('ID Token exists:', !!idToken);
  console.log('Access Token exists:', !!accessToken);
  console.log('ID Token length:', idToken?.length || 0);
  console.log('Access Token length:', accessToken?.length || 0);
  console.log('ID Token preview:', idToken?.substring(0, 50) + '...');
  console.log('Access Token preview:', accessToken?.substring(0, 50) + '...');
  
  // Check if tokens are valid JWT format
  const isValidJWT = (token: string) => {
    try {
      const parts = token.split('.');
      return parts.length === 3;
    } catch {
      return false;
    }
  };
  
  console.log('ID Token is valid JWT:', idToken ? isValidJWT(idToken) : false);
  console.log('Access Token is valid JWT:', accessToken ? isValidJWT(accessToken) : false);
  
  return {
    hasIdToken: !!idToken,
    hasAccessToken: !!accessToken,
    idTokenValid: idToken ? isValidJWT(idToken) : false,
    accessTokenValid: accessToken ? isValidJWT(accessToken) : false
  };
};

// Add this to window for easy access in browser console
if (typeof window !== 'undefined') {
  (window as unknown as { debugAuth: typeof debugAuth }).debugAuth = debugAuth;
}