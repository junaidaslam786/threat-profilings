import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetPartnerStatsQuery } from "../../Redux/api/partnersApi";
import Navbar from "../../components/Common/Navbar";
import LoadingScreen from "../../components/Common/LoadingScreen";

const PartnerCodeStatsPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  const {
    data: partnerStats,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetPartnerStatsQuery(code || "", {
    skip: !code,
  });

  if (isLoading || isFetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <LoadingScreen />
        </div>
      </div>
    );
  }

  if (error || !partnerStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 p-8 rounded-xl border border-red-500/30 text-center max-w-md">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-400 mb-4">Statistics Not Found</h2>
            <p className="text-secondary-300 mb-6">Partner statistics could not be loaded.</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => refetch()}
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-500 hover:to-primary-600 transition-all duration-200 cursor-pointer"
              >
                Retry
              </button>
              <button
                onClick={() => navigate("/platform-admins/partner-codes")}
                className="px-6 py-3 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white rounded-lg hover:from-secondary-500 hover:to-secondary-600 transition-all duration-200 cursor-pointer"
              >
                Back to Partner Codes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const usagePercentage = partnerStats.usage_limit 
    ? (partnerStats.usage_count / partnerStats.usage_limit) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent mb-3">
              Partner Code Statistics
            </h1>
            <p className="text-secondary-300 text-lg">
              Performance analytics for partner code: <span className="text-primary-400 font-medium">{partnerStats.code}</span>
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => refetch()}
              className="px-6 py-3 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white rounded-lg hover:from-secondary-500 hover:to-secondary-600 transition-all duration-200 cursor-pointer flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
            <button
              onClick={() => navigate("/platform-admins/partner-codes")}
              className="px-6 py-3 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white rounded-lg hover:from-secondary-500 hover:to-secondary-600 transition-all duration-200 cursor-pointer"
            >
              Back to Partner Codes
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Usage Count */}
          <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50 hover:border-primary-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Usage Count</h4>
            <p className="text-3xl font-bold text-secondary-400 mb-2">{partnerStats.usage_count}</p>
            <p className="text-sm text-secondary-400">
              {partnerStats.usage_limit ? `of ${partnerStats.usage_limit} limit` : 'Unlimited usage'}
            </p>
          </div>

          {/* Usage Limit */}
          <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50 hover:border-green-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Usage Limit</h4>
            <p className="text-3xl font-bold text-green-400 mb-2">
              {partnerStats.usage_limit ?? '∞'}
            </p>
            <p className="text-sm text-secondary-400">
              {partnerStats.usage_limit ? 'Limited usage' : 'No restrictions'}
            </p>
          </div>

          {/* Total Discount */}
          <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50 hover:border-yellow-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Total Discount</h4>
            <p className="text-3xl font-bold text-yellow-400 mb-2">
              ${partnerStats.total_discount_given.toFixed(2)}
            </p>
            <p className="text-sm text-secondary-400">Given to customers</p>
          </div>

          {/* Commission Earned */}
          <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50 hover:border-purple-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Commission Earned</h4>
            <p className="text-3xl font-bold text-purple-400 mb-2">
              ${partnerStats.commission_earned.toFixed(2)}
            </p>
            <p className="text-sm text-secondary-400">Partner earnings</p>
          </div>
        </div>

        {/* Usage Progress */}
        {partnerStats.usage_limit && (
          <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-8 border border-secondary-700/50 mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">Usage Progress</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-secondary-300">Current Usage</span>
                <span className="text-white font-medium">
                  {partnerStats.usage_count} / {partnerStats.usage_limit} ({usagePercentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-secondary-700 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full transition-all duration-1000 ${
                    usagePercentage >= 90 ? 'bg-gradient-to-r from-red-500 to-red-600' : 
                    usagePercentage >= 70 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 
                    'bg-gradient-to-r from-green-500 to-green-600'
                  }`}
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-secondary-400">
                <span>0</span>
                <span>{partnerStats.usage_limit}</span>
              </div>
            </div>
          </div>
        )}

        {/* Performance Summary */}
        <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-8 border border-secondary-700/50">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white">Performance Summary</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-500/10 rounded-lg p-6 border border-green-500/20">
              <div className="text-green-400 text-sm font-medium mb-2">Average Discount per Use</div>
              <div className="text-2xl font-bold text-green-300">
                ${partnerStats.usage_count > 0 ? (partnerStats.total_discount_given / partnerStats.usage_count).toFixed(2) : '0.00'}
              </div>
            </div>
            <div className="bg-secondary-500/10 rounded-lg p-6 border border-secondary-500/20">
              <div className="text-secondary-400 text-sm font-medium mb-2">Average Commission per Use</div>
              <div className="text-2xl font-bold text-secondary-300">
                ${partnerStats.usage_count > 0 ? (partnerStats.commission_earned / partnerStats.usage_count).toFixed(2) : '0.00'}
              </div>
            </div>
            <div className="bg-purple-500/10 rounded-lg p-6 border border-purple-500/20">
              <div className="text-purple-400 text-sm font-medium mb-2">ROI Ratio</div>
              <div className="text-2xl font-bold text-purple-300">
                {partnerStats.total_discount_given > 0 ? (partnerStats.commission_earned / partnerStats.total_discount_given * 100).toFixed(1) : '0.0'}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerCodeStatsPage;