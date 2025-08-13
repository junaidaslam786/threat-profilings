import React from 'react';
import Button from '../Common/Button';

interface Tier {
  sub_level: string;
  name: string;
  description?: string;
  max_edits: number;
  max_apps: number;
  run_quota: number;
  allowed_tabs: string[];
  price_monthly: number;
  price_onetime_registration: number;
}

interface TierCardProps {
  tier: Tier;
  onView: (subLevel: string) => void;
  onDelete: (subLevel: string) => void;
  isDeleting: boolean;
  deleteTarget: string | null;
}

const TierCard: React.FC<TierCardProps> = ({
  tier,
  onView,
  onDelete,
  isDeleting,
  deleteTarget
}) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow p-6 border border-blue-700 flex flex-col md:flex-row md:items-center md:justify-between">
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
          onClick={() => onView(tier.sub_level)}
        >
          View
        </Button>
        <Button
          variant="danger"
          loading={isDeleting && deleteTarget === tier.sub_level}
          onClick={() => onDelete(tier.sub_level)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default TierCard;
