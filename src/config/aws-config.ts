import { Amplify } from 'aws-amplify';

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      // Only include userPoolClientSecret if it exists and is needed
      ...(import.meta.env.VITE_COGNITO_CLIENT_SECRET && {
        userPoolClientSecret: import.meta.env.VITE_COGNITO_CLIENT_SECRET
      }),
      loginWith: {
        oauth: {
          domain: import.meta.env.VITE_COGNITO_DOMAIN,
          scopes: ['openid', 'email', 'profile'], // Added 'email' and 'profile' scopes
          redirectSignIn: [`${import.meta.env.VITE_APP_URL}/auth-redirect-handler`],
          redirectSignOut: [`${import.meta.env.VITE_APP_URL}/`],
          responseType: 'code' as const // Changed from 'token' to 'code' for better security
        },
        email: true,
        username: false
      }
    }
  }
};

Amplify.configure(amplifyConfig);

export default amplifyConfig;
