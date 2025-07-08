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
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
        <textarea
          className="col-span-1 md:col-span-2 p-2 rounded bg-gray-800 border border-blue-900"
          name="description"
          placeholder="Description"
          value={fields.description}
          onChange={handleChange}
        />
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
