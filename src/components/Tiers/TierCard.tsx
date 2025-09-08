import React from "react";
import { useUser } from "../../hooks/useUser";
import type { TierConfigDto } from "../../Redux/slices/tiersSlice";

interface TierCardProps {
  tier: TierConfigDto;
  onView: (subLevel: string) => void;
  onEdit?: (tier: TierConfigDto) => void;
  onDelete: (subLevel: string) => void;
  isDeleting: boolean;
  deleteTarget: string | null;
}

const TierCard: React.FC<TierCardProps> = ({
  tier,
  onView,
  onEdit,
  onDelete,
  isDeleting,
  deleteTarget,
}) => {
  const { isPlatformAdmin } = useUser();

  return (
    <div className="group bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl shadow-xl p-6 border border-secondary-700/50 hover:border-primary-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/10">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent">
              {tier.name}
            </h3>
            <span className="text-xs px-3 py-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full font-medium">
              {tier.sub_level}
            </span>
          </div>

          <p className="text-secondary-300 mb-6 leading-relaxed">
            {tier.description || "No description available"}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-secondary-700/50 to-secondary-800/50 p-4 rounded-lg border border-secondary-600/30 hover:border-primary-500/30 transition-colors">
              <div className="text-xs text-secondary-400 uppercase tracking-wide">
                Max Edits
              </div>
              <div className="text-2xl font-bold text-primary-300 mt-1">
                {tier.max_edits}
              </div>
            </div>
            <div className="bg-gradient-to-br from-secondary-700/50 to-secondary-800/50 p-4 rounded-lg border border-secondary-600/30 hover:border-primary-500/30 transition-colors">
              <div className="text-xs text-secondary-400 uppercase tracking-wide">
                Max Apps
              </div>
              <div className="text-2xl font-bold text-primary-300 mt-1">
                {tier.max_apps}
              </div>
            </div>
            <div className="bg-gradient-to-br from-secondary-700/50 to-secondary-800/50 p-4 rounded-lg border border-secondary-600/30 hover:border-primary-500/30 transition-colors">
              <div className="text-xs text-secondary-400 uppercase tracking-wide">
                Run Quota
              </div>
              <div className="text-2xl font-bold text-primary-300 mt-1">
                {tier.run_quota}
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 p-4 rounded-lg border border-green-500/30">
              <div className="text-xs text-green-300 uppercase tracking-wide">
                Monthly Price
              </div>
              <div className="text-2xl font-bold text-green-400 mt-1">
                ${tier.price_monthly}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 lg:mt-0 lg:ml-6 flex flex-col gap-3 lg:min-w-[140px]">
          <button
            onClick={() => onView(tier.sub_level)}
            className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-500 hover:to-primary-600 transition-all duration-200 font-medium cursor-pointer shadow-lg hover:shadow-xl"
          >
            View Details
          </button>

          {isPlatformAdmin && onEdit && (
            <button
              onClick={() => onEdit(tier)}
              className="px-4 py-2 bg-gradient-to-r from-tertiary-600 to-tertiary-700 text-white rounded-lg hover:from-tertiary-500 hover:to-tertiary-600 transition-all duration-200 font-medium cursor-pointer shadow-lg hover:shadow-xl"
            >
              Edit Tier
            </button>
          )}

          {isPlatformAdmin && (
            <button
              onClick={() => onDelete(tier.sub_level)}
              disabled={isDeleting && deleteTarget === tier.sub_level}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-500 hover:to-red-600 transition-all duration-200 font-medium cursor-pointer shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting && deleteTarget === tier.sub_level
                ? "Deleting..."
                : "Delete"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TierCard;
