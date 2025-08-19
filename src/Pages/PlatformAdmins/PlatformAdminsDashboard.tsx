import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Common/Navbar";
import {
  useGetCurrentAdminQuery,
  useGetPlatformStatsQuery,
} from "../../Redux/api/platformAdminApi";
import LoadingScreen from "../../components/Common/LoadingScreen";

const PlatformAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    data: currentAdmin,
    isLoading: adminLoading,
    error: adminError,
  } = useGetCurrentAdminQuery();
  const { data: platformStats, isLoading: statsLoading } =
    useGetPlatformStatsQuery();

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
        <LoadingScreen />
      </div>
    );
  }

  if (adminError || !currentAdmin) {
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
              Access Denied
            </h2>
            <p className="text-secondary-300 mb-6">
              You don't have platform admin access. Contact a super admin if you
              believe this is an error.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-500 hover:to-primary-600 transition-all duration-200 cursor-pointer"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const adminRoutes = [
    {
      label: "Platform Statistics",
      path: "/platform-admins/stats",
      description: "View Platform Statistics",
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    },
    {
      label: "Activity Logs",
      path: "/platform-admins/activity-logs",
      description: "Monitor Recent Actions",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    },
    {
      label: "Admin Management",
      path: "/platform-admins/admins",
      description: "Manage Platform Admins",
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z",
    },
    {
      label: "User Management",
      path: "/platform-admins/users",
      description: "Suspend or Activate Users",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    },
    {
      label: "Partner Management",
      path: "/platform-admins/partners",
      description: "Manage Business Partners",
      icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6",
    },
    {
      label: "Partner Codes",
      path: "/platform-admins/partner-codes",
      description: "Manage Discount Codes",
      icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent mb-3">
            Platform Administration
          </h1>
          <p className="text-secondary-300 text-lg">
            Manage platform operations, users, and system settings
          </p>
        </div>

        {/* Admin Profile Card */}
        <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-8 border border-secondary-700/50 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {(currentAdmin?.admin_info.name || "A").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">
                {currentAdmin?.admin_info.name || "Platform Admin"}
              </h3>
              <p className="text-secondary-300 mb-3">
                {currentAdmin?.admin_info.email || "admin@platform.com"}
              </p>
              <div className="flex items-center space-x-3">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    currentAdmin?.admin_info.admin_level === "super"
                      ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                      : "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                  }`}
                >
                  {currentAdmin?.admin_info.admin_level?.toUpperCase() ||
                    "ADMIN"}{" "}
                  LEVEL
                </span>
                <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/30">
                  Active
                </span>
              </div>
            </div>
          </div>
          {currentAdmin?.permissions &&
            Array.isArray(currentAdmin.permissions) && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-secondary-400 mb-3">
                  Permissions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentAdmin.permissions.map((permission) => (
                    <span
                      key={permission}
                      className="px-3 py-1 bg-tertiary-600/20 text-tertiary-300 rounded-full text-sm border border-tertiary-500/30"
                    >
                      {permission.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* Platform Statistics */}
        {!statsLoading && platformStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50 hover:border-primary-500/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </div>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Total Users
              </h4>
              <p className="text-3xl font-bold text-primary-400 mb-2">
                {platformStats.users?.total || 0}
              </p>
              <p className="text-sm text-secondary-400">
                Active: {platformStats.users?.active || 0} | Pending:{" "}
                {platformStats.users?.pending || 0}
              </p>
            </div>

            <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50 hover:border-green-500/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
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
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Organizations
              </h4>
              <p className="text-3xl font-bold text-green-400 mb-2">
                {platformStats.organizations?.total || 0}
              </p>
              <p className="text-sm text-secondary-400">
                Standard: {platformStats.organizations?.standard || 0} | LE:{" "}
                {platformStats.organizations?.le_master || 0}
              </p>
            </div>

            <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50 hover:border-yellow-500/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
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
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Subscriptions
              </h4>
              <p className="text-3xl font-bold text-yellow-400 mb-2">
                {platformStats.subscriptions?.total || 0}
              </p>
              <p className="text-sm text-secondary-400">
                L1: {platformStats.subscriptions?.l1 || 0} | L2:{" "}
                {platformStats.subscriptions?.l2 || 0}
              </p>
            </div>

            <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50 hover:border-purple-500/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
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
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Platform Admins
              </h4>
              <p className="text-3xl font-bold text-purple-400 mb-2">
                {platformStats.users?.platform_admins || 0}
              </p>
              <p className="text-sm text-secondary-400">
                Uptime:{" "}
                {Math.floor(
                  (parseFloat(platformStats.system?.uptime) || 0) / 60
                )}
                m
              </p>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-8 border border-secondary-700/50 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full"></div>
            <h3 className="text-2xl font-bold text-white">
              Administration Tools
            </h3>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {adminRoutes.map((route) => (
              <button
                key={route.path}
                onClick={() => navigate(route.path)}
                className="group p-6 bg-secondary-700/30 rounded-xl border border-secondary-600/30 hover:border-primary-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/10 cursor-pointer text-left"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center group-hover:from-primary-400 group-hover:to-primary-500 transition-all duration-300">
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
                        d={route.icon}
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white group-hover:text-primary-200 transition-colors">
                      {route.label}
                    </h4>
                    <p className="text-sm text-secondary-400">
                      {route.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-8 border border-secondary-700/50">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
            <h3 className="text-2xl font-bold text-white">Quick Actions</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            <button
              onClick={() => navigate("/platform-admins/users")}
              className="group p-6 bg-gradient-to-br from-orange-600/20 to-orange-700/20 rounded-xl border border-orange-500/30 hover:border-orange-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
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
                <div className="text-left">
                  <h4 className="text-lg font-semibold text-white">
                    Manage Users
                  </h4>
                  <p className="text-sm text-secondary-400">
                    Suspend or activate users
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate("/platform-admins/partners")}
              className="group p-6 bg-gradient-to-br from-blue-600/20 to-blue-700/20 rounded-xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
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
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <h4 className="text-lg font-semibold text-white">
                    Manage Partners
                  </h4>
                  <p className="text-sm text-secondary-400">
                    Handle business partnerships
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate("/platform-admins/partner-codes")}
              className="group p-6 bg-gradient-to-br from-teal-600/20 to-teal-700/20 rounded-xl border border-teal-500/30 hover:border-teal-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/20 cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
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
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <h4 className="text-lg font-semibold text-white">
                    Partner Codes
                  </h4>
                  <p className="text-sm text-secondary-400">
                    Manage discount codes
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate("/platform-admins/activity-logs")}
              className="group p-6 bg-gradient-to-br from-purple-600/20 to-purple-700/20 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <h4 className="text-lg font-semibold text-white">
                    View Activity
                  </h4>
                  <p className="text-sm text-secondary-400">
                    Monitor recent actions
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformAdminDashboard;
