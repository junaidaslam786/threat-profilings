import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateSubscriptionMutation } from "../../Redux/api/subscriptionsApi";
import type { CreateSubscriptionDto } from "../../Redux/slices/subscriptionsSlice";
import Button from "../../components/Common/Button";
import ProtectedRoute from "../../components/Auth/ProtectedRoute";

export default function SubscriptionCreate() {
  const [createSubscription, { isLoading }] = useCreateSubscriptionMutation();
  const navigate = useNavigate();
  const [fields, setFields] = useState({ 
    client_name: "", 
    tier: "L0" as "L0" | "L1" | "L2" | "L3" | "LE",
    payment_method: "invoice" as "stripe" | "invoice" | "partner_code",
    partner_code: "",
    auto_renewal: false,
    currency: "USD" as "USD" | "AUD" | "EUR" | "GBP"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
    
    if (!fields.client_name || !fields.tier) {
      setError("Client name and tier are required.");
      return;
    }

    try {
      const payload: CreateSubscriptionDto = {
        client_name: fields.client_name,
        tier: fields.tier,
        payment_method: fields.payment_method,
        auto_renewal: fields.auto_renewal,
        currency: fields.currency
      };

      if (fields.partner_code && fields.payment_method === "partner_code") {
        payload.partner_code = fields.partner_code;
      }

      await createSubscription(payload).unwrap();
      setSuccess("Subscription created successfully.");
      navigate(`/subscriptions/${fields.client_name}`);
      setFields({ 
        client_name: "", 
        tier: "L0",
        payment_method: "invoice",
        partner_code: "",
        auto_renewal: false,
        currency: "USD"
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
            "Failed to create subscription."
        );
      } else {
        setError("Failed to create subscription.");
      }
    }
  };

  return (
    <ProtectedRoute requiredRoles={["admin", "platform_admin"]}>
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
            
            <div>
              <label className="block text-blue-400 mb-1">Payment Method</label>
              <select
                name="payment_method"
                className="w-full p-2 rounded bg-gray-700 border border-blue-900"
                value={fields.payment_method}
                onChange={handleChange}
              >
                <option value="invoice">Invoice</option>
                <option value="stripe">Stripe</option>
                <option value="partner_code">Partner Code</option>
              </select>
            </div>

            {fields.payment_method === "partner_code" && (
              <div>
                <label className="block text-blue-400 mb-1">Partner Code</label>
                <input
                  className="w-full p-2 rounded bg-gray-700 border border-blue-900"
                  name="partner_code"
                  placeholder="Enter partner code"
                  value={fields.partner_code}
                  onChange={handleChange}
                />
              </div>
            )}

            <div>
              <label className="block text-blue-400 mb-1">Currency</label>
              <select
                name="currency"
                className="w-full p-2 rounded bg-gray-700 border border-blue-900"
                value={fields.currency}
                onChange={handleChange}
              >
                <option value="USD">USD</option>
                <option value="AUD">AUD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="auto_renewal"
                id="auto_renewal"
                checked={fields.auto_renewal}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="auto_renewal" className="text-blue-400">
                Auto Renewal
              </label>
            </div>
          </div>
          {error && <div className="text-red-400 mt-2">{error}</div>}
          {success && <div className="text-green-400 mt-2">{success}</div>}
          <div className="flex gap-2 mt-6">
            <Button type="submit" loading={isLoading}>
              Create Subscription
            </Button>
            <Button 
              type="button" 
              onClick={() => navigate("/dashboard")}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}
