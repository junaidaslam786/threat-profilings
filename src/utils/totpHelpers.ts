import {
  CognitoIdentityProviderClient,
  AssociateSoftwareTokenCommand,
  VerifySoftwareTokenCommand,
  SetUserMFAPreferenceCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import QRCode from "qrcode";

const cognitoClient = new CognitoIdentityProviderClient({
  region: import.meta.env.VITE_AWS_REGION || "eu-north-1",
});

export async function otpauthToDataUrl(otpauthUri: string): Promise<string> {
  return await QRCode.toDataURL(otpauthUri, {
    margin: 1,
    scale: 6,
    width: 256,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  });
}

export function buildOtpauthUri(
  secret: string,
  userEmail: string,
  issuer: string = "Threat Profiling",
  customDomain?: string
): string {
  const actualIssuer = customDomain || issuer;
  const label = `${actualIssuer}:${encodeURIComponent(userEmail)}`;

  const params = new URLSearchParams({
    secret: secret.toUpperCase(),
    issuer: actualIssuer,
    algorithm: "SHA1",
    digits: "6",
    period: "30",
  });

  return `otpauth://totp/${label}?${params.toString()}`;
}

export async function startTotpSetup(accessToken?: string, session?: string) {
  const command = new AssociateSoftwareTokenCommand({
    AccessToken: accessToken,
    Session: session,
  });

  const response = await cognitoClient.send(command);

  return {
    secretCode: response.SecretCode,
    session: response.Session,
  };
}

export async function verifyTotp(
  userCode: string,
  accessToken?: string,
  session?: string,
  friendlyDeviceName: string = "Authenticator App"
) {
  const command = new VerifySoftwareTokenCommand({
    UserCode: userCode,
    FriendlyDeviceName: friendlyDeviceName,
    AccessToken: accessToken,
    Session: session,
  });

  const response = await cognitoClient.send(command);

  return {
    status: response.Status,
    session: response.Session,
  };
}

export async function preferTotp(accessToken: string) {
  const command = new SetUserMFAPreferenceCommand({
    AccessToken: accessToken,
    SoftwareTokenMfaSettings: {
      Enabled: true,
      PreferredMfa: true,
    },
  });

  await cognitoClient.send(command);
}

export async function setupTotpFlow(
  userEmail: string,
  accessToken?: string,
  session?: string,
  customDomain?: string
) {
  try {
    const { secretCode, session: newSession } = await startTotpSetup(
      accessToken,
      session
    );

    if (!secretCode) {
      throw new Error("Failed to get TOTP secret from Cognito");
    }
    const otpauthUri = buildOtpauthUri(
      secretCode,
      userEmail,
      "Threat Profiling",
      customDomain
    );
    const qrCodeDataUrl = await otpauthToDataUrl(otpauthUri);

    return {
      secretCode,
      otpauthUri,
      qrCodeDataUrl,
      session: newSession || session,
    };
  } catch (error) {
    console.error("TOTP setup flow error:", error);
    throw error;
  }
}

/**
 * Complete TOTP verification flow
 */
export async function completeTotpSetup(
  userCode: string,
  accessToken?: string,
  session?: string
) {
  try {
    // Step 1: Verify the TOTP code
    const verifyResult = await verifyTotp(userCode, accessToken, session);

    if (verifyResult.status !== "SUCCESS") {
      throw new Error("TOTP verification failed");
    }

    // Step 2: Set TOTP as preferred MFA method (only if we have accessToken)
    if (accessToken) {
      await preferTotp(accessToken);
    }

    return {
      success: true,
      session: verifyResult.session,
    };
  } catch (error) {
    console.error("TOTP completion flow error:", error);
    throw error;
  }
}

/**
 * Validate TOTP code format
 */
export function isValidTotpCode(code: string): boolean {
  return /^\d{6}$/.test(code);
}

/**
 * Get user email from current session or token
 */
export function extractEmailFromContext(accessToken?: string): string | null {
  if (!accessToken) return null;

  try {
    // Decode JWT token to get email (this is just the payload, not validation)
    const payload = JSON.parse(atob(accessToken.split(".")[1]));
    return payload.email || payload.username || null;
  } catch (error) {
    console.error("Error extracting email from token:", error);
    return null;
  }
}
