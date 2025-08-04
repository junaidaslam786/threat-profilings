import { useState } from "react";
import { useCreateTierMutation } from "../../Redux/api/tiersApi";
import Button from "../../components/Common/Button";

interface TierCreateProps {
  onSuccess?: () => void;
}

export default function TierCreateEnhanced({ onSuccess }: TierCreateProps) {
  const [createTier, { isLoading }] = useCreateTierMutation();
  const [fields, setFields] = useState({
    sub_level: "",
    name: "",
    description: "",
    max_edits: "",
    max_apps: "",
    allowed_tabs: "",
    run_quota: "",
    price_monthly: "",
    price_onetime_registration: "",
    max_users: "",
    storage_limit_gb: "",
    discount_percent: "",
    promotion_code: "",
    threat_detection: false,
    compliance_reports: false,
    api_access: false,
    custom_branding: false,
    priority_support: false,
    sso_integration: false,
    audit_logs: false,
    data_export: false,
    is_active: true,
    le_eligible: false,
    compliance_frameworks: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFields((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFields((prev) => ({ ...prev, [name]: value }));
    }
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
      !fields.allowed_tabs ||
      !fields.run_quota ||
      !fields.price_monthly ||
      !fields.price_onetime_registration
    ) {
      setError("Please fill all required fields.");
      return;
    }
    try {
      const complianceFrameworksArray = fields.compliance_frameworks
        ? fields.compliance_frameworks.split(",").map(item => item.trim()).filter(item => item)
        : [];

      await createTier({
        sub_level: fields.sub_level,
        name: fields.name,
        description: fields.description || undefined,
        max_edits: parseInt(fields.max_edits),
        max_apps: parseInt(fields.max_apps),
        allowed_tabs: fields.allowed_tabs.split(",").map(tab => tab.trim()).filter(tab => tab),
        run_quota: parseInt(fields.run_quota),
        price_monthly: parseFloat(fields.price_monthly),
        price_onetime_registration: parseFloat(fields.price_onetime_registration),
        features: {
          threat_detection: fields.threat_detection,
          compliance_reports: fields.compliance_reports,
          api_access: fields.api_access,
          custom_branding: fields.custom_branding,
          priority_support: fields.priority_support,
          sso_integration: fields.sso_integration,
          audit_logs: fields.audit_logs,
          data_export: fields.data_export,
          compliance_frameworks: complianceFrameworksArray,
          is_active: fields.is_active,
          discount_percent: fields.discount_percent ? parseFloat(fields.discount_percent) : undefined,
          promotion_code: fields.promotion_code || undefined,
          max_users: fields.max_users ? parseInt(fields.max_users) : undefined,
          storage_limit_gb: fields.storage_limit_gb ? parseFloat(fields.storage_limit_gb) : undefined,
          le_eligible: fields.le_eligible,
        },
      }).unwrap();
      setSuccess("Tier created successfully!");
      setFields({
        sub_level: "",
        name: "",
        description: "",
        max_edits: "",
        max_apps: "",
        allowed_tabs: "",
        run_quota: "",
        price_monthly: "",
        price_onetime_registration: "",
        max_users: "",
        storage_limit_gb: "",
        discount_percent: "",
        promotion_code: "",
        threat_detection: false,
        compliance_reports: false,
        api_access: false,
        custom_branding: false,
        priority_support: false,
        sso_integration: false,
        audit_logs: false,
        data_export: false,
        is_active: true,
        le_eligible: false,
        compliance_frameworks: "",
      });
      onSuccess?.();
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'message' in err) {
        setError((err as { message: string }).message);
      } else {
        setError("Failed to create tier");
      }
    }
  };

  const inputClasses = "w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-400 mb-8">Create New Tier</h1>
        
        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-900/20 border border-green-500 text-green-400 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-800 rounded-lg p-6 border border-blue-700">
            <h2 className="text-xl font-semibold text-blue-300 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Tier Level *</label>
                <input
                  type="text"
                  name="sub_level"
                  value={fields.sub_level}
                  onChange={handleChange}
                  placeholder="L0, L1, L2, L3, LE"
                  className={inputClasses}
                  required
                />
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
          <div className="bg-gray-800 rounded-lg p-6 border border-blue-700">
            <h2 className="text-xl font-semibold text-blue-300 mb-4">Limits & Quotas</h2>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className={labelClasses}>Max Users</label>
                <input
                  type="number"
                  name="max_users"
                  value={fields.max_users}
                  onChange={handleChange}
                  placeholder="Unlimited if not set"
                  className={inputClasses}
                />
              </div>
              
              <div>
                <label className={labelClasses}>Storage Limit (GB)</label>
                <input
                  type="number"
                  step="0.1"
                  name="storage_limit_gb"
                  value={fields.storage_limit_gb}
                  onChange={handleChange}
                  placeholder="10.5"
                  className={inputClasses}
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className={labelClasses}>Allowed Tabs *</label>
              <input
                type="text"
                name="allowed_tabs"
                value={fields.allowed_tabs}
                onChange={handleChange}
                placeholder="dashboard,reports,settings (comma-separated)"
                className={inputClasses}
                required
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gray-800 rounded-lg p-6 border border-blue-700">
            <h2 className="text-xl font-semibold text-blue-300 mb-4">Pricing</h2>
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
                <label className={labelClasses}>One-time Registration Price *</label>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className={labelClasses}>Discount Percent</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  name="discount_percent"
                  value={fields.discount_percent}
                  onChange={handleChange}
                  placeholder="10.00"
                  className={inputClasses}
                />
              </div>
              
              <div>
                <label className={labelClasses}>Promotion Code</label>
                <input
                  type="text"
                  name="promotion_code"
                  value={fields.promotion_code}
                  onChange={handleChange}
                  placeholder="SAVE20"
                  className={inputClasses}
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-gray-800 rounded-lg p-6 border border-blue-700">
            <h2 className="text-xl font-semibold text-blue-300 mb-4">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { key: 'threat_detection', label: 'Threat Detection' },
                { key: 'compliance_reports', label: 'Compliance Reports' },
                { key: 'api_access', label: 'API Access' },
                { key: 'custom_branding', label: 'Custom Branding' },
                { key: 'priority_support', label: 'Priority Support' },
                { key: 'sso_integration', label: 'SSO Integration' },
                { key: 'audit_logs', label: 'Audit Logs' },
                { key: 'data_export', label: 'Data Export' },
                { key: 'is_active', label: 'Active' },
                { key: 'le_eligible', label: 'LE Eligible' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name={key}
                    checked={fields[key as keyof typeof fields] as boolean}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-300">{label}</span>
                </label>
              ))}
            </div>
            
            <div className="mt-4">
              <label className={labelClasses}>Compliance Frameworks</label>
              <input
                type="text"
                name="compliance_frameworks"
                value={fields.compliance_frameworks}
                onChange={handleChange}
                placeholder="ISM,NIST,ISO27001,SOC2,GDPR,E8,ACSC_ESSENTIAL_EIGHT (comma-separated)"
                className={inputClasses}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Tier"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
