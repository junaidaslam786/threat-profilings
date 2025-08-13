import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateUserMutation, useJoinOrgRequestMutation } from "../../Redux/api/userApi";
import type { 
  DetectFlowResponse, 
  RegisterUserDto 
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
  onBack 
}: DynamicRegistrationFormProps) {
  const navigate = useNavigate();
  const [createUser, { isLoading: isCreatingUser }] = useCreateUserMutation();
  const [joinOrgRequest, { isLoading: isJoiningOrg }] = useJoinOrgRequestMutation();
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
      if (field !== 'email') {
        initialFields[field] = field === 'org_size' ? 'SMALL' : '';
      }
    });
    
    // Add optional join_message field for join_existing type
    if (flowData.registration_type === 'join_existing') {
      initialFields.join_message = '';
    }
    
    return initialFields;
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFields((prev: Record<string, string | string[]>) => ({ ...prev, [name]: value }));
  };

  const handleCountriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const countries = e.target.value.split(',').map(c => c.trim()).filter(c => c);
    setFields((prev: Record<string, string | string[]>) => ({ ...prev, countries_of_operation: countries }));
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
      if (flowData.registration_type === 'join_existing') {
        // Use join request for existing organizations
        await joinOrgRequest({
          orgDomain: fields.target_org_domain as string,
          message: fields.join_message as string || "Requesting to join organization",
        }).unwrap();
        
        setSuccess("Join request sent successfully! You will be notified when it's approved.");
        
        // For join requests, we don't redirect to dashboard immediately
        // as the user needs approval first
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 3000);
      } else {
        // Use regular user creation for other registration types
        await createUser(fields as unknown as RegisterUserDto).unwrap();
        setSuccess("Registration successful! Redirecting to dashboard...");
        
        // Redirect to dashboard after successful registration
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
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
    
    switch (fieldName) {
      case 'email':
        return (
          <input
            key={fieldName}
            className="w-full p-3 rounded bg-gray-700 border border-blue-900 focus:border-blue-500 focus:outline-none"
            name={fieldName}
            type="email"
            placeholder="Email Address"
            value={email}
            disabled
          />
        );
        
      case 'name':
        return (
          <input
            key={fieldName}
            className="w-full p-3 rounded bg-gray-700 border border-blue-900 focus:border-blue-500 focus:outline-none"
            name={fieldName}
            placeholder="Full Name"
            value={value as string || ''}
            onChange={handleChange}
            required
          />
        );
        
      case 'org_name':
        return (
          <input
            key={fieldName}
            className="w-full p-3 rounded bg-gray-700 border border-blue-900 focus:border-blue-500 focus:outline-none"
            name={fieldName}
            placeholder="Organization Name"
            value={value as string || ''}
            onChange={handleChange}
            required
          />
        );
        
      case 'org_domain':
        return (
          <input
            key={fieldName}
            className="w-full p-3 rounded bg-gray-700 border border-blue-900 focus:border-blue-500 focus:outline-none"
            name={fieldName}
            placeholder="Organization Domain (e.g., company.com)"
            value={value as string || ''}
            onChange={handleChange}
            required
          />
        );
        
      case 'target_org_domain':
        return (
          <input
            key={fieldName}
            className="w-full p-3 rounded bg-gray-700 border border-blue-900 focus:border-blue-500 focus:outline-none"
            name={fieldName}
            placeholder="Target Organization Domain"
            value={value as string || ''}
            onChange={handleChange}
            required
          />
        );
        
      case 'join_message':
        return (
          <textarea
            key={fieldName}
            className="w-full p-3 rounded bg-gray-700 border border-blue-900 focus:border-blue-500 focus:outline-none"
            name={fieldName}
            placeholder="Message for organization admin (optional)"
            value={value as string || ''}
            onChange={handleChange}
            rows={3}
          />
        );
        
      case 'industry':
        return (
          <input
            key={fieldName}
            className="w-full p-3 rounded bg-gray-700 border border-blue-900 focus:border-blue-500 focus:outline-none"
            name={fieldName}
            placeholder="Industry"
            value={value as string || ''}
            onChange={handleChange}
            required
          />
        );
        
      case 'sector':
        return (
          <input
            key={fieldName}
            className="w-full p-3 rounded bg-gray-700 border border-blue-900 focus:border-blue-500 focus:outline-none"
            name={fieldName}
            placeholder="Sector"
            value={value as string || ''}
            onChange={handleChange}
            required
          />
        );
        
      case 'org_size':
        return (
          <select
            key={fieldName}
            className="w-full p-3 rounded bg-gray-700 border border-blue-900 focus:border-blue-500 focus:outline-none"
            name={fieldName}
            value={value as string || 'SMALL'}
            onChange={handleChange}
            required
          >
            <option value="SMALL">1-10 employees</option>
            <option value="MEDIUM">11-50 employees</option>
            <option value="LARGE">51-100 employees</option>
            <option value="XLARGE">101-500 employees</option>
            <option value="ENTERPRISE">500+ employees</option>
          </select>
        );
        
      case 'countries_of_operation':
        return (
          <input
            key={fieldName}
            className="w-full p-3 rounded bg-gray-700 border border-blue-900 focus:border-blue-500 focus:outline-none"
            name={fieldName}
            placeholder="Countries of Operation (comma-separated)"
            value={Array.isArray(value) ? value.join(', ') : ''}
            onChange={handleCountriesChange}
            required
          />
        );
        
      case 'admin_justification':
        return (
          <textarea
            key={fieldName}
            className="w-full p-3 rounded bg-gray-700 border border-blue-900 focus:border-blue-500 focus:outline-none"
            name={fieldName}
            placeholder="Admin Justification"
            value={value as string || ''}
            onChange={handleChange}
            rows={4}
            required
          />
        );
        
      default:
        return (
          <input
            key={fieldName}
            className="w-full p-3 rounded bg-gray-700 border border-blue-900 focus:border-blue-500 focus:outline-none"
            name={fieldName}
            placeholder={fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            value={value as string || ''}
            onChange={handleChange}
            required
          />
        );
    }
  };

  const getFormTitle = () => {
    switch (flowData.registration_type) {
      case 'LE':
        return 'Law Enforcement Registration';
      case 'platform_admin':
        return 'Platform Admin Registration';
      case 'join_existing':
        return 'Join Existing Organization';
      default:
        return 'Organization Registration';
    }
  };

  const getFormDescription = () => {
    switch (flowData.registration_type) {
      case 'LE':
        return 'Complete your law enforcement organization registration.';
      case 'platform_admin':
        return 'Provide justification for platform admin access.';
      case 'join_existing':
        return 'Request to join an existing organization.';
      default:
        return 'Set up your organization to get started.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-8 rounded-xl border border-blue-700 w-full max-w-md shadow-lg">
        <button
          onClick={onBack}
          className="text-blue-400 hover:text-blue-300 mb-4 flex items-center"
        >
          ← Back
        </button>
        
        <h2 className="text-2xl font-bold text-blue-300 mb-2">{getFormTitle()}</h2>
        <p className="text-gray-300 mb-6">{getFormDescription()}</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {flowData.required_fields.map((fieldName) => renderField(fieldName))}
          
          {/* Show optional join_message field for join_existing flow */}
          {flowData.registration_type === 'join_existing' && renderField('join_message')}
          
          {error && <div className="text-red-400">{error}</div>}
          {success && <div className="text-green-400">{success}</div>}
          
          <div className="flex gap-2 mt-6">
            <Button type="submit" loading={isLoading} className="flex-1">
              {flowData.registration_type === 'join_existing' ? 'Request to Join' : 'Register'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
