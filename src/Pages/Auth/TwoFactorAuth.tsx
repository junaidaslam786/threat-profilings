import React, { useState } from "react";
import InputField from "../../components/Common/InputField";
import Button from "../../components/Common/Button";
import AuthLayout from "../../components/Common/AuthLayout";

// Mock utility function for OTP verification (replace with actual logic if needed)
const mockVerifyEmailOTP = async (email: string, otp: string) => {
  console.log(`Simulating verifying OTP: ${otp} for ${email}`);
  return new Promise<boolean>((resolve) =>
    setTimeout(() => resolve(otp === "123456"), 500)
  ); // Mock OTP
};

const TwoFactorAuth: React.FC<{ onViewChange: (view: string) => void }> = ({
  onViewChange,
}) => {
  const [otp, setOtp] = useState("");
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  // const [method, setMethod] = useState<'email' | 'app'>('email'); // For future TOTP integration

  const handleVerify = async () => {
    setGeneralError(null);
    setIsVerifying(true);
    try {
      // For Milestone 1, we only have email OTP simulation.
      const isValid = await mockVerifyEmailOTP("mock-user@example.com", otp); // Use a mock email for demonstration
      if (isValid) {
        alert("2FA verification successful! (Simulated)");
        onViewChange("dashboard"); // Proceed to dashboard
      } else {
        setGeneralError("Invalid OTP. Please try again.");
      }
    } catch (error: any) {
      setGeneralError("Error during 2FA verification. (Simulated)");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <AuthLayout title="Two-Factor Authentication">
      {generalError && (
        <p className="text-red-500 text-center mb-4">{generalError}</p>
      )}
      <p className="text-center text-gray-300 mb-4">
        Please enter the verification code sent to your email.
      </p>
      {/* Could add a toggle here for Email OTP vs Authenticator App TOTP if implemented */}
      <InputField
        label="Verification Code"
        type="text"
        name="otp"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter 6-digit code"
      />
      <Button onClick={handleVerify} disabled={isVerifying}>
        {isVerifying ? "Verifying..." : "Verify"}
      </Button>
      <p className="text-center text-gray-400 text-sm mt-4">
        <button
          onClick={() => onViewChange("signIn")}
          className="text-blue-500 hover:underline"
        >
          Return to Sign In
        </button>
      </p>
    </AuthLayout>
  );
};

export default TwoFactorAuth;
