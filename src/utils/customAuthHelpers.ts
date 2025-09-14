import { signIn as amplifySignIn, signUp as amplifySignUp, confirmSignUp as amplifyConfirmSignUp, confirmSignIn as amplifyConfirmSignIn, type SignInOutput, type SignUpOutput, type ConfirmSignUpOutput, type ConfirmSignInOutput } from 'aws-amplify/auth';
import { CognitoIdentityProviderClient, InitiateAuthCommand, SignUpCommand, ConfirmSignUpCommand, RespondToAuthChallengeCommand } from '@aws-sdk/client-cognito-identity-provider';
import { generateSecretHash, getCognitoConfig } from './cognitoHelpers';
import { setAuthTokens } from './authStorage';

// Create a Cognito client - no credentials needed for public operations
const cognitoClient = new CognitoIdentityProviderClient({
  region: 'eu-north-1',
  credentials: undefined, // Use unsigned requests for public operations like signIn/signUp
});

// Store the current session for MFA flow
let currentAuthSession: {
  session?: string;
  challengeName?: string;
  challengeParameters?: Record<string, string>;
  username?: string;
} | null = null;

// Custom auth wrappers that properly handle SECRET_HASH for clients with secrets

export const customSignIn = async (params: { username: string; password: string }): Promise<SignInOutput> => {
  console.log('CustomSignIn called with username:', params.username);
  
  const cognitoConfig = getCognitoConfig();
  
  // If we have a client secret, we need to use our custom approach throughout the entire flow
  // to ensure consistency between signIn and confirmSignIn
  if (cognitoConfig.hasClientSecret && cognitoConfig.clientSecret) {
    console.log('Using custom sign-in flow with client secret');
    return await customSignInWithSecret(params);
  }
  
  // For clients without secret, use Amplify's native flow
  try {
    console.log('Attempting Amplify signIn without client secret...');
    const result = await amplifySignIn({
      username: params.username,
      password: params.password
    });
    console.log('Amplify signIn result:', result);
    return result;
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Amplify sign in error:', err);
    throw error;
  }
};

// Separate function for custom sign-in with client secret
const customSignInWithSecret = async (params: { username: string; password: string }): Promise<SignInOutput> => {
  const cognitoConfig = getCognitoConfig();
  const secretHash = generateSecretHash(
    params.username,
    cognitoConfig.clientId,
    cognitoConfig.clientSecret!
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
    console.log('Custom sign-in response:', response);
    
    // Convert AWS SDK response to Amplify-like format
    if (response.AuthenticationResult) {
      // Store tokens for later use
      if (response.AuthenticationResult.AccessToken && response.AuthenticationResult.IdToken) {
        // Use localStorage to store these
        setAuthTokens(
          response.AuthenticationResult.IdToken,
          response.AuthenticationResult.AccessToken
        );
      }
      
      return {
        isSignedIn: true,
        nextStep: {
          signInStep: 'DONE'
        }
      };
    } else if (response.ChallengeName) {
      // Store session information for MFA continuation
      currentAuthSession = {
        session: response.Session,
        challengeName: response.ChallengeName,
        challengeParameters: response.ChallengeParameters || {},
        username: params.username
      };
      
      // Also store in sessionStorage for MFA setup component access
      sessionStorage.setItem('currentAuthSession', JSON.stringify(currentAuthSession));
      
      console.log('MFA challenge detected:', response.ChallengeName);
      console.log('Session stored for MFA:', currentAuthSession);
      
      // Map AWS SDK challenge names to Amplify format
      let signInStep = 'CONFIRM_SIGN_IN_WITH_TOTP_CODE'; // default to TOTP for MFA
      
      switch (response.ChallengeName) {
        case 'NEW_PASSWORD_REQUIRED':
          signInStep = 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED';
          break;
        case 'MFA_SETUP':
        case 'SELECT_MFA_TYPE':
          // First-time MFA setup required
          signInStep = 'CONTINUE_SIGN_IN_WITH_MFA_SELECTION';
          break;
        case 'SOFTWARE_TOKEN_MFA':
          // User already has MFA configured, just needs to enter code
          signInStep = 'CONFIRM_SIGN_IN_WITH_TOTP_CODE';
          break;
        case 'SMS_MFA':
          signInStep = 'CONFIRM_SIGN_IN_WITH_SMS_CODE';
          break;
        case 'EMAIL_OTP':
          signInStep = 'CONFIRM_SIGN_IN_WITH_EMAIL_CODE';
          break;
        default:
          console.warn(`Unknown challenge type: ${response.ChallengeName}`);
          signInStep = 'CONFIRM_SIGN_IN_WITH_TOTP_CODE';
      }
      
      return {
        isSignedIn: false,
        nextStep: {
          signInStep: signInStep as 'CONFIRM_SIGN_IN_WITH_TOTP_CODE' | 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED' | 'CONFIRM_SIGN_IN_WITH_SMS_CODE' | 'CONFIRM_SIGN_IN_WITH_EMAIL_CODE' | 'CONTINUE_SIGN_IN_WITH_MFA_SELECTION'
        }
      };
    }
    
    // Fallback to standard response for TOTP
    return {
      isSignedIn: false,
      nextStep: {
        signInStep: 'CONFIRM_SIGN_IN_WITH_TOTP_CODE'
      }
    };
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Custom sign in with secret error:', err);
    throw error;
  }
};

export const customSignUp = async (params: {
  username: string;
  password: string;
  options: {
    userAttributes: {
      email: string;
    };
  };
}): Promise<SignUpOutput> => {
  const cognitoConfig = getCognitoConfig();
  
  if (cognitoConfig.hasClientSecret && cognitoConfig.clientSecret) {
    // For email alias pools, use email prefix as username instead of full email
    const uniqueUsername = params.username.split('@')[0];
    
    // Store the mapping for confirmation step
    emailToUsernameMap[params.username] = uniqueUsername;
    
    const secretHash = generateSecretHash(
      uniqueUsername,
      cognitoConfig.clientId,
      cognitoConfig.clientSecret
    );
    
    try {
      const command = new SignUpCommand({
        ClientId: cognitoConfig.clientId,
        Username: uniqueUsername,
        Password: params.password,
        SecretHash: secretHash,
        UserAttributes: [
          {
            Name: 'email',
            Value: params.options.userAttributes.email
          },
          {
            Name: 'name',
            Value: params.options.userAttributes.email.split('@')[0]
          }
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

// Store the mapping between email and generated username
const emailToUsernameMap: { [email: string]: string } = {};

export const customConfirmSignUp = async (params: {
  username: string;
  confirmationCode: string;
}): Promise<ConfirmSignUpOutput> => {
  const cognitoConfig = getCognitoConfig();
  
  if (cognitoConfig.hasClientSecret && cognitoConfig.clientSecret) {
    // Use the stored username mapping or fallback to provided username
    const actualUsername = emailToUsernameMap[params.username] || params.username;
    
    const secretHash = generateSecretHash(
      actualUsername,
      cognitoConfig.clientId,
      cognitoConfig.clientSecret
    );
    
    try {
      const command = new ConfirmSignUpCommand({
        ClientId: cognitoConfig.clientId,
        Username: actualUsername,
        ConfirmationCode: params.confirmationCode,
        SecretHash: secretHash,
      });
      
      await cognitoClient.send(command);
      
      // Clean up the mapping after successful confirmation
      delete emailToUsernameMap[params.username];
      
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

// Custom confirm sign-in function for client secret configurations
export const customConfirmSignIn = async (params: { challengeResponse: string }): Promise<ConfirmSignInOutput> => {
  const cognitoConfig = getCognitoConfig();
  
  // Check if we have a client secret and stored session
  if (cognitoConfig.clientSecret && currentAuthSession && currentAuthSession.username) {
    const secretHash = generateSecretHash(
      currentAuthSession.username,
      cognitoConfig.clientId,
      cognitoConfig.clientSecret
    );
    
    try {
      const command = new RespondToAuthChallengeCommand({
        ClientId: cognitoConfig.clientId,
        ChallengeName: currentAuthSession.challengeName as 'SOFTWARE_TOKEN_MFA' | 'SMS_MFA' | 'NEW_PASSWORD_REQUIRED',
        Session: currentAuthSession.session,
        ChallengeResponses: {
          SOFTWARE_TOKEN_MFA_CODE: params.challengeResponse,
          USERNAME: currentAuthSession.username,
          SECRET_HASH: secretHash,
        },
      });
      
      const response = await cognitoClient.send(command);
      console.log('Custom confirm sign-in response:', response);
      
      if (response.AuthenticationResult) {
        // Store tokens
        if (response.AuthenticationResult.AccessToken && response.AuthenticationResult.IdToken) {
          setAuthTokens(
            response.AuthenticationResult.IdToken,
            response.AuthenticationResult.AccessToken
          );
        }
        
        // Clear the stored session
        currentAuthSession = null;
        
        return {
          isSignedIn: true,
          nextStep: {
            signInStep: 'DONE'
          }
        };
      } else if (response.ChallengeName) {
        // Update session for next challenge
        currentAuthSession = {
          ...currentAuthSession,
          session: response.Session,
          challengeName: response.ChallengeName,
          challengeParameters: response.ChallengeParameters || {}
        };
        
        return {
          isSignedIn: false,
          nextStep: {
            signInStep: 'CONFIRM_SIGN_IN_WITH_TOTP_CODE'
          }
        };
      }
      
      throw new Error('Unexpected response from confirm sign-in');
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Custom confirm sign-in error:', err);
      throw error;
    }
  } else {
    // Fall back to Amplify's confirmSignIn
    return await amplifyConfirmSignIn({ challengeResponse: params.challengeResponse });
  }
};
