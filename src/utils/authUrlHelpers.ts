/**
 * Auth URL Helper functions to generate Cognito Hosted UI URLs
 */

interface CognitoConfig {
  domain: string;
  clientId: string;
  redirectUri: string;
  logoutUri: string;
}

export const getCognitoUrls = (): CognitoConfig => {
  const domain = import.meta.env.VITE_COGNITO_DOMAIN;
  const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
  const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
  
  return {
    domain,
    clientId,
    redirectUri: `${appUrl}/auth-redirect-handler`,
    logoutUri: `${appUrl}/`
  };
};

export const generateSignInUrl = (): string => {
  const { domain, clientId, redirectUri } = getCognitoUrls();
  
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'token',
    scope: 'openid',
    redirect_uri: redirectUri,
  });
  
  return `https://${domain}/login?${params.toString()}`;
};

export const generateSignUpUrl = (): string => {
  const { domain, clientId, redirectUri } = getCognitoUrls();
  
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'token',
    scope: 'openid',
    redirect_uri: redirectUri,
  });
  
  return `https://${domain}/signup?${params.toString()}`;
};

export const generateLogoutUrl = (): string => {
  const { domain, clientId, logoutUri } = getCognitoUrls();
  
  const params = new URLSearchParams({
    client_id: clientId,
    logout_uri: logoutUri,
  });
  
  return `https://${domain}/logout?${params.toString()}`;
};

export const redirectToHostedUI = (type: 'signin' | 'signup' = 'signin') => {
  const url = type === 'signin' ? generateSignInUrl() : generateSignUpUrl();
  window.location.href = url;
};
