import React, { useState } from "react";
import InputField from "../../components/Common/InputField";
import Button from "../../components/Common/Button";
import AuthLayout from "../../components/Common/AuthLayout";
import { useCreateLEOrganizationMutation } from "../../Redux/api/orgSubscriptionApi"; // Import the specific LE org creation mutation
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateLeOrganization: React.FC = () => {
  const [formData, setFormData] = useState({ orgName: "", orgDomain: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [createLEOrganization, { isLoading: isCreatingLEOrg }] =
    useCreateLEOrganizationMutation();

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

  const isValidDomain = (domain: string) => {
    const domainRegex =
      /^(?!-)[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*(?:\.[A-Za-z]{2,})$/;
    return domainRegex.test(domain.toLowerCase());
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.orgName.trim()) {
      newErrors.orgName = "Organization Name is required.";
    }
    if (!formData.orgDomain.trim()) {
      newErrors.orgDomain = "Organization Domain is required.";
    } else if (!isValidDomain(formData.orgDomain)) {
      newErrors.orgDomain = "Please enter a valid domain (e.g., example.com).";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateLEOrganization = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    try {
      const result = await createLEOrganization({
        orgName: formData.orgName,
        orgDomain: formData.orgDomain,
      }).unwrap();

      console.log("LE Organization creation successful:", result);
      toast.success("LE Organization created successfully!");
      navigate("/dashboard");
    } catch (error: unknown) {
      console.error("Failed to create LE organization:", error);
      let errorMessage =
        "An unexpected error occurred during LE organization creation.";
      if (
        error &&
        typeof error === "object" &&
        "data" in error &&
        error.data &&
        typeof error.data === "object" &&
        "message" in error.data
      ) {
        errorMessage = (error.data as { message: string }).message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  return (
    <AuthLayout title="Add New LE Organization">
      <InputField
        label="Organization Name"
        type="text"
        name="orgName"
        value={formData.orgName}
        onChange={handleChange}
        placeholder="Target Organization Name"
        error={errors.orgName}
      />
      <InputField
        label="Organization Domain"
        type="text"
        name="orgDomain"
        value={formData.orgDomain}
        onChange={handleChange}
        placeholder="target.example.com"
        error={errors.orgDomain}
      />
      <Button onClick={handleCreateLEOrganization} disabled={isCreatingLEOrg}>
        {isCreatingLEOrg ? "Adding Organization..." : "Add Organization"}
      </Button>
    </AuthLayout>
  );
};

export default CreateLeOrganization;
