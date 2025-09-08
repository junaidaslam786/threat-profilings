import { useState } from "react";
import { useCreateTierMutation } from "../../Redux/api/tiersApi";
import Button from "../../components/Common/Button";
import MultiSelect from "../../components/Common/MultiSelect";
import { COMPLIANCE_FRAMEWORKS } from "../../constants/complianceFrameworks";

interface TierCreateProps {
  onSuccess?: () => void;
}

export default function TierCreate({ onSuccess }: TierCreateProps) {
  const [createTier, { isLoading }] = useCreateTierMutation();
  const [fields, setFields] = useState({
    sub_level: "",
    name: "",
    description: "",
    max_edits: "",
    max_apps: "",
    run_quota: "",
    price_monthly: "",
    price_onetime_registration: "",
    compliance_reports: false,
    api_access: false,
    priority_support: false,
    sso_integration: false,
    data_export: false,
    is_active: true,
    compliance_frameworks: [] as string[],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Tier level options
  const tierLevelOptions = [
    { value: "L0", label: "L0 - Free Tier" },
    { value: "L1", label: "L1 - Basic" },
    { value: "L2", label: "L2 - Professional" },
    { value: "L3", label: "L3 - Enterprise" },
    { value: "LE", label: "LE - Large Enterprise" },
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFields((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFields((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleComplianceFrameworksChange = (values: string[]) => {
    setFields((prev) => ({ ...prev, compliance_frameworks: values }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (
      !fields.sub_level ||
      !fields.name ||
      !fields.max_edits ||
      !fields.max_apps ||
      !fields.run_quota ||
      !fields.price_monthly ||
      !fields.price_onetime_registration
    ) {
      setError("Please fill all required fields.");
      return;
    }
    try {
      await createTier({
        sub_level: fields.sub_level,
        name: fields.name,
        description: fields.description || undefined,
        max_edits: parseInt(fields.max_edits),
        max_apps: parseInt(fields.max_apps),
        run_quota: parseInt(fields.run_quota),
        price_monthly: parseFloat(fields.price_monthly),
        price_onetime_registration: parseFloat(
          fields.price_onetime_registration
        ),
        features: {
          compliance_reports: fields.compliance_reports,
          api_access: fields.api_access,
          priority_support: fields.priority_support,
          sso_integration: fields.sso_integration,
          data_export: fields.data_export,
          compliance_frameworks: fields.compliance_frameworks,
          is_active: fields.is_active,
        },
      }).unwrap();
      setSuccess("Tier created successfully!");
      setFields({
        sub_level: "",
        name: "",
        description: "",
        max_edits: "",
        max_apps: "",
        run_quota: "",
        price_monthly: "",
        price_onetime_registration: "",
        compliance_reports: true,
        api_access: true,
        priority_support: true,
        sso_integration: true,
        data_export: true,
        is_active: true,
        compliance_frameworks: [],
      });
      onSuccess?.();
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "message" in err) {
        setError((err as { message: string }).message);
      } else {
        setError("Failed to create tier");
      }
    }
  };

  const inputClasses =
    "w-full px-3 py-2 bg-secondary-800 border border-secondary-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500";
  const labelClasses = "block text-sm font-medium text-secondary-300 mb-2";

  return (
    <div className="bg-secondary-800 rounded-lg p-6 border border-primary-600 mb-8">
      <h2 className="text-xl font-bold text-primary-300 mb-6">
        Create New Tier
      </h2>

      {error && (
        <div className="bg-danger-600 text-white px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-success-600 text-white px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-secondary-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-primary-300 mb-4">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Tier Level *</label>
              <select
                name="sub_level"
                value={fields.sub_level}
                onChange={handleChange}
                className={inputClasses}
                required
              >
                <option value="">Select tier level...</option>
                {tierLevelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClasses}>Tier Name *</label>
              <input
                type="text"
                name="name"
                value={fields.name}
                onChange={handleChange}
                placeholder="Basic, Pro, Enterprise"
                className={inputClasses}
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label className={labelClasses}>Description</label>
            <textarea
              name="description"
              value={fields.description}
              onChange={handleChange}
              placeholder="Describe this tier's purpose and benefits"
              rows={3}
              className={inputClasses}
            />
          </div>
        </div>

        {/* Limits and Quotas */}
        <div className="bg-secondary-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-primary-300 mb-4">
            Limits & Quotas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClasses}>Max Edits *</label>
              <input
                type="number"
                name="max_edits"
                value={fields.max_edits}
                onChange={handleChange}
                placeholder="10"
                className={inputClasses}
                required
              />
            </div>

            <div>
              <label className={labelClasses}>Max Apps *</label>
              <input
                type="number"
                name="max_apps"
                value={fields.max_apps}
                onChange={handleChange}
                placeholder="5"
                className={inputClasses}
                required
              />
            </div>

            <div>
              <label className={labelClasses}>Run Quota *</label>
              <input
                type="number"
                name="run_quota"
                value={fields.run_quota}
                onChange={handleChange}
                placeholder="100"
                className={inputClasses}
                required
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-secondary-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-primary-300 mb-4">
            Pricing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Monthly Price *</label>
              <input
                type="number"
                step="0.01"
                name="price_monthly"
                value={fields.price_monthly}
                onChange={handleChange}
                placeholder="29.99"
                className={inputClasses}
                required
              />
            </div>

            <div>
              <label className={labelClasses}>
                One-time Registration Price *
              </label>
              <input
                type="number"
                step="0.01"
                name="price_onetime_registration"
                value={fields.price_onetime_registration}
                onChange={handleChange}
                placeholder="0.00"
                className={inputClasses}
                required
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-secondary-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-primary-300 mb-4">
            Features
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[
              { key: "compliance_reports", label: "Compliance Reports" },
              { key: "api_access", label: "API Access" },
              { key: "priority_support", label: "Priority Support" },
              { key: "sso_integration", label: "SSO Integration" },
              { key: "data_export", label: "Data Export" },
              { key: "is_active", label: "Active" },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  name={key}
                  checked={fields[key as keyof typeof fields] as boolean}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 bg-secondary-700 border-secondary-600 rounded focus:ring-primary-500"
                />
                <span className="text-secondary-300">{label}</span>
              </label>
            ))}
          </div>

          <div className="mt-4">
            <MultiSelect
              id="compliance_frameworks"
              label="Compliance Frameworks"
              options={COMPLIANCE_FRAMEWORKS}
              values={fields.compliance_frameworks}
              onChange={handleComplianceFrameworksChange}
              placeholder="Select compliance frameworks..."
              searchable={true}
              className="mt-2"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-primary-600 hover:bg-primary-700"
          >
            {isLoading ? "Creating..." : "Create Tier"}
          </Button>
        </div>
      </form>
    </div>
  );
}
