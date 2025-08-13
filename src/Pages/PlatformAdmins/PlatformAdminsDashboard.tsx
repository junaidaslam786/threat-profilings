import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Common/Button";
import {
  useGetCurrentAdminQuery,
  useGetPlatformStatsQuery,
} from "../../Redux/api/platformAdminApi";
import { performLogout } from "../../utils/cookieHelpers";

const PLATFORM_ADMIN_ROUTES = [
  { label: "Platform Statistics", path: "/platform-admins/stats" },
  { label: "Activity Logs", path: "/platform-admins/activity-logs" },
  { label: "Admin Management", path: "/platform-admins/admins" },
  { label: "User Management", path: "/platform-admins/users" },
  { label: "Grant Admin Access", path: "/platform-admins/grant-admin" },
];

const PlatformAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data: currentAdmin, isLoading: adminLoading } =
    useGetCurrentAdminQuery();
  const { data: platformStats, isLoading: statsLoading } =
    useGetPlatformStatsQuery();

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Loading platform admin dashboard...</p>
      </div>
    );
  }

  if (!currentAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-red-700 text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            Access Denied
          </h2>
          <p className="mb-4">
            You don't have platform admin access. Contact a super admin if you
            believe this is an error.
          </p>
          <Button onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleSignOut = () => {
    performLogout("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-blue-400">
          Platform Admin Dashboard - {currentAdmin.level.toUpperCase()}
        </h1>
        <div className="flex gap-4">
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-600 hover:bg-gray-700 px-6 py-2"
          >
            Back to Dashboard
          </Button>
          <Button
            onClick={handleSignOut}
            className="bg-red-600 hover:bg-red-700 px-6 py-2"
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Admin Profile Card */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-blue-700 mb-10">
        <h3 className="text-2xl font-semibold mb-3 text-blue-300">
          Platform Admin Profile
        </h3>
        <div className="mb-1">
          <b>Name:</b> {currentAdmin.name}
        </div>
        <div className="mb-1">
          <b>Email:</b> {currentAdmin.email}
        </div>
        <div className="mb-1">
          <b>Admin Level:</b>
          <span
            className={`ml-2 px-2 py-1 rounded text-sm font-semibold ${
              currentAdmin.level === "super"
                ? "bg-purple-600 text-white"
                : currentAdmin.level === "admin"
                ? "bg-blue-600 text-white"
                : "bg-green-600 text-white"
            }`}
          >
            {currentAdmin.level.toUpperCase()}
          </span>
        </div>
        <div className="mb-1">
          <b>Permissions:</b>
          <div className="flex flex-wrap gap-2 mt-2">
            {currentAdmin.permissions.map((permission) => (
              <span
                key={permission}
                className="bg-gray-700 text-blue-300 px-2 py-1 rounded text-sm"
              >
                {permission.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Statistics Overview */}
      {!statsLoading && platformStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-6 mb-10">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-blue-700">
            <h4 className="text-lg font-semibold text-blue-300 mb-2">
              Total Users
            </h4>
            <p className="text-3xl font-bold text-white">
              {platformStats.users.total}
            </p>
            <p className="text-sm text-gray-400">
              Active: {platformStats.users.active} | Pending:{" "}
              {platformStats.users.pending}
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-blue-700">
            <h4 className="text-lg font-semibold text-blue-300 mb-2">
              Organizations
            </h4>
            <p className="text-3xl font-bold text-white">
              {platformStats.organizations.total}
            </p>
            <p className="text-sm text-gray-400">
              Standard: {platformStats.organizations.standard} | LE:{" "}
              {platformStats.organizations.le_master}
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-blue-700">
            <h4 className="text-lg font-semibold text-blue-300 mb-2">
              Subscriptions
            </h4>
            <p className="text-3xl font-bold text-white">
              {platformStats.subscriptions.total}
            </p>
            <p className="text-sm text-gray-400">
              L1: {platformStats.subscriptions.l1} | L2:{" "}
              {platformStats.subscriptions.l2}
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-blue-700">
            <h4 className="text-lg font-semibold text-blue-300 mb-2">
              Platform Admins
            </h4>
            <p className="text-3xl font-bold text-white">
              {platformStats.users.platform_admins}
            </p>
            <p className="text-sm text-gray-400">
              System Uptime: {platformStats.system.uptime}s
            </p>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-blue-700">
        <h3 className="text-2xl font-semibold mb-5 text-blue-400">
          Platform Administration
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PLATFORM_ADMIN_ROUTES.map((route) => (
            <Button
              key={route.path}
              className="w-full py-4 text-left justify-start"
              onClick={() => navigate(route.path)}
            >
              {route.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-yellow-700 mt-10">
        <h3 className="text-2xl font-semibold mb-5 text-yellow-400">
          Quick Actions
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <Button
            onClick={() => navigate("/platform-admins/grant-admin")}
            className="bg-green-600 hover:bg-green-700 w-full py-3"
          >
            Grant Admin Access
          </Button>
          <Button
            onClick={() => navigate("/platform-admins/users?action=suspend")}
            className="bg-orange-600 hover:bg-orange-700 w-full py-3"
          >
            Suspend User
          </Button>
          <Button
            onClick={() => navigate("/platform-admins/activity-logs")}
            className="bg-purple-600 hover:bg-purple-700 w-full py-3"
          >
            View Recent Activity
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlatformAdminDashboard;
