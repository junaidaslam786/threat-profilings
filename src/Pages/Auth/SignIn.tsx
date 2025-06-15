import React, { useState } from "react";
import InputField from "../../components/Common/InputField";
import Button from "../../components/Common/Button";
import AuthLayout from "../../components/Common/AuthLayout";

const SignIn: React.FC<{ onViewChange: (view: string) => void }> = ({
  onViewChange,
}) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
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
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = () => {
    setGeneralError(null);
    if (!validateForm()) return;

    // Simulate sign-in success
    console.log(
      `Sign In attempt with email: ${formData.email} and password: ${formData.password}`
    );
    alert("Sign in successful! (Simulated)");
    onViewChange("dashboard"); // Navigate to a mock dashboard or home page
  };

  return (
    <AuthLayout title="Sign In">
      {generalError && (
        <p className="text-red-500 text-center mb-4">{generalError}</p>
      )}
      <InputField
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="your@example.com"
        error={errors.email}
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
      <Button onClick={handleSignIn}>Sign In</Button>
      <p className="text-center text-gray-400 text-sm mt-4">
        Don't have an account?{" "}
        <button
          onClick={() => onViewChange("signUp")}
          className="text-blue-500 hover:underline"
        >
          Sign Up
        </button>
      </p>
      <p className="text-center text-gray-400 text-sm mt-2">
        <button
          onClick={() => onViewChange("adminLogin")}
          className="text-blue-500 hover:underline"
        >
          Admin Login
        </button>
      </p>
    </AuthLayout>
  );
};

export default SignIn;
