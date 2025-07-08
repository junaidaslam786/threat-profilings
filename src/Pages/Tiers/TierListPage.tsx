import { useState } from "react";
import {
  useDeleteTierMutation,
  useGetTiersQuery,
} from "../../Redux/api/tiersApi";
import Button from "../../components/Common/Button";
import TierCreate from "./TierCreate";

export default function TierListPage() {
  const { data: tiers, isLoading, error, refetch } = useGetTiersQuery();
  const [deleteTier, { isLoading: isDeleting }] = useDeleteTierMutation();
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleDelete = async (sub_level: string) => {
    if (window.confirm("Are you sure you want to delete this tier?")) {
      await deleteTier(sub_level).unwrap();
      refetch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-400">
            Subscription Tiers
          </h1>
          <Button onClick={() => setShowCreate((v) => !v)}>
            {showCreate ? "Close" : "Create Tier"}
          </Button>
        </div>
        {showCreate && (
          <TierCreate
            onSuccess={() => {
              setShowCreate(false);
              refetch();
            }}
          />
        )}
        {isLoading && <div className="py-8 text-center">Loading...</div>}
        {error && (
          <div className="text-red-400 py-8 text-center">
            Failed to load tiers.
          </div>
        )}
        {!isLoading && !error && tiers?.length === 0 && (
          <div className="text-center text-gray-400 py-12">No tiers found.</div>
        )}
        <div className="space-y-4">
          {tiers?.map((tier) => (
            <div
              key={tier.sub_level}
              className="bg-gray-800 rounded-lg shadow p-6 border border-blue-700 flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div>
                <div className="text-lg font-semibold text-blue-300">
                  {tier.name}
                </div>
                <div className="text-xs text-gray-400">{tier.sub_level}</div>
                <div className="text-xs text-blue-300 mb-2">
                  {tier.description || "-"}
                </div>
                <div className="text-xs text-gray-400 mb-1">
                  <span className="text-blue-400">Max Edits:</span>{" "}
                  {tier.max_edits}{" "}
                  <span className="ml-3 text-blue-400">Max Apps:</span>{" "}
                  {tier.max_apps}{" "}
                  <span className="ml-3 text-blue-400">Run Quota:</span>{" "}
                  {tier.run_quota}
                </div>
                <div className="text-xs text-blue-400 mb-1">
                  Tabs: {tier.allowed_tabs.join(", ")}
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  Monthly: ${tier.price_monthly} | Registration: $
                  {tier.price_onetime_registration}
                </div>
              </div>
              <div className="mt-2 md:mt-0 flex gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    (window.location.href = `/tiers/${tier.sub_level}`)
                  }
                >
                  View
                </Button>
                <Button
                  variant="danger"
                  loading={isDeleting && deleteTarget === tier.sub_level}
                  onClick={() => {
                    setDeleteTarget(tier.sub_level);
                    handleDelete(tier.sub_level);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
