import React, { useEffect, useState } from "react";
import InputField from "../../components/Common/InputField";
import Button from "../../components/Common/Button";
import AuthLayout from "../../components/Common/AuthLayout";
import { useRegisterMutation } from "../../Redux/api/authApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    organizationName: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const [register, { isLoading: isRegisterLoading, error: registerError }] =
    useRegisterMutation();

  useEffect(() => {
    if (registerError) {
      if (
        "data" in registerError &&
        registerError.data &&
        typeof registerError.data === "object" &&
        "message" in registerError.data
      ) {
        toast.error((registerError.data as { message: string }).message);
      } else {
        toast.error("An unexpected error occurred during registration.");
      }
    }
  }, [registerError]);

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
    if (!validateForm()) {
      toast.error("Please correct the errors in the form.");
      return;
    }

    try {
      const username = formData.email.split("@")[0];

      const result = await register({
        email: formData.email,
        username: username,
        password: formData.password,
      }).unwrap();

      console.log("Registration successful:", result);
      toast.success("Registration successful! You can now sign in.");
      navigate("/signin");
    } catch (error: any) {
      console.error("Failed to register:", error);
      toast.error("Failed to register:", error);
    }
  };

  return (
    <AuthLayout title="Sign Up">
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
        <Button onClick={handleSignUp} disabled={isRegisterLoading}>
          {isRegisterLoading ? "Registering..." : "Sign Up"}
        </Button>
        <p className="text-center text-gray-400 text-sm mt-4">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/signin")}
            className="text-blue-500 hover:underline"
          >
            Sign In
          </button>
        </p>
      </>
    </AuthLayout>
  );
};

export default SignUp;
