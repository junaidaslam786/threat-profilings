import { useState } from "react";
import { useCreateUserMutation } from "../../Redux/api/userApi";
import { UserRegistrationType, OrgSize } from "../../Redux/slices/userSlice";
import Button from "../../components/Common/Button";

export default function RegisterPage() {
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [registrationType] = useState<UserRegistrationType>(UserRegistrationType.STANDARD);
  const [fields, setFields] = useState({
    name: "",
    email: "",
    partnerCode: "",
    
    // Standard organization fields
    org_name: "",
    org_domain: "",
    industry: "",
    org_size: OrgSize.SMALL,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!fields.name || !fields.email || !fields.org_name || !fields.org_domain || !fields.industry) {
      setError("Name, email, organization name, domain, and industry are required.");
      return;
    }
    
    try {
      await createUser({
        name: fields.name,
        email: fields.email,
        registration_type: registrationType,
        org_name: fields.org_name,
        org_domain: fields.org_domain,
        industry: fields.industry,
        org_size: fields.org_size,
        partnerCode: fields.partnerCode || undefined,
      }).unwrap();
      
      setSuccess("Registration successful!");
      setFields({
        name: "",
        email: "",
        partnerCode: "",
        org_name: "",
        org_domain: "",
        industry: "",
        org_size: OrgSize.SMALL,
      });
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        className="bg-gray-800 p-8 rounded-xl border border-blue-700 w-full max-w-md shadow-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-blue-300 mb-4">Register</h2>
        <div className="space-y-4">
          <input
            className="w-full p-2 rounded bg-gray-700 border border-blue-900"
            name="name"
            placeholder="Full Name"
            value={fields.name}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-2 rounded bg-gray-700 border border-blue-900"
            name="email"
            type="email"
            placeholder="Email Address"
            value={fields.email}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-2 rounded bg-gray-700 border border-blue-900"
            name="org_name"
            placeholder="Organization Name"
            value={fields.org_name}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-2 rounded bg-gray-700 border border-blue-900"
            name="org_domain"
            placeholder="Organization Domain (e.g., company.com)"
            value={fields.org_domain}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-2 rounded bg-gray-700 border border-blue-900"
            name="industry"
            placeholder="Industry"
            value={fields.industry}
            onChange={handleChange}
            required
          />
          <select
            className="w-full p-2 rounded bg-gray-700 border border-blue-900"
            name="org_size"
            value={fields.org_size}
            onChange={handleChange}
            required
          >
            <option value={OrgSize.SMALL}>1-10 employees</option>
            <option value={OrgSize.MEDIUM}>11-50 employees</option>
            <option value={OrgSize.LARGE}>51-100 employees</option>
            <option value={OrgSize.XLARGE}>101-500 employees</option>
            <option value={OrgSize.ENTERPRISE}>500+ employees</option>
          </select>
          <input
            className="w-full p-2 rounded bg-gray-700 border border-blue-900"
            name="partnerCode"
            placeholder="Partner Code (optional)"
            value={fields.partnerCode}
            onChange={handleChange}
          />
        </div>
        {error && <div className="text-red-400 mt-2">{error}</div>}
        {success && <div className="text-green-400 mt-2">{success}</div>}
        <div className="flex gap-2 mt-6">
          <Button type="submit" loading={isLoading}>
            Register Organization
          </Button>
        </div>
      </form>
    </div>
  );
}
