import { signIn as amplifySignIn, signUp as amplifySignUp, confirmSignUp as amplifyConfirmSignUp, type SignInOutput, type SignUpOutput, type ConfirmSignUpOutput } from 'aws-amplify/auth';
import { CognitoIdentityProviderClient, InitiateAuthCommand, SignUpCommand, ConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import { generateSecretHash, getCognitoConfig } from './cognitoHelpers';

// Create a Cognito client - no credentials needed for public operations
const cognitoClient = new CognitoIdentityProviderClient({
  region: 'eu-north-1',
  credentials: undefined, // Use unsigned requests for public operations like signIn/signUp
});

// Custom auth wrappers that properly handle SECRET_HASH for clients with secrets

export const customSignIn = async (params: { username: string; password: string }): Promise<SignInOutput> => {
  const cognitoConfig = getCognitoConfig();
  
  if (cognitoConfig.hasClientSecret && cognitoConfig.clientSecret) {
    const secretHash = generateSecretHash(
      params.username,
      cognitoConfig.clientId,
      cognitoConfig.clientSecret
    );
    
    try {
      // First try USER_PASSWORD_AUTH as it's simpler
      const passwordAuthCommand = new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: cognitoConfig.clientId,
        AuthParameters: {
          USERNAME: params.username,
          PASSWORD: params.password,
          SECRET_HASH: secretHash,
        },
      });
      
      const response = await cognitoClient.send(passwordAuthCommand);
      
      // Convert AWS SDK response to Amplify-like format
      if (response.AuthenticationResult) {
        // Store tokens for later use
        if (response.AuthenticationResult.AccessToken && response.AuthenticationResult.IdToken) {
          // You can use cookie helpers or localStorage to store these
          document.cookie = `access_token=${response.AuthenticationResult.AccessToken}; path=/`;
          document.cookie = `id_token=${response.AuthenticationResult.IdToken}; path=/`;
          if (response.AuthenticationResult.RefreshToken) {
            document.cookie = `refresh_token=${response.AuthenticationResult.RefreshToken}; path=/`;
          }
        }
        
        return {
          isSignedIn: true,
          nextStep: {
            signInStep: 'DONE'
          }
        };
      } else if (response.ChallengeName) {
        return {
          isSignedIn: false,
          nextStep: {
            signInStep: response.ChallengeName === 'NEW_PASSWORD_REQUIRED' 
              ? 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED' 
              : 'CONFIRM_SIGN_IN_WITH_SMS_CODE'
          }
        };
      }
      
      // Fallback to standard response
      return {
        isSignedIn: false,
        nextStep: {
          signInStep: 'CONFIRM_SIGN_IN_WITH_SMS_CODE'
        }
      };
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Custom sign in error:', err);
      
      // If USER_PASSWORD_AUTH is not enabled, fall back to regular Amplify (which uses SRP)
      if (err.message?.includes('USER_PASSWORD_AUTH') || err.message?.includes('not enabled')) {
        console.log('USER_PASSWORD_AUTH not enabled, falling back to Amplify SRP...');
        return amplifySignIn({
          username: params.username,
          password: params.password
        });
      }
      
      throw error;
    }
  }
  
  // For clients without secret, use regular Amplify signIn
  return amplifySignIn({
    username: params.username,
    password: params.password
  });
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
}): Promise<SignUpOutput> => {
  const cognitoConfig = getCognitoConfig();
  
  if (cognitoConfig.hasClientSecret && cognitoConfig.clientSecret) {
    const secretHash = generateSecretHash(
      params.username,
      cognitoConfig.clientId,
      cognitoConfig.clientSecret
    );
    
    try {
      const command = new SignUpCommand({
        ClientId: cognitoConfig.clientId,
        Username: params.username,
        Password: params.password,
        SecretHash: secretHash,
        UserAttributes: [
          { Name: 'email', Value: params.options.userAttributes.email },
          { Name: 'given_name', Value: params.options.userAttributes.given_name },
          { Name: 'family_name', Value: params.options.userAttributes.family_name },
        ],
      });
      
      const response = await cognitoClient.send(command);
      
      return {
        isSignUpComplete: false,
        userId: response.UserSub,
        nextStep: {
          signUpStep: 'CONFIRM_SIGN_UP',
          codeDeliveryDetails: {
            deliveryMedium: 'EMAIL',
            destination: params.options.userAttributes.email,
            attributeName: 'email'
          }
        }
      };
    } catch (error) {
      console.error('Custom sign up error:', error);
      throw error;
    }
  }
  
  // For clients without secret, use regular Amplify signUp
  return amplifySignUp({
    username: params.username,
    password: params.password,
    options: {
      userAttributes: params.options.userAttributes
    }
  });
};

export const customConfirmSignUp = async (params: {
  username: string;
  confirmationCode: string;
}): Promise<ConfirmSignUpOutput> => {
  const cognitoConfig = getCognitoConfig();
  
  if (cognitoConfig.hasClientSecret && cognitoConfig.clientSecret) {
    const secretHash = generateSecretHash(
      params.username,
      cognitoConfig.clientId,
      cognitoConfig.clientSecret
    );
    
    try {
      const command = new ConfirmSignUpCommand({
        ClientId: cognitoConfig.clientId,
        Username: params.username,
        ConfirmationCode: params.confirmationCode,
        SecretHash: secretHash,
      });
      
      await cognitoClient.send(command);
      
      return {
        isSignUpComplete: true,
        nextStep: {
          signUpStep: 'DONE'
        }
      };
    } catch (error) {
      console.error('Custom confirm sign up error:', error);
      throw error;
    }
  }
  
  // For clients without secret, use regular Amplify confirmSignUp
  return amplifyConfirmSignUp({
    username: params.username,
    confirmationCode: params.confirmationCode
  });
};
