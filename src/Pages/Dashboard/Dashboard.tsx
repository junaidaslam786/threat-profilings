import React, { useState, useEffect } from "react";
import { useUser } from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import LoadingScreen from "../../components/Common/LoadingScreen";
import UserProfileCard from "../../components/Dashboard/UserProfileCard";
import Navbar from "../../components/Common/Navbar";
import UnauthenticatedView from "../../components/Dashboard/UnauthenticatedView";
import PendingApprovalView from "../../components/Dashboard/PendingApprovalView";

const Dashboard: React.FC = () => {
  const {
    user,
    isLoading,
    isAdmin,
    isLEAdmin,
    isPlatformAdmin,
    isSuperAdmin,
    hasBothTokens,
    hydrated,
  } = useUser();
  const navigate = useNavigate();
  const [signInUrl, setSignInUrl] = useState<string>("/");
  const [initialLoad, setInitialLoad] = useState(true);

  const isActive = user?.user_info?.status === "active";
  const hasAuthToken = !!Cookies.get("id_token");

  useEffect(() => {
    const fetchAuthConfig = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/auth/config`
        );
        if (response.ok) {
          const config = await response.json();
          if (config.signInUrl) {
            setSignInUrl(config.signInUrl);
          }
        }
      } catch (error) {
        console.warn("Failed to fetch auth config:", error);
      }
      setInitialLoad(false);
    };

    fetchAuthConfig();
  }, []);

  useEffect(() => {
    if (!user && hasBothTokens && hydrated && !initialLoad && !isLoading) {
      navigate("/user/organization/create", { replace: true });
    }
  }, [user, hasBothTokens, hydrated, initialLoad, isLoading, navigate]);

  if (initialLoad || (hasAuthToken && isLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-900 text-white">
        <LoadingScreen />
      </div>
    );
  }

  if (!user && hasBothTokens && hydrated && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-900 text-white">
        <LoadingScreen />
      </div>
    );
  }

  if (!hasBothTokens) {
    return <UnauthenticatedView signInUrl={signInUrl} />;
  }

  if (user && !isActive) {
    return <PendingApprovalView user={user} />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-900 text-white">
        <LoadingScreen />
      </div>
    );
  }

  const getUserRoleDisplay = () => {
    if (isPlatformAdmin) return "Platform Admin";
    if (isSuperAdmin) return "Super Admin";
    if (isAdmin) return "Organization Admin";
    if (isLEAdmin) return "LE Master";
    return "Organization Viewer";
  };

  // Check if user has only L0 subscription (free tier)
  const subscriptions = user?.subscriptions || [];
  const isL0User =
    subscriptions.length === 1 && subscriptions[0]?.subscription_level === "L0";

  // Show subscription required view for L0 users (except platform admins)
  if (isL0User && !isPlatformAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
        <Navbar />

        <div className="max-w-4xl mx-auto p-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-1a2 2 0 00-2-2H6a2 2 0 00-2 2v1a2 2 0 002 2zM12 7a4 4 0 100 8 4 4 0 000-8z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent mb-4">
              Subscription Required
            </h1>
            <p className="text-xl text-secondary-300 mb-8">
              You're currently on the free tier. Subscribe to unlock full
              platform access.
            </p>
          </div>

          <UserProfileCard user={user} />

          <div className="mt-8 bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-8 border border-secondary-700/50 text-center">
            <h2 className="text-2xl font-bold text-primary-300 mb-4">
              Unlock Premium Features
            </h2>
            <p className="text-secondary-300 mb-6">
              Subscribe to access organizations, threat profiling, analytics,
              and more.
            </p>
            <button
              onClick={() => navigate("/payments")}
              className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
            >
              💳 Choose Your Plan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent mb-3">
            Welcome to Threat Profiling Platform
          </h1>
          <p className="text-xl text-secondary-300">
            {getUserRoleDisplay()} Dashboard
          </p>
        </div>

        <UserProfileCard user={user} />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {!isL0User && (
            <button
              onClick={() => navigate("/orgs")}
              className="group bg-gradient-to-br from-secondary-800 to-secondary-900 p-6 rounded-xl border border-secondary-700/50 hover:border-primary-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/10 cursor-pointer text-left"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mr-4 group-hover:from-primary-400 group-hover:to-primary-500 transition-all duration-300">
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
                <div>
                  <h3 className="text-lg font-semibold text-primary-300 group-hover:text-primary-200 transition-colors">
                    Organizations
                  </h3>
                  <p className="text-secondary-400">
                    Manage your organizations
                  </p>
                </div>
              </div>
            </button>
          )}

          {(isPlatformAdmin || isSuperAdmin) && (
            <button
              onClick={() => navigate("/analytics")}
              className="group bg-gradient-to-br from-secondary-800 to-secondary-900 p-6 rounded-xl border border-secondary-700/50 hover:border-green-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/10 cursor-pointer text-left"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-4 group-hover:from-green-400 group-hover:to-green-500 transition-all duration-300">
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-400 group-hover:text-green-300 transition-colors">
                    Analytics
                  </h3>
                  <p className="text-secondary-400">View threat assessments</p>
                </div>
              </div>
            </button>
          )}

          <button
            onClick={() => navigate("/profile")}
            className="group bg-gradient-to-br from-secondary-800 to-secondary-900 p-6 rounded-xl border border-secondary-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer text-left"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-4 group-hover:from-blue-400 group-hover:to-blue-500 transition-all duration-300">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">
                  Profile
                </h3>
                <p className="text-secondary-400">Manage your profile</p>
              </div>
            </div>
          </button>
        </div>

        {/* Role-based Quick Actions */}
        {!isL0User && (
          <div className="mt-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Common routes for all users */}
              <button
                onClick={() => navigate("/roles")}
                className="group p-4 bg-gradient-to-br from-secondary-700/50 to-secondary-800/50 rounded-xl border border-secondary-600/50 hover:border-primary-500/50 transition-all duration-300 cursor-pointer text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-primary-400"
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
                  <div>
                    <h3 className="font-medium text-white">Roles</h3>
                    <p className="text-xs text-secondary-400">
                      View user roles
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate(isPlatformAdmin ? "/platform-admin/payments-details" : "/payments")}
                className="group p-4 bg-gradient-to-br from-secondary-700/50 to-secondary-800/50 rounded-xl border border-secondary-600/50 hover:border-green-500/50 transition-all duration-300 cursor-pointer text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{isPlatformAdmin ? "Payment Details" : "Payments"}</h3>
                    <p className="text-xs text-secondary-400">{isPlatformAdmin ? "All user payments" : "Payment center"}</p>
                  </div>
                </div>
              </button>

              {!isPlatformAdmin && (
                <button
                  onClick={() => navigate("/invoices")}
                  className="group p-4 bg-gradient-to-br from-secondary-700/50 to-secondary-800/50 rounded-xl border border-secondary-600/50 hover:border-yellow-500/50 transition-all duration-300 cursor-pointer text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-yellow-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Invoices</h3>
                      <p className="text-xs text-secondary-400">View invoices</p>
                    </div>
                  </div>
                </button>
              )}

              {/* Admin-only routes */}
              {(isAdmin || isLEAdmin) && (
                <>
                  <button
                    onClick={() => navigate("/admin/join-requests")}
                    className="group p-4 bg-gradient-to-br from-secondary-700/50 to-secondary-800/50 rounded-xl border border-secondary-600/50 hover:border-orange-500/50 transition-all duration-300 cursor-pointer text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-orange-400"
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
                      <div>
                        <h3 className="font-medium text-white">
                          Join Requests
                        </h3>
                        <p className="text-xs text-secondary-400">
                          Pending requests
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => navigate("/admin/invite-user")}
                    className="group p-4 bg-gradient-to-br from-secondary-700/50 to-secondary-800/50 rounded-xl border border-secondary-600/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-purple-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-white">Invite User</h3>
                        <p className="text-xs text-secondary-400">
                          Send invitations
                        </p>
                      </div>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Platform Admin Section */}
      {(isPlatformAdmin || isSuperAdmin) && (
        <div className="mt-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-red-400 to-red-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-white">
              Platform Administration
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => navigate("/platform-admins")}
              className="group p-4 bg-gradient-to-br from-red-600/20 to-red-700/20 rounded-xl border border-red-500/30 hover:border-red-400/50 transition-all duration-300 cursor-pointer text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-red-400"
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
                <div>
                  <h3 className="font-medium text-white">Platform Dashboard</h3>
                  <p className="text-xs text-secondary-400">Admin controls</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate("/tiers")}
              className="group p-4 bg-gradient-to-br from-secondary-700/50 to-secondary-800/50 rounded-xl border border-secondary-600/50 hover:border-primary-500/50 transition-all duration-300 cursor-pointer text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-primary-400"
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
                <div>
                  <h3 className="font-medium text-white">Tiers</h3>
                  <p className="text-xs text-secondary-400">Manage tiers</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate("/platform-admins/users")}
              className="group p-4 bg-gradient-to-br from-secondary-700/50 to-secondary-800/50 rounded-xl border border-secondary-600/50 hover:border-blue-500/50 transition-all duration-300 cursor-pointer text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-400"
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
                <div>
                  <h3 className="font-medium text-white">Users</h3>
                  <p className="text-xs text-secondary-400">Manage users</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate("/platform-admins/partners")}
              className="group p-4 bg-gradient-to-br from-secondary-700/50 to-secondary-800/50 rounded-xl border border-secondary-600/50 hover:border-green-500/50 transition-all duration-300 cursor-pointer text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-400"
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
                <div>
                  <h3 className="font-medium text-white">Partners</h3>
                  <p className="text-xs text-secondary-400">
                    Partner management
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate("/settings")}
              className="group p-4 bg-gradient-to-br from-secondary-700/50 to-secondary-800/50 rounded-xl border border-secondary-600/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-white">Settings</h3>
                  <p className="text-xs text-secondary-400">System settings</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
