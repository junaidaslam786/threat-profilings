import {
  signIn as amplifySignIn,
  signUp as amplifySignUp,
  confirmSignUp as amplifyConfirmSignUp,
  confirmSignIn as amplifyConfirmSignIn,
  type SignInOutput,
  type SignUpOutput,
  type ConfirmSignUpOutput,
  type ConfirmSignInOutput,
} from "aws-amplify/auth";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  RespondToAuthChallengeCommand,
  AssociateSoftwareTokenCommand,
  VerifySoftwareTokenCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { generateSecretHash, getCognitoConfig } from "./cognitoHelpers";
import { setAuthTokens } from "./authStorage";

const cognitoClient = new CognitoIdentityProviderClient({
  region: "eu-north-1",
  credentials: undefined,
});
let currentAuthSession: {
  session?: string;
  challengeName?: string;
  challengeParameters?: Record<string, string>;
  username?: string;
} | null = null;

export const customSignIn = async (params: {
  username: string;
  password: string;
}): Promise<SignInOutput> => {
  const cognitoConfig = getCognitoConfig();

  if (cognitoConfig.hasClientSecret && cognitoConfig.clientSecret) {
    return await customSignInWithSecret(params);
  }

  try {
    const result = await amplifySignIn({
      username: params.username,
      password: params.password,
    });
    return result;
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Amplify sign in error:", err);
    throw error;
  }
};

const customSignInWithSecret = async (params: {
  username: string;
  password: string;
}): Promise<SignInOutput> => {
  const cognitoConfig = getCognitoConfig();
  const secretHash = generateSecretHash(
    params.username,
    cognitoConfig.clientId,
    cognitoConfig.clientSecret!
  );

  try {
    const passwordAuthCommand = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: cognitoConfig.clientId,
      AuthParameters: {
        USERNAME: params.username,
        PASSWORD: params.password,
        SECRET_HASH: secretHash,
      },
    });

    const response = await cognitoClient.send(passwordAuthCommand);
    if (response.AuthenticationResult) {
      if (
        response.AuthenticationResult.AccessToken &&
        response.AuthenticationResult.IdToken
      ) {
        setAuthTokens(
          response.AuthenticationResult.IdToken,
          response.AuthenticationResult.AccessToken
        );
      }

      return {
        isSignedIn: true,
        nextStep: {
          signInStep: "DONE",
        },
      };
    } else if (response.ChallengeName) {
      currentAuthSession = {
        session: response.Session,
        challengeName: response.ChallengeName,
        challengeParameters: response.ChallengeParameters || {},
        username: params.username,
      };

      sessionStorage.setItem(
        "currentAuthSession",
        JSON.stringify(currentAuthSession)
      );
      let signInStep = "CONFIRM_SIGN_IN_WITH_TOTP_CODE";

      switch (response.ChallengeName) {
        case "NEW_PASSWORD_REQUIRED":
          signInStep = "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED";
          break;
        case "MFA_SETUP":
        case "SELECT_MFA_TYPE":
          signInStep = "CONTINUE_SIGN_IN_WITH_MFA_SELECTION";
          break;
        case "SOFTWARE_TOKEN_MFA":
          signInStep = "CONFIRM_SIGN_IN_WITH_TOTP_CODE";
          break;
        case "SMS_MFA":
          signInStep = "CONFIRM_SIGN_IN_WITH_SMS_CODE";
          break;
        case "EMAIL_OTP":
          signInStep = "CONFIRM_SIGN_IN_WITH_EMAIL_CODE";
          break;
        default:
          console.warn(`Unknown challenge type: ${response.ChallengeName}`);
          signInStep = "CONFIRM_SIGN_IN_WITH_TOTP_CODE";
      }

      return {
        isSignedIn: false,
        nextStep: {
          signInStep: signInStep as
            | "CONFIRM_SIGN_IN_WITH_TOTP_CODE"
            | "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
            | "CONFIRM_SIGN_IN_WITH_SMS_CODE"
            | "CONFIRM_SIGN_IN_WITH_EMAIL_CODE"
            | "CONTINUE_SIGN_IN_WITH_MFA_SELECTION",
        },
      };
    }
    return {
      isSignedIn: false,
      nextStep: {
        signInStep: "CONFIRM_SIGN_IN_WITH_TOTP_CODE",
      },
    };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Custom sign in with secret error:", err);
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
    const uniqueUsername = params.username; // Use full email as username

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
            Name: "email",
            Value: params.options.userAttributes.email,
          },
          {
            Name: "name",
            Value: params.options.userAttributes.email.split("@")[0],
          },
        ],
      });

      const response = await cognitoClient.send(command);

      return {
        isSignUpComplete: false,
        userId: response.UserSub,
        nextStep: {
          signUpStep: "CONFIRM_SIGN_UP",
          codeDeliveryDetails: {
            deliveryMedium: "EMAIL",
            destination: params.options.userAttributes.email,
            attributeName: "email",
          },
        },
      };
    } catch (error) {
      console.error("Custom sign up error:", error);
      throw error;
    }
  }

  return amplifySignUp({
    username: params.username,
    password: params.password,
    options: {
      userAttributes: params.options.userAttributes,
    },
  });
};

const emailToUsernameMap: { [email: string]: string } = {};

export const customConfirmSignUp = async (params: {
  username: string;
  confirmationCode: string;
}): Promise<ConfirmSignUpOutput> => {
  const cognitoConfig = getCognitoConfig();

  if (cognitoConfig.hasClientSecret && cognitoConfig.clientSecret) {
    // For new signups, username equals email (no longer extracting part before @)
    const actualUsername =
      emailToUsernameMap[params.username] || params.username;

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

      delete emailToUsernameMap[params.username];

      return {
        isSignUpComplete: true,
        nextStep: {
          signUpStep: "DONE",
        },
      };
    } catch (error) {
      console.error("Custom confirm sign up error:", error);
      throw error;
    }
  }

  return amplifyConfirmSignUp({
    username: params.username,
    confirmationCode: params.confirmationCode,
  });
};

export const customConfirmSignIn = async (params: {
  challengeResponse: string;
}): Promise<ConfirmSignInOutput> => {
  const cognitoConfig = getCognitoConfig();

  if (
    cognitoConfig.clientSecret &&
    currentAuthSession &&
    currentAuthSession.username
  ) {
    const secretHash = generateSecretHash(
      currentAuthSession.username,
      cognitoConfig.clientId,
      cognitoConfig.clientSecret
    );

    try {
      const command = new RespondToAuthChallengeCommand({
        ClientId: cognitoConfig.clientId,
        ChallengeName: currentAuthSession.challengeName as
          | "SOFTWARE_TOKEN_MFA"
          | "SMS_MFA"
          | "NEW_PASSWORD_REQUIRED",
        Session: currentAuthSession.session,
        ChallengeResponses: {
          SOFTWARE_TOKEN_MFA_CODE: params.challengeResponse,
          USERNAME: currentAuthSession.username,
          SECRET_HASH: secretHash,
        },
      });

      const response = await cognitoClient.send(command);

      if (response.AuthenticationResult) {
        if (
          response.AuthenticationResult.AccessToken &&
          response.AuthenticationResult.IdToken
        ) {
          setAuthTokens(
            response.AuthenticationResult.IdToken,
            response.AuthenticationResult.AccessToken
          );
        }
        currentAuthSession = null;

        return {
          isSignedIn: true,
          nextStep: {
            signInStep: "DONE",
          },
        };
      } else if (response.ChallengeName) {
        // Update session for next challenge
        currentAuthSession = {
          ...currentAuthSession,
          session: response.Session,
          challengeName: response.ChallengeName,
          challengeParameters: response.ChallengeParameters || {},
        };

        return {
          isSignedIn: false,
          nextStep: {
            signInStep: "CONFIRM_SIGN_IN_WITH_TOTP_CODE",
          },
        };
      }

      throw new Error("Unexpected response from confirm sign-in");
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Custom confirm sign-in error:", err);
      throw error;
    }
  } else {
    // Fall back to Amplify's confirmSignIn
    return await amplifyConfirmSignIn({
      challengeResponse: params.challengeResponse,
    });
  }
};

// Handle MFA setup using the challenge session
export const handleMFASetupChallenge = async () => {
  if (!currentAuthSession || !currentAuthSession.session) {
    throw new Error("No active MFA setup session");
  }

  try {
    // Use AssociateSoftwareToken with the session from the challenge
    const associateCommand = new AssociateSoftwareTokenCommand({
      Session: currentAuthSession.session,
    });

    const response = await cognitoClient.send(associateCommand);

    // Update the session if it changed
    if (response.Session) {
      currentAuthSession.session = response.Session;
      sessionStorage.setItem(
        "currentAuthSession",
        JSON.stringify(currentAuthSession)
      );
    }

    return {
      secretCode: response.SecretCode,
      session: response.Session || currentAuthSession.session,
    };
  } catch (error) {
    console.error("MFA setup challenge error:", error);
    throw error;
  }
};

// Complete MFA setup and continue with sign-in
export const completeMFASetupChallenge = async (verificationCode: string) => {
  if (
    !currentAuthSession ||
    !currentAuthSession.session ||
    !currentAuthSession.username
  ) {
    throw new Error("No active MFA setup session");
  }

  const cognitoConfig = getCognitoConfig();

  try {
    // First verify the software token
    const verifyCommand = new VerifySoftwareTokenCommand({
      Session: currentAuthSession.session,
      UserCode: verificationCode,
    });

    const verifyResponse = await cognitoClient.send(verifyCommand);

    if (verifyResponse.Status !== "SUCCESS") {
      throw new Error("TOTP verification failed");
    }

    // Update session
    const newSession = verifyResponse.Session || currentAuthSession.session;

    // Now respond to the MFA_SETUP challenge with SOFTWARE_TOKEN_MFA
    const secretHash = cognitoConfig.clientSecret
      ? generateSecretHash(
          currentAuthSession.username,
          cognitoConfig.clientId,
          cognitoConfig.clientSecret
        )
      : undefined;

    const challengeResponses: Record<string, string> = {
      USERNAME: currentAuthSession.username,
    };

    if (secretHash) {
      challengeResponses.SECRET_HASH = secretHash;
    }

    const respondCommand = new RespondToAuthChallengeCommand({
      ClientId: cognitoConfig.clientId,
      ChallengeName: "MFA_SETUP",
      Session: newSession,
      ChallengeResponses: challengeResponses,
    });

    const response = await cognitoClient.send(respondCommand);

    if (response.AuthenticationResult) {
      // Store tokens
      if (
        response.AuthenticationResult.AccessToken &&
        response.AuthenticationResult.IdToken
      ) {
        setAuthTokens(
          response.AuthenticationResult.IdToken,
          response.AuthenticationResult.AccessToken
        );
      }

      // Clear the stored session
      currentAuthSession = null;
      sessionStorage.removeItem("currentAuthSession");
      sessionStorage.removeItem("mfaSetupSession");

      return {
        isSignedIn: true,
        tokens: {
          idToken: response.AuthenticationResult.IdToken,
          accessToken: response.AuthenticationResult.AccessToken,
          refreshToken: response.AuthenticationResult.RefreshToken,
        },
      };
    } else if (response.ChallengeName === "SOFTWARE_TOKEN_MFA") {
      // MFA is now enabled, need to verify with TOTP
      currentAuthSession.session = response.Session;
      currentAuthSession.challengeName = response.ChallengeName;
      sessionStorage.setItem(
        "currentAuthSession",
        JSON.stringify(currentAuthSession)
      );

      return {
        isSignedIn: false,
        nextChallenge: "SOFTWARE_TOKEN_MFA",
        session: response.Session,
      };
    }

    throw new Error("Unexpected response from MFA setup completion");
  } catch (error) {
    console.error("Complete MFA setup challenge error:", error);
    throw error;
  }
};
