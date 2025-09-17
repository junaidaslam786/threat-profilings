// pages/tiers/TierDetailPage.tsx
import { useParams } from "react-router-dom";
import { useGetTierQuery } from "../../Redux/api/tiersApi";
import Button from "../../components/Common/Button";
import LoadingScreen from "../../components/Common/LoadingScreen";

export default function TierDetailPage() {
  const { sub_level } = useParams<{ sub_level: string }>();
  const { data: tier, isLoading, error } = useGetTierQuery(sub_level!);

  if (isLoading) return <LoadingScreen />;
  if (error || !tier)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-400">
        Tier not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-xl mx-auto bg-gray-800 rounded-xl shadow-lg border border-blue-700 p-8">
        <h1 className="text-2xl font-bold text-blue-300 mb-2">{tier.name}</h1>
        <div className="text-xs text-gray-400 mb-4">{tier.sub_level}</div>
        <div className="mb-3 text-blue-400 font-semibold">Description</div>
        <div className="mb-3 text-xs text-gray-300">
          {tier.description || "-"}
        </div>
        <div className="mb-3 text-blue-400 font-semibold">Max Edits</div>
        <div className="mb-3 text-xs text-gray-300">{tier.max_edits}</div>
        <div className="mb-3 text-blue-400 font-semibold">Max Apps</div>
        <div className="mb-3 text-xs text-gray-300">{tier.max_apps}</div>
        <div className="mb-3 text-blue-400 font-semibold">Run Quota</div>
        <div className="mb-3 text-xs text-gray-300">{tier.run_quota}</div>
        <div className="mb-3 text-blue-400 font-semibold">Subscription Price</div>
        <div className="mb-3 text-xs text-gray-300">${tier.price_onetime_registration} (one-time)</div>
        <div className="mb-3 text-blue-400 font-semibold">
          Monthly Rate (Legacy)
        </div>
        <div className="mb-3 text-xs text-gray-300">
          ${tier.price_monthly}
        </div>
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/tiers")}
        >
          Back to Tiers
        </Button>
      </div>
    </div>
  );
}
