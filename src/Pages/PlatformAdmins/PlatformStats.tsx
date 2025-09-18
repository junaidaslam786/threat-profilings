import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Common/Navbar";
import LoadingScreen from "../../components/Common/LoadingScreen";
import { useGetPlatformStatsQuery } from "../../Redux/api/platformAdminApi";

const PlatformStats: React.FC = () => {
  const navigate = useNavigate();
  const {
    data: platformStats,
    isLoading,
    error,
    refetch,
  } = useGetPlatformStatsQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <LoadingScreen />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 p-8 rounded-xl border border-red-500/30 text-center max-w-md">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-400 mb-4">
              Error Loading Statistics
            </h2>
            <p className="text-secondary-300 mb-6">
              Failed to load platform statistics.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => refetch()}
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-500 hover:to-primary-600 transition-all duration-200 cursor-pointer"
              >
                Retry
              </button>
              <button
                onClick={() => navigate("/platform-admins")}
                className="px-6 py-3 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white rounded-lg hover:from-secondary-500 hover:to-secondary-600 transition-all duration-200 cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!platformStats) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent mb-3">
              Platform Statistics
            </h1>
            <p className="text-secondary-300 text-lg">
              Real-time insights and analytics for the platform
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => refetch()}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-all duration-200 cursor-pointer flex items-center space-x-2"
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Refresh</span>
            </button>
            <button
              onClick={() => navigate("/platform-admins")}
              className="px-6 py-3 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white rounded-lg hover:from-secondary-500 hover:to-secondary-600 transition-all duration-200 cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* User Statistics */}
        <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-8 border border-secondary-700/50 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-secondary-400 to-secondary-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-white">User Statistics</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
            <div 
              onClick={() => navigate("/platform-admins/users")}
              className="bg-secondary-700/30 p-6 rounded-xl border border-secondary-600/30 text-center hover:border-primary-500/30 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                {platformStats.users?.total || 0}
              </p>
              <p className="text-sm text-secondary-400">Total Users</p>
            </div>
            <div 
              onClick={() => navigate("/platform-admins/users?status=active")}
              className="bg-secondary-700/30 p-6 rounded-xl border border-secondary-600/30 text-center hover:border-green-500/30 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-3xl font-bold text-green-400 mb-1">
                {platformStats.users?.active || 0}
              </p>
              <p className="text-sm text-secondary-400">Active</p>
            </div>
            <div 
              onClick={() => navigate("/platform-admins/users?status=pending")}
              className="bg-secondary-700/30 p-6 rounded-xl border border-secondary-600/30 text-center hover:border-yellow-500/30 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-3xl font-bold text-yellow-400 mb-1">
                {platformStats.users?.pending || 0}
              </p>
              <p className="text-sm text-secondary-400">Pending</p>
            </div>
            <div 
              onClick={() => navigate("/platform-admins/users?status=suspended")}
              className="bg-secondary-700/30 p-6 rounded-xl border border-secondary-600/30 text-center hover:border-red-500/30 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18 21l-5.197-5.197m0 0L5.636 5.636M13.803 15.803L18 21"
                  />
                </svg>
              </div>
              <p className="text-3xl font-bold text-red-400 mb-1">
                {platformStats.users?.suspended || 0}
              </p>
              <p className="text-sm text-secondary-400">Suspended</p>
            </div>
            <div 
              onClick={() => navigate("/platform-admins/users?user_type=le_user")}
              className="bg-secondary-700/30 p-6 rounded-xl border border-secondary-600/30 text-center hover:border-purple-500/30 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <p className="text-3xl font-bold text-purple-400 mb-1">
                {platformStats.users?.le_users || 0}
              </p>
              <p className="text-sm text-secondary-400">LE Users</p>
            </div>
            <div 
              onClick={() => navigate("/platform-admins/admins")}
              className="bg-secondary-700/30 p-6 rounded-xl border border-secondary-600/30 text-center hover:border-secondary-500/30 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <p className="text-3xl font-bold text-secondary-400 mb-1">
                {platformStats.users?.platform_admins || 0}
              </p>
              <p className="text-sm text-secondary-400">Admins</p>
            </div>
            <div className="bg-secondary-700/30 p-6 rounded-xl border border-secondary-600/30 text-center hover:border-cyan-500/30 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
              <p className="text-3xl font-bold text-cyan-400 mb-1">
                {platformStats.users?.recent_registrations || 0}
              </p>
              <p className="text-sm text-secondary-400">New (30d)</p>
            </div>
          </div>
        </div>

        {/* Organization Statistics */}
        <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-8 border border-secondary-700/50 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-green-400 to-green-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-white">
              Organization Statistics
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-secondary-700/30 p-6 rounded-xl border border-secondary-600/30 text-center hover:border-primary-500/30 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                {platformStats.organizations.total}
              </p>
              <p className="text-sm text-secondary-400">Total Organizations</p>
            </div>
            <div className="bg-secondary-700/30 p-6 rounded-xl border border-secondary-600/30 text-center hover:border-green-500/30 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-3xl font-bold text-green-400 mb-1">
                {platformStats.organizations.standard}
              </p>
              <p className="text-sm text-secondary-400">Standard</p>
            </div>
            <div className="bg-secondary-700/30 p-6 rounded-xl border border-secondary-600/30 text-center hover:border-purple-500/30 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <p className="text-3xl font-bold text-purple-400 mb-1">
                {platformStats.organizations.le_master}
              </p>
              <p className="text-sm text-secondary-400">LE Master</p>
            </div>
            <div className="bg-secondary-700/30 p-6 rounded-xl border border-secondary-600/30 text-center hover:border-yellow-500/30 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <p className="text-3xl font-bold text-yellow-400 mb-1">
                {platformStats.organizations.le_client}
              </p>
              <p className="text-sm text-secondary-400">LE Client</p>
            </div>
          </div>

          {/* Industry & Size Breakdown */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-secondary-700/20 rounded-xl p-6 border border-secondary-600/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-secondary-500/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-secondary-400"
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
                <h3 className="text-lg font-semibold text-white">
                  By Industry
                </h3>
              </div>
              <div className="space-y-3">
                {Object.entries(platformStats.organizations.by_industry).map(
                  ([industry, count]) => (
                    <div
                      key={industry}
                      className="flex justify-between items-center bg-secondary-600/30 p-4 rounded-lg hover:bg-secondary-600/50 transition-colors"
                    >
                      <span className="text-white font-medium">{industry}</span>
                      <span className="text-secondary-400 font-bold text-lg">
                        {count}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="bg-secondary-700/20 rounded-xl p-6 border border-secondary-600/20">
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
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">By Size</h3>
              </div>
              <div className="space-y-3">
                {Object.entries(platformStats.organizations.by_size).map(
                  ([size, count]) => (
                    <div
                      key={size}
                      className="flex justify-between items-center bg-secondary-600/30 p-4 rounded-lg hover:bg-secondary-600/50 transition-colors"
                    >
                      <span className="text-white font-medium">{size}</span>
                      <span className="text-green-400 font-bold text-lg">
                        {count}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Statistics */}
        <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-8 border border-secondary-700/50 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-white">
              Subscription Statistics
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
            <div 
              onClick={() => navigate("/platform-admin/payments-details")}
              className="bg-secondary-700/30 p-6 rounded-xl border border-secondary-600/30 text-center hover:border-primary-500/30 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                {platformStats.subscriptions.total}
              </p>
              <p className="text-sm text-secondary-400">Total</p>
            </div>
            <div className="bg-secondary-700/30 p-6 rounded-xl border border-secondary-600/30 text-center hover:border-gray-500/30 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-white"
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
              <p className="text-3xl font-bold text-gray-400 mb-1">
                {platformStats.subscriptions.l0}
              </p>
              <p className="text-sm text-secondary-400">L0 (Free)</p>
            </div>
            <div 
              onClick={() => navigate("/platform-admin/payments-details")}
              className="bg-secondary-700/30 p-6 rounded-xl border border-secondary-600/30 text-center hover:border-green-500/30 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <p className="text-3xl font-bold text-green-400 mb-1">
                {platformStats.subscriptions.l1}
              </p>
              <p className="text-sm text-secondary-400">L1 (Basic)</p>
            </div>
            <div 
              onClick={() => navigate("/platform-admin/payments-details")}
              className="bg-secondary-700/30 p-6 rounded-xl border border-secondary-600/30 text-center hover:border-secondary-500/30 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <p className="text-3xl font-bold text-secondary-400 mb-1">
                {platformStats.subscriptions.l2}
              </p>
              <p className="text-sm text-secondary-400">L2 (Premium)</p>
            </div>
            <div 
              onClick={() => navigate("/platform-admin/payments-details")}
              className="bg-secondary-700/30 p-6 rounded-xl border border-secondary-600/30 text-center hover:border-purple-500/30 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <p className="text-3xl font-bold text-purple-400 mb-1">
                {platformStats.subscriptions.le}
              </p>
              <p className="text-sm text-secondary-400">LE (Enterprise)</p>
            </div>
          </div>

          {/* Revenue Projection */}
          <div 
            onClick={() => navigate("/platform-admin/payments-details")}
            className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 rounded-xl p-6 border border-yellow-500/20 text-center cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-300"
          >
            <div className="flex items-center justify-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
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
                Revenue Projection
              </h3>
            </div>
            <p className="text-4xl font-bold text-yellow-400">
              ${platformStats.subscriptions.revenue_projection.toLocaleString()}
            </p>
            <p className="text-sm text-secondary-400 mt-2">
              Projected monthly revenue
            </p>
          </div>
        </div>

        {/* System & Activity Metrics */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-8 border border-secondary-700/50">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-white">System Metrics</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-secondary-700/30 p-4 rounded-xl border border-secondary-600/30 flex justify-between items-center hover:border-green-500/30 transition-colors">
                <div className="flex items-center space-x-3">
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-white font-medium">Uptime</span>
                </div>
                <span className="text-green-400 font-bold text-lg">
                  {Math.floor(parseInt(platformStats.system.uptime) / 60)}m
                </span>
              </div>
              <div className="bg-secondary-700/30 p-4 rounded-xl border border-secondary-600/30 flex justify-between items-center hover:border-secondary-500/30 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-secondary-500/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-secondary-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2"
                      />
                    </svg>
                  </div>
                  <span className="text-white font-medium">
                    Total API Calls
                  </span>
                </div>
                <span className="text-secondary-400 font-bold text-lg">
                  {(platformStats.system.total_api_calls / 1000).toFixed(1)}K
                </span>
              </div>
              <div className="bg-secondary-700/30 p-4 rounded-xl border border-secondary-600/30 flex justify-between items-center hover:border-cyan-500/30 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-cyan-400"
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
                  <span className="text-white font-medium">
                    Daily API Calls
                  </span>
                </div>
                <span className="text-cyan-400 font-bold text-lg">
                  {platformStats.system.daily_api_calls.toLocaleString()}
                </span>
              </div>
              <div className="bg-secondary-700/30 p-4 rounded-xl border border-secondary-600/30 flex justify-between items-center hover:border-yellow-500/30 transition-colors">
                <div className="flex items-center space-x-3">
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
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <span className="text-white font-medium">Error Rate</span>
                </div>
                <span className="text-yellow-400 font-bold text-lg">
                  {platformStats.system.error_rate}%
                </span>
              </div>
              <div className="bg-secondary-700/30 p-4 rounded-xl border border-secondary-600/30 flex justify-between items-center hover:border-green-500/30 transition-colors">
                <div className="flex items-center space-x-3">
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
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <span className="text-white font-medium">Response Time</span>
                </div>
                <span className="text-green-400 font-bold text-lg">
                  {platformStats.system.avg_response_time}ms
                </span>
              </div>
              <div className="bg-secondary-700/30 p-4 rounded-xl border border-secondary-600/30 flex justify-between items-center hover:border-purple-500/30 transition-colors">
                <div className="flex items-center space-x-3">
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
                        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                      />
                    </svg>
                  </div>
                  <span className="text-white font-medium">Database Size</span>
                </div>
                <span className="text-purple-400 font-bold text-lg">
                  {platformStats.system.database_size}
                </span>
              </div>
              <div className="bg-secondary-700/30 p-4 rounded-xl border border-secondary-600/30 flex justify-between items-center hover:border-cyan-500/30 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-cyan-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-white font-medium">
                    Active Sessions
                  </span>
                </div>
                <span className="text-cyan-400 font-bold text-lg">
                  {platformStats.system.active_sessions}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-8 border border-secondary-700/50">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-white">
                Activity Metrics
              </h2>
            </div>
            <div className="space-y-6">
              <div className="bg-secondary-700/30 p-6 rounded-xl border border-secondary-600/30 text-center hover:border-green-500/30 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
                    />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-green-400 mb-1">
                  {platformStats.activity.daily_logins}
                </p>
                <p className="text-sm text-secondary-400">Daily Logins</p>
              </div>
              <div className="bg-secondary-700/30 p-6 rounded-xl border border-secondary-600/30 text-center hover:border-secondary-500/30 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h2a2 2 0 012 2v1m-6 0h6m-6 0l-.5 8.5A2 2 0 0010 18h4a2 2 0 001.5-1.5L15 8"
                    />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-secondary-400 mb-1">
                  {platformStats.activity.weekly_logins}
                </p>
                <p className="text-sm text-secondary-400">Weekly Logins</p>
              </div>
              <div className="bg-secondary-700/30 p-6 rounded-xl border border-secondary-600/30 text-center hover:border-purple-500/30 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h2a2 2 0 012 2v1m-6 0h6m-6 0l-.5 8.5A2 2 0 0010 18h4a2 2 0 001.5-1.5L15 8"
                    />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-purple-400 mb-1">
                  {platformStats.activity.monthly_logins}
                </p>
                <p className="text-sm text-secondary-400">Monthly Logins</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformStats;
