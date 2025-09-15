import React, { useState } from "react";
import { type SignUpOutput } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import InputField from "../Common/InputField";
import Button from "../Common/Button";
import LoadingScreen from "../Common/LoadingScreen";
import {
  customSignUp,
  customConfirmSignUp,
} from "../../utils/customAuthHelpers";

interface CustomSignUpProps {
  onSwitchToSignIn: () => void;
  onSignUpSuccess?: () => void;
}

const CustomSignUp: React.FC<CustomSignUpProps> = ({
  onSwitchToSignIn,
  onSignUpSuccess,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    confirmationCode: "",
  });
  const [step, setStep] = useState<"signUp" | "confirmSignUp">("signUp");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      toast.error("All fields are required.");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return false;
    }

    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { isSignUpComplete, nextStep }: SignUpOutput = await customSignUp({
        username: formData.email,
        password: formData.password,
        options: {
          userAttributes: {
            email: formData.email
          }
        }
      });

      if (isSignUpComplete) {
        onSignUpSuccess?.();
        navigate("/dashboard");
      } else if (nextStep.signUpStep === "CONFIRM_SIGN_UP") {
        setStep("confirmSignUp");
      }
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Sign up failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { isSignUpComplete } = await customConfirmSignUp({
        username: formData.email,
        confirmationCode: formData.confirmationCode,
      });

      if (isSignUpComplete) {
        onSignUpSuccess?.();
        // After successful confirmation, redirect to sign in
        onSwitchToSignIn();
      }
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Confirmation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-2xl border border-white/20 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {step === "signUp" ? "Create Account" : "Confirm Your Email"}
          </h1>
          <p className="text-gray-200">
            {step === "signUp"
              ? "Join Threat Profiling platform"
              : `Enter the confirmation code sent to ${formData.email}`}
          </p>
        </div>

        {step === "signUp" ? (
          <form onSubmit={handleSignUp} className="space-y-6">
            <InputField
              label="Email Address"
              type="text"
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
                placeholder="Create a password"
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

            <div className="relative">
              <InputField
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                required
                className="bg-white/10 border-white/30 text-white placeholder-gray-300"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-gray-300 hover:text-white transition-colors"
              >
                {showConfirmPassword ? (
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

            <div className="text-xs text-gray-300">
              By creating an account, you agree to our Terms of Service and
              Privacy Policy.
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleConfirmSignUp} className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-gray-300 text-sm mb-4">
                We've sent a confirmation code to your email address. Please
                enter it below to complete your registration.
              </div>
            </div>

            <InputField
              label="Confirmation Code"
              type="text"
              name="confirmationCode"
              value={formData.confirmationCode}
              onChange={handleInputChange}
              placeholder="Enter 6-digit code"
              required
              className="bg-white/10 border-white/30 text-white placeholder-gray-300"
            />

            <div className="flex space-x-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep("signUp")}
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
                {isLoading ? "Confirming..." : "Confirm Email"}
              </Button>
            </div>

            <div className="text-center">
              <button
                type="button"
                className="text-primary-300 hover:text-primary-200 transition-colors underline text-sm"
                onClick={() => {
                  /* TODO: Implement resend code */
                }}
              >
                Didn't receive the code? Resend
              </button>
            </div>
          </form>
        )}

        {step === "signUp" && (
          <div className="mt-8 text-center">
            <div className="text-gray-300">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToSignIn}
                className="text-primary-300 hover:text-primary-200 transition-colors font-semibold"
              >
                Sign in here
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSignUp;
