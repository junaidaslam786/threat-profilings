import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Common/Button";
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Loading platform statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-red-700 text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            Error Loading Statistics
          </h2>
          <p className="mb-4">Failed to load platform statistics.</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => refetch()}>Retry</Button>
            <Button
              onClick={() => navigate("/platform-admins")}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!platformStats) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-blue-400">
          Platform Statistics
        </h1>
        <div className="flex gap-4">
          <Button
            onClick={() => refetch()}
            className="bg-green-600 hover:bg-green-700"
          >
            Refresh Data
          </Button>
          <Button
            onClick={() => navigate("/platform-admins")}
            className="bg-gray-600 hover:bg-gray-700"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* User Statistics */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-blue-700 mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-blue-300">
          User Statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">
              {platformStats.users.total}
            </p>
            <p className="text-sm text-gray-400">Total Users</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-400">
              {platformStats.users.active}
            </p>
            <p className="text-sm text-gray-400">Active Users</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-400">
              {platformStats.users.pending}
            </p>
            <p className="text-sm text-gray-400">Pending Approval</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-400">
              {platformStats.users.suspended}
            </p>
            <p className="text-sm text-gray-400">Suspended</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-400">
              {platformStats.users.le_users}
            </p>
            <p className="text-sm text-gray-400">LE Users</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-400">
              {platformStats.users.platform_admins}
            </p>
            <p className="text-sm text-gray-400">Platform Admins</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-cyan-400">
              {platformStats.users.recent_registrations}
            </p>
            <p className="text-sm text-gray-400">Recent Registrations (30d)</p>
          </div>
        </div>
      </div>

      {/* Organization Statistics */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-blue-700 mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-blue-300">
          Organization Statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">
              {platformStats.organizations.total}
            </p>
            <p className="text-sm text-gray-400">Total Organizations</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-400">
              {platformStats.organizations.standard}
            </p>
            <p className="text-sm text-gray-400">Standard Orgs</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-400">
              {platformStats.organizations.le_master}
            </p>
            <p className="text-sm text-gray-400">LE Master Orgs</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-400">
              {platformStats.organizations.le_client}
            </p>
            <p className="text-sm text-gray-400">LE Client Orgs</p>
          </div>
        </div>

        {/* Industry Breakdown */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-blue-300 mb-4">
              By Industry
            </h3>
            <div className="space-y-2">
              {Object.entries(platformStats.organizations.by_industry).map(
                ([industry, count]) => (
                  <div
                    key={industry}
                    className="flex justify-between items-center bg-gray-700 p-3 rounded"
                  >
                    <span className="text-white">{industry}</span>
                    <span className="text-blue-400 font-semibold">{count}</span>
                  </div>
                )
              )}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-300 mb-4">
              By Size
            </h3>
            <div className="space-y-2">
              {Object.entries(platformStats.organizations.by_size).map(
                ([size, count]) => (
                  <div
                    key={size}
                    className="flex justify-between items-center bg-gray-700 p-3 rounded"
                  >
                    <span className="text-white">{size}</span>
                    <span className="text-blue-400 font-semibold">{count}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Statistics */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-blue-700 mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-blue-300">
          Subscription Statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">
              {platformStats.subscriptions.total}
            </p>
            <p className="text-sm text-gray-400">Total Subscriptions</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-400">
              {platformStats.subscriptions.l0}
            </p>
            <p className="text-sm text-gray-400">L0 (Free)</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-400">
              {platformStats.subscriptions.l1}
            </p>
            <p className="text-sm text-gray-400">L1 (Basic)</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-400">
              {platformStats.subscriptions.l2}
            </p>
            <p className="text-sm text-gray-400">L2 (Premium)</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-400">
              {platformStats.subscriptions.le}
            </p>
            <p className="text-sm text-gray-400">LE (Enterprise)</p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-lg text-yellow-400">
            Revenue Projection:{" "}
            <span className="text-2xl font-bold">
              ${platformStats.subscriptions.revenue_projection.toLocaleString()}
            </span>
          </p>
        </div>
      </div>

      {/* System Statistics */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-blue-700">
          <h2 className="text-2xl font-semibold mb-6 text-blue-300">
            System Metrics
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Uptime</span>
              <span className="text-green-400 font-semibold">
                {platformStats.system.uptime}s
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total API Calls</span>
              <span className="text-blue-400 font-semibold">
                {platformStats.system.total_api_calls.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Daily API Calls</span>
              <span className="text-blue-400 font-semibold">
                {platformStats.system.daily_api_calls.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Error Rate</span>
              <span className="text-yellow-400 font-semibold">
                {platformStats.system.error_rate}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Avg Response Time</span>
              <span className="text-green-400 font-semibold">
                {platformStats.system.avg_response_time}ms
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Database Size</span>
              <span className="text-purple-400 font-semibold">
                {platformStats.system.database_size}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Active Sessions</span>
              <span className="text-cyan-400 font-semibold">
                {platformStats.system.active_sessions}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-blue-700">
          <h2 className="text-2xl font-semibold mb-6 text-blue-300">
            Activity Metrics
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Daily Logins</span>
              <span className="text-green-400 font-semibold">
                {platformStats.activity.daily_logins}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Weekly Logins</span>
              <span className="text-blue-400 font-semibold">
                {platformStats.activity.weekly_logins}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Monthly Logins</span>
              <span className="text-purple-400 font-semibold">
                {platformStats.activity.monthly_logins}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformStats;
