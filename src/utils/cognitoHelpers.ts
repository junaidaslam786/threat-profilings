import CryptoJS from 'crypto-js';

export const generateSecretHash = (username: string, clientId: string, clientSecret: string): string => {
  const message = username + clientId;
  const hash = CryptoJS.HmacSHA256(message, clientSecret);
  return CryptoJS.enc.Base64.stringify(hash);
};

export const getCognitoConfig = () => {
  const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
  const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_COGNITO_CLIENT_SECRET;
  const domain = import.meta.env.VITE_COGNITO_DOMAIN;
  const appUrl = import.meta.env.VITE_APP_URL;

  return {
    userPoolId,
    clientId,
    clientSecret,
    domain,
    appUrl,
    hasClientSecret: !!clientSecret
  };
};
