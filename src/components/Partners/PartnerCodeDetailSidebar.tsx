import React from "react";

interface PartnerCode {
  partner_code: string;
  discount_percent: number;
  commission_percent: number;
  partner_email: string;
  usage_limit?: number;
  usage_count: number;
  status: "active" | "inactive";
  created_at: string;
}

interface PartnerCodeDetailSidebarProps {
  partnerCode: PartnerCode;
  onClose: () => void;
  onEdit: () => void;
  onStats: () => void;
}

const PartnerCodeDetailSidebar: React.FC<PartnerCodeDetailSidebarProps> = ({
  partnerCode,
  onEdit,
  onStats,
}) => {
  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green-500/20 text-green-400 border border-green-500/30"
      : "bg-red-500/20 text-red-400 border border-red-500/30";
  };

  const usagePercentage = partnerCode.usage_limit
    ? (partnerCode.usage_count / partnerCode.usage_limit) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Partner Code Header */}
      <div className="flex items-center space-x-4 p-4 bg-secondary-800/50 rounded-xl border border-secondary-700/30">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
          {partnerCode.partner_code.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">
            {partnerCode.partner_code}
          </h3>
          <p className="text-secondary-400 text-sm">Partner Code Information</p>
        </div>
      </div>
      {/* Basic Information */}
      <div className="bg-secondary-800/50 rounded-xl p-6 border border-secondary-700/30">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 text-primary-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white">
            Basic Information
          </h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-secondary-400">Partner Code</span>
            <span className="text-white font-medium">
              {partnerCode.partner_code}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-secondary-400">Partner Email</span>
            <span className="text-white font-medium">
              {partnerCode.partner_email}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-secondary-400">Status</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                partnerCode.status
              )}`}
            >
              {partnerCode.status.toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-secondary-400">Created Date</span>
            <span className="text-white font-medium">
              {new Date(partnerCode.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Financial Details */}
      <div className="bg-secondary-800/50 rounded-xl p-6 border border-secondary-700/30">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white">
            Financial Details
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
            <div className="text-green-400 text-sm font-medium mb-1">
              Discount Rate
            </div>
            <div className="text-2xl font-bold text-green-300">
              {partnerCode.discount_percent}%
            </div>
          </div>
          <div className="bg-secondary-500/10 rounded-lg p-4 border border-secondary-500/20">
            <div className="text-secondary-400 text-sm font-medium mb-1">
              Commission Rate
            </div>
            <div className="text-2xl font-bold text-secondary-300">
              {partnerCode.commission_percent}%
            </div>
          </div>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="bg-secondary-800/50 rounded-xl p-6 border border-secondary-700/30">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white">Usage Statistics</h3>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-secondary-400">Usage Count</span>
            <span className="text-white font-medium">
              {partnerCode.usage_count}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-secondary-400">Usage Limit</span>
            <span className="text-white font-medium">
              {partnerCode.usage_limit ? partnerCode.usage_limit : "Unlimited"}
            </span>
          </div>
          {partnerCode.usage_limit && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-secondary-400">Usage Progress</span>
                <span className="text-white font-medium">
                  {usagePercentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-secondary-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    usagePercentage >= 90
                      ? "bg-red-500"
                      : usagePercentage >= 70
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-secondary-800/50 rounded-xl p-6 border border-secondary-700/30">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white">
            Performance Metrics
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20">
            <div className="text-yellow-400 text-sm font-medium mb-1">
              Estimated Revenue Impact
            </div>
            <div className="text-lg font-bold text-yellow-300">
              $
              {(
                partnerCode.usage_count *
                50 *
                (partnerCode.discount_percent / 100)
              ).toFixed(2)}
            </div>
            <div className="text-xs text-secondary-400 mt-1">
              Based on average order value
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 pt-4">
        <button
          onClick={onEdit}
          className="w-full px-4 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 cursor-pointer flex items-center justify-center space-x-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <span>Edit Partner Code</span>
        </button>
        <button
          onClick={onStats}
          className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-500 hover:to-purple-600 transition-all duration-200 cursor-pointer flex items-center justify-center space-x-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <span>View Statistics</span>
        </button>
      </div>
    </div>
  );
};

export default PartnerCodeDetailSidebar;
