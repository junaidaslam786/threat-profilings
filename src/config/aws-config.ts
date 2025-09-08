import { Amplify } from 'aws-amplify';

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      userPoolClientSecret: import.meta.env.VITE_COGNITO_CLIENT_SECRET,
      loginWith: {
        oauth: {
          domain: import.meta.env.VITE_COGNITO_DOMAIN,
          scopes: ['openid'],
          redirectSignIn: [`${import.meta.env.VITE_APP_URL}/auth-redirect-handler`],
          redirectSignOut: [`${import.meta.env.VITE_APP_URL}/`],
          responseType: 'token' as const
        },
        email: true,
        username: false
      }
    }
  }
};

Amplify.configure(amplifyConfig);

export default amplifyConfig;
