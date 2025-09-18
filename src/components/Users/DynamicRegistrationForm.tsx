import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateUserMutation,
  useJoinOrgRequestMutation,
} from "../../Redux/api/userApi";
import type {
  DetectFlowResponse,
  RegisterUserDto,
} from "../../Redux/slices/userSlice";
import Button from "../Common/Button";

interface DynamicRegistrationFormProps {
  email: string;
  flowData: DetectFlowResponse;
  onBack: () => void;
}

export default function DynamicRegistrationForm({
  email,
  flowData,
  onBack,
}: DynamicRegistrationFormProps) {
  const navigate = useNavigate();
  const [createUser, { isLoading: isCreatingUser }] = useCreateUserMutation();
  const [joinOrgRequest, { isLoading: isJoiningOrg }] =
    useJoinOrgRequestMutation();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isLoading = isCreatingUser || isJoiningOrg;

  // Initialize form fields based on required fields
  const [fields, setFields] = useState(() => {
    const initialFields: Record<string, string | string[]> = {
      email,
      registration_type: flowData.registration_type,
    };

    // Initialize all required fields with empty strings
    flowData.required_fields.forEach((field) => {
      if (field !== "email") {
        initialFields[field] = field === "org_size" ? "1-10" : "";
      }
    });

    // Add optional join_message field for join_existing type
    if (flowData.registration_type === "join_existing") {
      initialFields.join_message = "";
    }

    return initialFields;
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFields((prev: Record<string, string | string[]>) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCountriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const countries = e.target.value
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c);
    setFields((prev: Record<string, string | string[]>) => ({
      ...prev,
      countries_of_operation: countries,
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields = flowData.required_fields;

    for (const field of requiredFields) {
      const value = fields[field];
      if (!value || (Array.isArray(value) && value.length === 0)) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      if (flowData.registration_type === "join_existing") {
        // Use join request for existing organizations
        await joinOrgRequest({
          orgDomain: fields.target_org_domain as string,
          message:
            (fields.join_message as string) ||
            "Requesting to join organization",
        }).unwrap();

        setSuccess(
          "Join request sent successfully! You will be notified when it's approved."
        );
        
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 3000);
      } else {
        const result = await createUser(fields as unknown as RegisterUserDto).unwrap();
        setSuccess("Registration successful! Redirecting...");

        // Handle role-based redirection
        setTimeout(() => {
          // Check if user has platform_admin or super_admin role
          if (result.role === "platform_admin" || result.role === "super_admin") {
            // Check if user has pending join (registration_type is not join_existing)
            if (flowData.registration_type !== "join_existing") {
              // Show pending approval screen for platform admins who are not joining existing org
              navigate("/pending-approval", { 
                replace: true,
                state: { 
                  userDetails: {
                    ...result,
                    email: fields.email as string,
                    name: fields.name as string
                  },
                  showPendingApproval: true 
                }
              });
            } else {
              // Direct access to platform admins area for those joining existing org
              navigate("/platform-admins", { replace: true });
            }
          } else {
            // Regular users go to dashboard/home
            navigate("/", { replace: true });
          }
        }, 2000);
      }
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "data" in err &&
        typeof (err as { data?: unknown }).data === "object" &&
        (err as { data?: unknown }).data !== null &&
        "message" in (err as { data: { message?: string } }).data
      ) {
        setError(
          (err as { data: { message?: string } }).data?.message ||
            "Failed to register."
        );
      } else {
        setError("Failed to register.");
      }
    }
  };

  const renderField = (fieldName: string) => {
    const value = fields[fieldName];
    const baseInputClass =
      "w-full px-4 py-4 rounded-xl bg-secondary-700/50 border border-secondary-600/50 focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 focus:outline-none text-white placeholder-secondary-400 transition-all duration-200";
    const isRequired = flowData.required_fields.includes(fieldName);

    // Hide org_size field but keep it in the form data with default value
    if (fieldName === "org_size") {
      return null;
    }

    switch (fieldName) {
      case "email":
        return (
          <div key={fieldName}>
            <label className="block text-sm font-medium text-secondary-300 mb-2">
              Email Address{" "}
              {isRequired && <span className="text-red-400">*</span>}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-secondary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
              <input
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-secondary-700/50 border border-secondary-600/50 text-white placeholder-secondary-400 opacity-75"
                name={fieldName}
                type="email"
                placeholder="Email Address"
                value={email}
                disabled
              />
            </div>
          </div>
        );

      case "name":
        return (
          <div key={fieldName}>
            <label className="block text-sm font-medium text-secondary-300 mb-2">
              Full Name {isRequired && <span className="text-red-400">*</span>}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-secondary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <input
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-secondary-700/50 border border-secondary-600/50 focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 focus:outline-none text-white placeholder-secondary-400 transition-all duration-200"
                name={fieldName}
                placeholder="Full Name"
                value={(value as string) || ""}
                onChange={handleChange}
                required={isRequired}
              />
            </div>
          </div>
        );

      case "admin_justification":
        return (
          <div key={fieldName}>
            <label className="block text-sm font-medium text-secondary-300 mb-2">
              Admin Justification{" "}
              {isRequired && <span className="text-red-400">*</span>}
            </label>
            <textarea
              className="w-full px-4 py-4 rounded-xl bg-secondary-700/50 border border-secondary-600/50 focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 focus:outline-none text-white placeholder-secondary-400 transition-all duration-200 resize-none"
              name={fieldName}
              placeholder="Admin Justification"
              value={(value as string) || ""}
              onChange={handleChange}
              rows={4}
              required={isRequired}
            />
          </div>
        );

      case "join_message":
        return (
          <div key={fieldName}>
            <label className="block text-sm font-medium text-secondary-300 mb-2">
              Message for Organization Admin{" "}
              {!isRequired && (
                <span className="text-secondary-400">(optional)</span>
              )}
            </label>
            <textarea
              className="w-full px-4 py-4 rounded-xl bg-secondary-700/50 border border-secondary-600/50 focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 focus:outline-none text-white placeholder-secondary-400 transition-all duration-200 resize-none"
              name={fieldName}
              placeholder="Message for organization admin (optional)"
              value={(value as string) || ""}
              onChange={handleChange}
              rows={3}
              required={isRequired}
            />
          </div>
        );

      default: {
        const fieldLabel = fieldName
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
        return (
          <div key={fieldName}>
            <label className="block text-sm font-medium text-secondary-300 mb-2">
              {fieldLabel}{" "}
              {isRequired && <span className="text-red-400">*</span>}
            </label>
            <input
              className={baseInputClass}
              name={fieldName}
              placeholder={fieldLabel}
              value={(value as string) || ""}
              onChange={
                fieldName === "countries_of_operation"
                  ? handleCountriesChange
                  : handleChange
              }
              required={isRequired}
            />
          </div>
        );
      }
    }
  };

  const getFormTitle = () => {
    switch (flowData.registration_type) {
      case "LE":
        return "Law Enforcement Registration";
      case "platform_admin":
        return "Platform Admin Registration";
      case "join_existing":
        return "Join Existing Organization";
      default:
        return "Organization Registration";
    }
  };

  const getFormDescription = () => {
    switch (flowData.registration_type) {
      case "LE":
        return "Complete your law enforcement organization registration.";
      case "platform_admin":
        return "Provide justification for platform admin access.";
      case "join_existing":
        return "Request to join an existing organization.";
      default:
        return "Set up your organization to get started.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-8 rounded-xl border border-secondary-700 w-full max-w-md shadow-lg">
        <button
          onClick={onBack}
          className="text-secondary-400 hover:text-secondary-300 mb-4 flex items-center"
        >
          ← Back
        </button>

        <h2 className="text-2xl font-bold text-secondary-300 mb-2">
          {getFormTitle()}
        </h2>
        <p className="text-gray-300 mb-6">{getFormDescription()}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {flowData.required_fields
            .filter((fieldName) => fieldName !== "org_size") // Hide org_size field
            .map((fieldName) => renderField(fieldName))}

          {/* Show optional join_message field for join_existing flow */}
          {flowData.registration_type === "join_existing" &&
            renderField("join_message")}

          {error && <div className="text-red-400">{error}</div>}
          {success && <div className="text-green-400">{success}</div>}

          <div className="flex gap-2 mt-6">
            <Button type="submit" loading={isLoading} className="flex-1">
              {flowData.registration_type === "join_existing"
                ? "Request to Join"
                : "Register"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
