import React, { useState } from "react";
import InputField from "../../components/Common/InputField";
import Button from "../../components/Common/Button";
import AuthLayout from "../../components/Common/AuthLayout";
import { useLoginMutation } from "../../Redux/api/authApi";
import { useDispatch } from "react-redux";
import { setAccessToken } from "../../Redux/slices/authSlice";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

const SignIn: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const handleSignIn = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      }).unwrap();

      console.log("Login successful:", result);
      dispatch(setAccessToken(result.access_token));
      toast.success("Signed in successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Failed to sign in:", error);
      let errorMessage = "An unexpected error occurred during sign in.";
      if (error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
        errorMessage = (error.data as { message: string }).message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  return (
    <AuthLayout title="Sign In">
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
      <Button onClick={handleSignIn} disabled={isLoginLoading}>
        {isLoginLoading ? "Signing In..." : "Sign In"}
      </Button>
      <p className="text-center text-gray-400 text-sm mt-4">
        Don't have an account?{" "}
        <button
          className="text-blue-500 hover:underline"
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </button>
      </p>
      <p className="text-center text-gray-400 text-sm mt-2">
        <button
          className="text-blue-500 hover:underline"
          onClick={() => navigate("/admin/login")}
        >
          Admin Login
        </button>
      </p>
    </AuthLayout>
  );
};

export default SignIn;