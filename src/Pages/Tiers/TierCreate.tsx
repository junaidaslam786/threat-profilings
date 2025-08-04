import { useState } from "react";
import { useCreateTierMutation } from "../../Redux/api/tiersApi";
import Button from "../../components/Common/Button";

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
      setError(
        "Please fill all required fields (sub_level, name, max_edits, max_apps, allowed_tabs, run_quota, price_monthly, price_onetime_registration)."
      );
      return;
    }
    try {
      const complianceFrameworksArray = fields.compliance_frameworks
        ? fields.compliance_frameworks
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item)
        : [];

      await createTier({
        sub_level: fields.sub_level,
        name: fields.name,
        description: fields.description,
        max_edits: Number(fields.max_edits),
        max_apps: Number(fields.max_apps),
        allowed_tabs: fields.allowed_tabs
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        run_quota: Number(fields.run_quota),
        price_monthly: Number(fields.price_monthly),
        price_onetime_registration: Number(fields.price_onetime_registration),
        features: {
          max_users: Number(fields.max_users) || undefined,
          storage_limit_gb: Number(fields.storage_limit_gb) || undefined,
          discount_percent: Number(fields.discount_percent) || undefined,
          promotion_code: fields.promotion_code || undefined,
          threat_detection: fields.threat_detection,
          compliance_reports: fields.compliance_reports,
          api_access: fields.api_access,
          custom_branding: fields.custom_branding,
          priority_support: fields.priority_support,
          sso_integration: fields.sso_integration,
          audit_logs: fields.audit_logs,
          data_export: fields.data_export,
          is_active: fields.is_active,
          le_eligible: fields.le_eligible,
          compliance_frameworks: complianceFrameworksArray,
        },
      }).unwrap();
      setSuccess("Tier created!");
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
            "Failed to create tier."
        );
      } else {
        setError("Failed to create tier.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 border border-blue-700 p-6 rounded-xl shadow-lg mb-8"
    >
      <h2 className="text-xl font-bold text-blue-300 mb-4">Create Tier</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="p-2 rounded bg-gray-800 border border-blue-900"
          name="sub_level"
          placeholder="Sub Level (L0, L1, ...)"
          value={fields.sub_level}
          onChange={handleChange}
          required
        />
        <input
          className="p-2 rounded bg-gray-800 border border-blue-900"
          name="name"
          placeholder="Name"
          value={fields.name}
          onChange={handleChange}
          required
        />
        <input
          className="p-2 rounded bg-gray-800 border border-blue-900"
          name="max_edits"
          type="number"
          placeholder="Max Edits"
          value={fields.max_edits}
          onChange={handleChange}
          required
        />
        <input
          className="p-2 rounded bg-gray-800 border border-blue-900"
          name="max_apps"
          type="number"
          placeholder="Max Apps"
          value={fields.max_apps}
          onChange={handleChange}
          required
        />
        <input
          className="p-2 rounded bg-gray-800 border border-blue-900"
          name="allowed_tabs"
          placeholder="Allowed Tabs (comma-separated)"
          value={fields.allowed_tabs}
          onChange={handleChange}
          required
        />
        <input
          className="p-2 rounded bg-gray-800 border border-blue-900"
          name="run_quota"
          type="number"
          placeholder="Run Quota"
          value={fields.run_quota}
          onChange={handleChange}
          required
        />
        <input
          className="p-2 rounded bg-gray-800 border border-blue-900"
          name="price_monthly"
          type="number"
          placeholder="Monthly Price"
          value={fields.price_monthly}
          onChange={handleChange}
          required
        />
        <input
          className="p-2 rounded bg-gray-800 border border-blue-900"
          name="price_onetime_registration"
          type="number"
          placeholder="One-time Registration Price"
          value={fields.price_onetime_registration}
          onChange={handleChange}
          required
        />
        <input
          className="p-2 rounded bg-gray-800 border border-blue-900"
          name="max_users"
          type="number"
          placeholder="Max Users (optional)"
          value={fields.max_users}
          onChange={handleChange}
        />
        <input
          className="p-2 rounded bg-gray-800 border border-blue-900"
          name="storage_limit_gb"
          type="number"
          placeholder="Storage Limit (GB, optional)"
          value={fields.storage_limit_gb}
          onChange={handleChange}
        />
        <input
          className="p-2 rounded bg-gray-800 border border-blue-900"
          name="discount_percent"
          type="number"
          placeholder="Discount Percent (optional)"
          value={fields.discount_percent}
          onChange={handleChange}
        />
        <input
          className="p-2 rounded bg-gray-800 border border-blue-900"
          name="promotion_code"
          placeholder="Promotion Code (optional)"
          value={fields.promotion_code}
          onChange={handleChange}
        />
        <input
          className="p-2 rounded bg-gray-800 border border-blue-900"
          name="compliance_frameworks"
          placeholder="Compliance Frameworks (comma-separated)"
          value={fields.compliance_frameworks}
          onChange={handleChange}
        />
        <textarea
          className="col-span-1 md:col-span-2 p-2 rounded bg-gray-800 border border-blue-900"
          name="description"
          placeholder="Description"
          value={fields.description}
          onChange={handleChange}
        />
      </div>

      {/* Feature Checkboxes */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-blue-300 mb-4">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <label className="flex items-center space-x-2 text-gray-300">
            <input
              type="checkbox"
              name="threat_detection"
              checked={fields.threat_detection}
              onChange={handleChange}
              className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span>Threat Detection</span>
          </label>
          <label className="flex items-center space-x-2 text-gray-300">
            <input
              type="checkbox"
              name="compliance_reports"
              checked={fields.compliance_reports}
              onChange={handleChange}
              className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span>Compliance Reports</span>
          </label>
          <label className="flex items-center space-x-2 text-gray-300">
            <input
              type="checkbox"
              name="api_access"
              checked={fields.api_access}
              onChange={handleChange}
              className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span>API Access</span>
          </label>
          <label className="flex items-center space-x-2 text-gray-300">
            <input
              type="checkbox"
              name="custom_branding"
              checked={fields.custom_branding}
              onChange={handleChange}
              className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span>Custom Branding</span>
          </label>
          <label className="flex items-center space-x-2 text-gray-300">
            <input
              type="checkbox"
              name="priority_support"
              checked={fields.priority_support}
              onChange={handleChange}
              className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span>Priority Support</span>
          </label>
          <label className="flex items-center space-x-2 text-gray-300">
            <input
              type="checkbox"
              name="sso_integration"
              checked={fields.sso_integration}
              onChange={handleChange}
              className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span>SSO Integration</span>
          </label>
          <label className="flex items-center space-x-2 text-gray-300">
            <input
              type="checkbox"
              name="audit_logs"
              checked={fields.audit_logs}
              onChange={handleChange}
              className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span>Audit Logs</span>
          </label>
          <label className="flex items-center space-x-2 text-gray-300">
            <input
              type="checkbox"
              name="data_export"
              checked={fields.data_export}
              onChange={handleChange}
              className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span>Data Export</span>
          </label>
          <label className="flex items-center space-x-2 text-gray-300">
            <input
              type="checkbox"
              name="is_active"
              checked={fields.is_active}
              onChange={handleChange}
              className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span>Is Active</span>
          </label>
          <label className="flex items-center space-x-2 text-gray-300">
            <input
              type="checkbox"
              name="le_eligible"
              checked={fields.le_eligible}
              onChange={handleChange}
              className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span>LE Eligible</span>
          </label>
        </div>
      </div>
      {error && <div className="text-red-400 mt-2">{error}</div>}
      {success && <div className="text-green-400 mt-2">{success}</div>}
      <div className="flex gap-2 mt-6">
        <Button type="submit" loading={isLoading}>
          Create
        </Button>
      </div>
    </form>
  );
}
