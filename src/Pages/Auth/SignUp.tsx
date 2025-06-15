import React, { useState } from "react";
import InputField from "../../components/Common/InputField";
import Button from "../../components/Common/Button";
import AuthLayout from "../../components/Common/AuthLayout";

// Mock utility functions (replace with actual logic if needed)
const mockSendEmailOTP = async (email: string) => {
  console.log(`Simulating sending OTP to: ${email}`);
  return new Promise<void>((resolve) => setTimeout(resolve, 500));
};

const mockVerifyEmailOTP = async (email: string, otp: string) => {
  console.log(`Simulating verifying OTP: ${otp} for ${email}`);
  return new Promise<boolean>((resolve) =>
    setTimeout(() => resolve(otp === "123456"), 500)
  ); // Mock OTP
};

const mockDeriveClientName = (email: string): string => {
  const domain = email.split("@")[1];
  if (!domain) return "";
  return domain.replace(/\./g, "_").toLowerCase();
};

const SignUp: React.FC<{ onViewChange: (view: string) => void }> = ({
  onViewChange,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    organizationName: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [step, setStep] = useState(1); // 1: Registration, 2: OTP Verification
  const [otp, setOtp] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [emailForVerification, setEmailForVerification] = useState("");
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Invalid email format.";
    } else if (
      !formData.email.match(
        /^[^\s@]+@(?!gmail\.com|yahoo\.com|outlook\.com|hotmail\.com).*$/i
      )
    ) {
      newErrors.email = "Only business email domains are allowed.";
    }
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (!formData.organizationName.trim()) {
      newErrors.organizationName = "Organization Name is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    setGeneralError(null);
    if (!validateForm()) return;

    try {
      // Simulate user creation and data storage
      console.log(
        `Simulating sign up for: ${formData.email}, Org: ${formData.organizationName}`
      );
      const clientName = mockDeriveClientName(formData.email);
      console.log(`Simulated client_name derivation: ${clientName}`);

      setEmailForVerification(formData.email);
      setIsSendingOtp(true);
      await mockSendEmailOTP(formData.email); // Simulate sending OTP
      setIsSendingOtp(false);
      setStep(2); // Move to OTP verification step
    } catch (error: any) {
      setGeneralError(error.message);
    }
  };

  const handleVerifyOTP = async () => {
    setGeneralError(null);
    setIsVerifyingOtp(true);
    try {
      const isValid = await mockVerifyEmailOTP(emailForVerification, otp);
      if (isValid) {
        alert("Registration successful! Please sign in. (Simulated)");
        onViewChange("signIn");
      } else {
        setGeneralError("Invalid OTP. Please try again.");
      }
    } catch (error: any) {
      setGeneralError("Error verifying OTP. (Simulated)");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <AuthLayout title="Sign Up">
      {generalError && (
        <p className="text-red-500 text-center mb-4">{generalError}</p>
      )}
      {step === 1 && (
        <>
          <InputField
            label="Business Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@business.com"
            error={errors.email}
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
            title="Please enter a valid business email address (e.g., your@company.com)."
          />
          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="********"
            error={errors.password}
          />
          <InputField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="********"
            error={errors.confirmPassword}
          />
          <InputField
            label="Organization Name"
            type="text"
            name="organizationName"
            value={formData.organizationName}
            onChange={handleChange}
            placeholder="Your Company Inc."
            error={errors.organizationName}
          />
          <Button onClick={handleSignUp} disabled={isSendingOtp}>
            {isSendingOtp ? "Sending OTP..." : "Sign Up & Verify Email"}
          </Button>
          <p className="text-center text-gray-400 text-sm mt-4">
            Already have an account?{" "}
            <button
              onClick={() => onViewChange("signIn")}
              className="text-blue-500 hover:underline"
            >
              Sign In
            </button>
          </p>
        </>
      )}
      {step === 2 && (
        <>
          <p className="text-center text-gray-300 mb-4">
            An OTP has been sent to{" "}
            <span className="font-bold text-blue-400">
              {emailForVerification}
            </span>
            . Please enter it below.
          </p>
          <InputField
            label="Verification Code (OTP)"
            type="text"
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            // error={errors.otp} // Assuming error handling for OTP if needed
          />
          <Button onClick={handleVerifyOTP} disabled={isVerifyingOtp}>
            {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
          </Button>
        </>
      )}
    </AuthLayout>
  );
};

export default SignUp;
