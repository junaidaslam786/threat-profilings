import React, { useState } from "react";
import { type SignInOutput } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import InputField from "../Common/InputField";
import Button from "../Common/Button";
import { redirectToForgotPassword } from "../../utils/authHelpers";
import {
  customSignIn,
  customConfirmSignIn,
} from "../../utils/customAuthHelpers";

interface CustomSignInProps {
  onSwitchToSignUp: () => void;
  onSignInSuccess?: () => void;
  onMFAStep?: (step: 'mfa' | 'mfaSetup') => void;
}

const CustomSignIn: React.FC<CustomSignInProps> = ({
  onSwitchToSignUp,
  onSignInSuccess,
  onMFAStep,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    mfaCode: "",
  });
  const [step, setStep] = useState<"signIn" | "mfa" | "mfaSetup">("signIn");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const getStepDescription = () => {
    return "Enter the 6-digit code from your authenticator app";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Special handling for MFA code - only allow 6 digits
    if (name === "mfaCode") {
      const numericValue = value.replace(/\D/g, "").slice(0, 6);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { isSignedIn, nextStep }: SignInOutput = await customSignIn({
        username: formData.email,
        password: formData.password,
      });

      if (isSignedIn) {
        onSignInSuccess?.();
        navigate("/auth-redirect-handler");
      } else if (
        nextStep.signInStep === "CONTINUE_SIGN_IN_WITH_MFA_SELECTION"
      ) {
        const session = sessionStorage.getItem("currentAuthSession");
        if (session) {
          const authSession = JSON.parse(session);
          sessionStorage.setItem("mfaSetupSession", authSession.session);
        }
        onMFAStep?.('mfaSetup');
      } else if (nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_TOTP_CODE") {
        onMFAStep?.('mfa');
      } else {
        toast.error(
          "An unexpected authentication challenge occurred. Please contact support."
        );
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Sign in error:", error);
      toast.error(error.message || "Sign in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { isSignedIn } = await customConfirmSignIn({
        challengeResponse: formData.mfaCode,
      });

      if (isSignedIn) {
        onSignInSuccess?.();
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
        setStep("signIn");
        setFormData((prev) => ({ ...prev, mfaCode: "" }));
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

  if (isLoading) {
    return (
      <div className="text-center flex flex-col items-center py-8">
        <div className="relative mb-6">
          <div className="w-8 h-8 border-4 border-primary-600/30 border-t-primary-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-8 h-8 border-4 border-transparent border-t-primary-300/50 rounded-full animate-spin animation-delay-75"></div>
        </div>
        <p className="text-primary-300 font-medium">
          {step === "mfa" ? "Verifying your code..." : "Signing you in..."}
        </p>
        <p className="text-secondary-400 text-xs mt-2">Please wait</p>
      </div>
    );
  }

  // If we're in MFA verification step, show the MFA form
  if (step === "mfa") {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Multi-Factor Authentication
          </h2>
          <p className="text-gray-200">
            {getStepDescription()}
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
            value={formData.mfaCode}
            onChange={handleInputChange}
            placeholder="Enter 6-digit code from authenticator app"
            required
            className="bg-white/10 border-white/30 text-white placeholder-gray-300"
          />

          <div className="flex space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setStep("signIn")}
              className="flex-1 bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all duration-200"
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <>
      {step === "signIn" ? (
        <form onSubmit={handleSignIn} className="space-y-6">
          <InputField
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            required
            className="bg-white/10 border-white/30 text-white placeholder-gray-300"
          />

          <div className="relative">
            <InputField
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
              className="bg-white/10 border-white/30 text-white placeholder-gray-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-300 hover:text-white transition-colors"
            >
              {showPassword ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      ) : null}

      {step === "signIn" && (
        <div className="mt-8 text-center space-y-4">
          <button
            type="button"
            className="text-primary-300 hover:text-primary-200 transition-colors underline"
            onClick={redirectToForgotPassword}
          >
            Forgot your password?
          </button>

          <div className="text-gray-300">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="text-primary-300 hover:text-primary-200 transition-colors font-semibold"
            >
              Sign up here
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomSignIn;
