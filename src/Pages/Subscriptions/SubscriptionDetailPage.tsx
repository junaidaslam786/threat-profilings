import { useParams } from "react-router-dom";
import { useState } from "react";
import {
  useGetSubscriptionQuery,
  useUpdateSubscriptionMutation,
} from "../../Redux/api/subscriptionsApi";
import type { SubscriptionLevel } from "../../Redux/slices/subscriptionsSlice";
import Button from "../../components/Common/Button";

export default function SubscriptionDetailPage() {
  const { client_name } = useParams<{ client_name: string }>();
  const {
    data: sub,
    isLoading,
    error,
    refetch,
  } = useGetSubscriptionQuery(client_name!);
  const [editing, setEditing] = useState(false);
  const [fields, setFields] = useState({ tier: "", run_number: "" });
  const [updateSubscription, { isLoading: isUpdating }] =
    useUpdateSubscriptionMutation();
  const [errMsg, setErrMsg] = useState("");

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading...
      </div>
    );
  if (error || !sub)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-400">
        Subscription not found.
      </div>
    );

  const startEdit = () => {
    setFields({
      tier: sub.subscription_level,
      run_number: sub.run_number?.toString() ?? "",
    });
    setEditing(true);
    setErrMsg("");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMsg("");
    try {
      await updateSubscription({
        clientName: sub.client_name,
        body: {
          tier: fields.tier as SubscriptionLevel,
          run_number: fields.run_number ? Number(fields.run_number) : undefined,
        },
      }).unwrap();
      setEditing(false);
      refetch();
    } catch (err: unknown) {
      interface ErrorWithMessage {
        data?: {
          message?: string;
        };
      }
      if (
        err &&
        typeof err === "object" &&
        "data" in err &&
        typeof (err as ErrorWithMessage).data?.message === "string"
      ) {
        setErrMsg((err as ErrorWithMessage).data?.message || "Update failed");
      } else {
        setErrMsg("Update failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-xl mx-auto bg-gray-800 rounded-xl shadow-lg border border-blue-700 p-8">
        <h1 className="text-2xl font-bold text-blue-300 mb-2">
          Subscription for {sub.client_name}
        </h1>
        <div className="text-xs text-gray-400 mb-4">{sub.created_at}</div>
        {!editing ? (
          <>
            <div className="mb-3">
              <span className="text-blue-400 font-semibold">Tier:</span>{" "}
              {sub.subscription_level}
            </div>
            <div className="mb-3">
              <span className="text-blue-400 font-semibold">Run quota:</span>{" "}
              {sub.run_quota}
            </div>
            <div className="mb-3">
              <span className="text-blue-400 font-semibold">Run number:</span>{" "}
              {sub.run_number ?? "-"}
            </div>
            <div className="mb-3">
              <span className="text-blue-400 font-semibold">Progress:</span>{" "}
              {sub.progress}%
            </div>
            <div className="mb-3">
              <span className="text-blue-400 font-semibold">Max Edits:</span>{" "}
              {sub.max_edits ?? "-"}
            </div>
            <div className="mb-3">
              <span className="text-blue-400 font-semibold">Max Apps:</span>{" "}
              {sub.max_apps ?? "-"}
            </div>
            <div className="mb-3">
              <span className="text-blue-400 font-semibold">Features:</span>{" "}
              {(sub.features_access || []).join(", ")}
            </div>
            <div className="mb-3">
              <span className="text-blue-400 font-semibold">Payment:</span>{" "}
              {sub.payment_status ?? "-"}
            </div>
            <Button className="mt-4" onClick={startEdit}>
              Edit Subscription
            </Button>
          </>
        ) : (
          <form className="space-y-2" onSubmit={handleSave}>
            <label className="block text-blue-300 font-semibold">Tier</label>
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
            <label className="block text-blue-300 font-semibold">
              Run Number
            </label>
            <input
              type="number"
              name="run_number"
              className="w-full p-2 rounded bg-gray-700 border border-blue-900"
              value={fields.run_number}
              onChange={handleChange}
              placeholder="Run Number"
            />
            {errMsg && <div className="text-red-400">{errMsg}</div>}
            <div className="flex gap-2 mt-4">
              <Button type="submit" loading={isUpdating}>
                Save
              </Button>
              <Button
                variant="ghost"
                type="button"
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
