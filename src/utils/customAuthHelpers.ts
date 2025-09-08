import { signIn as amplifySignIn, signUp as amplifySignUp, confirmSignUp as amplifyConfirmSignUp } from 'aws-amplify/auth';
import { generateSecretHash, getCognitoConfig } from './cognitoHelpers';

// Custom auth wrappers that properly handle SECRET_HASH for clients with secrets

export const customSignIn = async (params: { username: string; password: string }) => {
  const cognitoConfig = getCognitoConfig();
  
  if (cognitoConfig.hasClientSecret && cognitoConfig.clientSecret) {
    const secretHash = generateSecretHash(
      params.username,
      cognitoConfig.clientId,
      cognitoConfig.clientSecret
    );
    
    // Pass SECRET_HASH in clientMetadata for Amplify v6
    return amplifySignIn({
      username: params.username,
      password: params.password,
      options: {
        clientMetadata: {
          SECRET_HASH: secretHash
        }
      }
    });
  }
  
  // For clients without secret, use regular Amplify signIn
  return amplifySignIn(params);
};

export const customSignUp = async (params: {
  username: string;
  password: string;
  options: {
    userAttributes: {
      email: string;
      given_name: string;
      family_name: string;
    };
  };
}) => {
  const cognitoConfig = getCognitoConfig();
  
  if (cognitoConfig.hasClientSecret && cognitoConfig.clientSecret) {
    const secretHash = generateSecretHash(
      params.username,
      cognitoConfig.clientId,
      cognitoConfig.clientSecret
    );
    
    return amplifySignUp({
      username: params.username,
      password: params.password,
      options: {
        userAttributes: params.options.userAttributes,
        clientMetadata: {
          SECRET_HASH: secretHash
        }
      }
    });
  }
  
  // For clients without secret, use regular Amplify signUp
  return amplifySignUp(params);
};

export const customConfirmSignUp = async (params: {
  username: string;
  confirmationCode: string;
}) => {
  const cognitoConfig = getCognitoConfig();
  
  if (cognitoConfig.hasClientSecret && cognitoConfig.clientSecret) {
    const secretHash = generateSecretHash(
      params.username,
      cognitoConfig.clientId,
      cognitoConfig.clientSecret
    );
    
    return amplifyConfirmSignUp({
      username: params.username,
      confirmationCode: params.confirmationCode,
      options: {
        clientMetadata: {
          SECRET_HASH: secretHash
        }
      }
    });
  }
  
  // For clients without secret, use regular Amplify confirmSignUp
  return amplifyConfirmSignUp(params);
};
