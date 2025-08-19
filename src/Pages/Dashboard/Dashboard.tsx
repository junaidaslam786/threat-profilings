import React, { useState, useEffect } from "react";
import { useUser } from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import LoadingScreen from "../../components/Common/LoadingScreen";
import UserProfileCard from "../../components/Dashboard/UserProfileCard";
import Navbar from "../../components/Common/Navbar";
import UnauthenticatedView from "../../components/Dashboard/UnauthenticatedView";
import PendingApprovalView from "../../components/Dashboard/PendingApprovalView";

const ADMIN_AND_LE_ROUTES = [
  {
    label: "Pending Join Requests",
    path: "/admin/join-requests",
    roles: ["admin"],
  },
  { label: "Invite User", path: "/admin/invite-user", roles: ["admin"] },
  {
    label: "Organization List",
    path: "/orgs",
    roles: ["admin", "viewer", "runner"],
  },
  { label: "Roles", path: "/roles", roles: ["admin", "viewer", "runner"] },
  {
    label: "💳 Payment Center",
    path: "/payments",
    roles: ["admin", "viewer", "runner"],
  },
  {
    label: "📄 Invoices",
    path: "/invoices",
    roles: ["admin", "viewer", "runner"],
  },
];

const PLATFORM_ADMIN_ROUTES = [
  {
    label: "Platform Dashboard",
    path: "/platform-admins",
    roles: ["platform_admin"],
  },
  {
    label: "Platform Stats",
    path: "/platform-admins/stats",
    roles: ["platform_admin"],
  },
  {
    label: "Activity Logs",
    path: "/platform-admins/activity-logs",
    roles: ["platform_admin"],
  },
  {
    label: "User Management",
    path: "/platform-admins/users",
    roles: ["platform_admin"],
  },
  {
    label: "Admin Management",
    path: "/platform-admins/admins",
    roles: ["platform_admin"],
  },
  {
    label: "Grant Admin Access",
    path: "/platform-admins/grant-admin",
    roles: ["super_admin"],
  },
  {
    label: "Subscription Management",
    path: "/subscriptions/create",
    roles: ["platform_admin"],
  },
  { label: "Tier Management", path: "/tiers", roles: ["platform_admin"] },
  { label: "Partner Management", path: "/partners", roles: ["platform_admin"] },
  {
    label: "Payment Dashboard",
    path: "/payment-dashboard",
    roles: ["platform_admin"],
  },
  { label: "Payment Test", path: "/payment-test", roles: ["platform_admin"] },
];

const USER_ROUTES = [
  { label: "Organization List", path: "/orgs", roles: ["viewer"] },
  { label: "Roles", path: "/roles", roles: ["viewer"] },
  { label: "Tiers", path: "/tiers", roles: ["viewer"] },
  { label: "Join Org Request", path: "/join-org-request", roles: ["viewer"] },
  { label: "Profile", path: "/profile", roles: ["viewer"] },
  { label: "💳 Payment Center", path: "/payments", roles: ["viewer"] },
  { label: "📄 My Invoices", path: "/invoices", roles: ["viewer"] },
];

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

  const getAvailableRoutes = () => {
    if (isPlatformAdmin || isSuperAdmin) {
      const platformRoutes = PLATFORM_ADMIN_ROUTES.filter((route) => {
        if (route.roles.includes("super_admin")) {
          return isSuperAdmin;
        }
        return true;
      });
      return [
        ...ADMIN_AND_LE_ROUTES,
        ...platformRoutes,
        {
          label: "Join Org Request",
          path: "/join-org-request",
          roles: ["all"],
        },
        { label: "Profile", path: "/profile", roles: ["all"] },
      ];
    }

    if (isAdmin || isLEAdmin) {
      return [
        ...ADMIN_AND_LE_ROUTES,
        {
          label: "Join Org Request",
          path: "/join-org-request",
          roles: ["all"],
        },
        { label: "Profile", path: "/profile", roles: ["all"] },
      ];
    }

    return USER_ROUTES;
  };

  const routes = getAvailableRoutes();

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
          <button
            onClick={() => navigate("/orgs")}
            className="group bg-gradient-to-br from-secondary-800 to-secondary-900 p-6 rounded-xl border border-secondary-700/50 hover:border-primary-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/10 cursor-pointer text-left"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mr-4 group-hover:from-primary-400 group-hover:to-primary-500 transition-all duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary-300 group-hover:text-primary-200 transition-colors">
                  Organizations
                </h3>
                <p className="text-secondary-400">Manage your organizations</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate("/analytics")}
            className="group bg-gradient-to-br from-secondary-800 to-secondary-900 p-6 rounded-xl border border-secondary-700/50 hover:border-green-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/10 cursor-pointer text-left"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-4 group-hover:from-green-400 group-hover:to-green-500 transition-all duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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

          <button
            onClick={() => navigate("/settings")}
            className="group bg-gradient-to-br from-secondary-800 to-secondary-900 p-6 rounded-xl border border-secondary-700/50 hover:border-tertiary-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-tertiary-500/10 cursor-pointer text-left"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-tertiary-500 to-tertiary-600 rounded-lg flex items-center justify-center mr-4 group-hover:from-tertiary-400 group-hover:to-tertiary-500 transition-all duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-tertiary-400 group-hover:text-tertiary-300 transition-colors">
                  Settings
                </h3>
                <p className="text-secondary-400">Configure your account</p>
              </div>
            </div>
          </button>
        </div>

        {isPlatformAdmin && (
          <div className="mt-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-white">
                Platform Administration
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => navigate("/tiers")}
                className="group p-6 bg-gradient-to-br from-primary-600/20 to-primary-700/20 rounded-xl border border-primary-500/30 hover:border-primary-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/20 cursor-pointer text-left"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mr-4 group-hover:from-primary-400 group-hover:to-primary-500 transition-all duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">Manage Subscription Tiers</h3>
                    <p className="text-sm text-secondary-300">
                      Edit pricing and features
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate("/platform-admins/users")}
                className="group p-6 bg-gradient-to-br from-secondary-700/50 to-secondary-800/50 rounded-xl border border-secondary-600/50 hover:border-secondary-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-secondary-500/20 cursor-pointer text-left"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center mr-4 group-hover:from-secondary-400 group-hover:to-secondary-500 transition-all duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">User Management</h3>
                    <p className="text-sm text-secondary-300">Manage platform users</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate("/platform-admins")}
                className="group p-6 bg-gradient-to-br from-tertiary-600/20 to-tertiary-700/20 rounded-xl border border-tertiary-500/30 hover:border-tertiary-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-tertiary-500/20 cursor-pointer text-left"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-tertiary-500 to-tertiary-600 rounded-lg flex items-center justify-center mr-4 group-hover:from-tertiary-400 group-hover:to-tertiary-500 transition-all duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">Platform Dashboard</h3>
                    <p className="text-sm text-secondary-300">Advanced admin controls</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
