import React, { useState } from "react";
import InputField from "../../components/Common/InputField";
import Button from "../../components/Common/Button";
import AuthLayout from "../../components/Common/AuthLayout";
import { useRegisterUserMutation } from "../../Redux/api/userOrganizationApi"; 
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

const CreateOrganization: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", name: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [registerUser, { isLoading: isRegisterLoading }] = useRegisterUserMutation();
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

  const isBusinessEmail = (email: string) => {
    const freeEmailDomains = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
      "aol.com",
    ];
    const domain = email.split("@")[1];
    return domain && !freeEmailDomains.includes(domain.toLowerCase());
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!isBusinessEmail(formData.email)) {
      newErrors.email = "Please use a business email address.";
    }
    if (!formData.name.trim()) {
      newErrors.name = "Organization Name is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateOrganization = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    try {
      const result = await registerUser({
        email: formData.email,
        name: formData.name,
      }).unwrap();

      console.log("Organization registration successful:", result);
      toast.success("Organization created successfully! Please sign in.");
      navigate("/login");
    } catch (error: unknown) {
      console.error("Failed to create organization:", error);
      let errorMessage = "An unexpected error occurred during organization creation.";
      if (error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
        errorMessage = (error.data as { message: string }).message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  return (
    <AuthLayout title="Create Your Organization">
      <InputField
        label="Business Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="your.company@example.com"
        error={errors.email}
      />
      <InputField
        label="Organization Name"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Your Company Name"
        error={errors.name}
      />
      <Button onClick={handleCreateOrganization} disabled={isRegisterLoading}>
        {isRegisterLoading ? "Creating Organization..." : "Create Organization"}
      </Button>
      {/* <p className="text-center text-gray-400 text-sm mt-4">
        Already have an organization?{" "}
        <button
          className="text-blue-500 hover:underline"
          onClick={() => navigate("/login")}
        >
          Sign In
        </button>
      </p> */}
    </AuthLayout>
  );
};

export default CreateOrganization;
