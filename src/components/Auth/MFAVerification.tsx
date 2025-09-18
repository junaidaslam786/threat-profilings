import React, { useState } from 'react';
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import InputField from "../Common/InputField";
import Button from "../Common/Button";
import { isValidTotpCode } from '../../utils/totpHelpers';
import { customConfirmSignIn } from "../../utils/customAuthHelpers";

interface MFAVerificationProps {
  onBack: () => void;
  onSuccess: () => void;
}

const MFAVerification: React.FC<MFAVerificationProps> = ({ onBack, onSuccess }) => {
  const [mfaCode, setMfaCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, "").slice(0, 6);
    setMfaCode(numericValue);
  };

  const handleConfirmSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!isValidTotpCode(mfaCode)) {
        throw new Error('Please enter a valid 6-digit code');
      }

      const { isSignedIn } = await customConfirmSignIn({
        challengeResponse: mfaCode,
      });

      if (isSignedIn) {
        onSuccess();
        navigate("/auth-redirect-handler");
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error("MFA confirmation error:", error);

      if (
        error.message?.includes("signIn was not called") ||
        error.message?.includes("Invalid session") ||
        error.message?.includes("session has expired")
      ) {
        toast.error("Your session has expired. Please sign in again to continue.");
        onBack();
      } else if (
        error.message?.includes("Code mismatch") ||
        error.message?.includes("Invalid verification code")
      ) {
        toast.error(
          "Invalid authenticator code. Please check your authenticator app and try again."
        );
      } else if (error.message?.includes("CodeExpired")) {
        toast.error(
          "The code has expired. Please try a new code from your authenticator app."
        );
      } else {
        toast.error(
          error.message ||
            "Invalid authenticator code. Please check your authenticator app and try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-2xl border border-white/20 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Multi-Factor Authentication
          </h1>
          <p className="text-gray-200">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        <form onSubmit={handleConfirmSignIn} className="space-y-6">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600/20 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-primary-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-gray-300 text-sm">
              Open your authenticator app (Google Authenticator, Authy, etc.)
              and enter the current 6-digit code for your account.
            </p>
            <p className="text-gray-400 text-xs mt-2">
              The code refreshes every 30 seconds
            </p>
          </div>

          <InputField
            label="Authenticator Code"
            type="text"
            name="mfaCode"
            value={mfaCode}
            onChange={handleInputChange}
            placeholder="Enter 6-digit code from authenticator app"
            required
            className="bg-white/10 border-white/30 text-white placeholder-gray-300 text-center text-lg font-mono"
          />

          <div className="flex space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onBack}
              className="flex-1 bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all duration-200"
            >
              Back to Sign In
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
              disabled={isLoading || mfaCode.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MFAVerification;