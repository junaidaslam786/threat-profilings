import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateSubscriptionMutation } from "../../Redux/api/subscriptionsApi";
import type { SubscriptionLevel } from "../../Redux/slices/subscriptionsSlice";
import Button from "../../components/Common/Button";

export default function SubscriptionCreate() {
  const [createSubscription, { isLoading }] = useCreateSubscriptionMutation();
  const navigate = useNavigate();
  const [fields, setFields] = useState({ client_name: "", tier: "L0" });
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
    if (!fields.client_name || !fields.tier) {
      setError("Client name and tier are required.");
      return;
    }
    try {
      await createSubscription({
        client_name: fields.client_name,
        subscription_level: fields.tier as SubscriptionLevel,
        payment_method: "credit_card",
        billing_info: {}
      }).unwrap();
      setSuccess("Subscription created successfully.");
      navigate(`/subscriptions/${fields.client_name}`);
      setFields({ client_name: "", tier: "L0" });
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
            "Failed to create subscription."
        );
      } else {
        setError("Failed to create subscription.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-xl border border-blue-700 w-full max-w-md shadow-lg"
      >
        <h2 className="text-2xl font-bold text-blue-300 mb-4">
          Create Subscription
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-blue-400 mb-1">Client Name *</label>
            <input
              className="w-full p-2 rounded bg-gray-700 border border-blue-900"
              name="client_name"
              placeholder="Client Name"
              value={fields.client_name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-blue-400 mb-1">Tier *</label>
            <select
              name="tier"
              className="w-full p-2 rounded bg-gray-700 border border-blue-900"
              value={fields.tier}
              onChange={handleChange}
              required
            >
              <option value="L0">L0</option>
              <option value="L1">L1</option>
              <option value="L2">L2</option>
              <option value="L3">L3</option>
              <option value="LE">LE</option>
            </select>
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
    </div>
  );
}
