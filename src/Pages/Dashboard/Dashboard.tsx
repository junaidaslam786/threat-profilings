import React, { useState, useEffect } from "react";
import Button from "../../components/Common/Button";
import { useUser } from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { performLogout } from "../../utils/cookieHelpers";
import LoadingScreen from "../../components/Common/LoadingScreen";

const ADMIN_AND_LE_ROUTES = [
  { label: "Pending Join Requests", path: "/admin/join-requests", roles: ["admin"] },
  { label: "Invite User", path: "/admin/invite-user", roles: ["admin"] },
  { label: "Organization List", path: "/orgs", roles: ["admin", "viewer", "runner"] },
  { label: "Roles", path: "/roles", roles: ["admin", "viewer", "runner"] },
  { label: "💳 Payment Center", path: "/payments", roles: ["admin", "viewer", "runner"] },
  { label: "📄 Invoices", path: "/invoices", roles: ["admin", "viewer", "runner"] },
];

const PLATFORM_ADMIN_ROUTES = [
  { label: "Platform Dashboard", path: "/platform-admins", roles: ["platform_admin"] },
  { label: "Platform Stats", path: "/platform-admins/stats", roles: ["platform_admin"] },
  { label: "Activity Logs", path: "/platform-admins/activity-logs", roles: ["platform_admin"] },
  { label: "User Management", path: "/platform-admins/users", roles: ["platform_admin"] },
  { label: "Admin Management", path: "/platform-admins/admins", roles: ["platform_admin"] },
  { label: "Grant Admin Access", path: "/platform-admins/grant-admin", roles: ["super_admin"] },
  { label: "Subscription Management", path: "/subscriptions/create", roles: ["platform_admin"] },
  { label: "Tier Management", path: "/tiers", roles: ["platform_admin"] },
  { label: "Partner Management", path: "/partners", roles: ["platform_admin"] },
  { label: "Payment Dashboard", path: "/payment-dashboard", roles: ["platform_admin"] },
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
  const { user, isLoading, isAdmin, isLEAdmin, isPlatformAdmin, isSuperAdmin, hasBothTokens } = useUser();
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
        // Continue with default sign-in URL
      }
      setInitialLoad(false);
    };

    fetchAuthConfig();
  }, []);

  // Determine available routes based on user role
  const getAvailableRoutes = () => {
    if (isPlatformAdmin || isSuperAdmin) {
      const platformRoutes = PLATFORM_ADMIN_ROUTES.filter(route => {
        if (route.roles.includes("super_admin")) {
          return isSuperAdmin;
        }
        return true;
      });
      return [
        ...ADMIN_AND_LE_ROUTES,
        ...platformRoutes,
        { label: "Join Org Request", path: "/join-org-request", roles: ["all"] },
        { label: "Profile", path: "/profile", roles: ["all"] },
      ];
    }

    if (isAdmin || isLEAdmin) {
      return [
        ...ADMIN_AND_LE_ROUTES,
        { label: "Join Org Request", path: "/join-org-request", roles: ["all"] },
        { label: "Profile", path: "/profile", roles: ["all"] },
      ];
    }

    return USER_ROUTES;
  };

  const routes = getAvailableRoutes();

  // Show loading while initial config is loading or user data is loading
  if (initialLoad || (hasAuthToken && isLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <LoadingScreen />
      </div>
    );
  }

  // If user is not found but has both tokens, redirect to organization creation
  if (!user && hasBothTokens) {
    navigate("/user/organization/create", { replace: true });
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <LoadingScreen />
      </div>
    );
  }

  // Only show login if user doesn't have both tokens
  if (!hasBothTokens) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-blue-700 text-center">
          <h2 className="text-2xl font-bold text-blue-400 mb-4">
            Sign In Required
          </h2>
          <p className="mb-4">
            You are not signed in. Please log in to access the dashboard.
          </p>
          <Button onClick={() => (window.location.href = signInUrl)}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // Check if user exists and is not active
  if (user && !isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-yellow-700 text-center max-w-md">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">
            Awaiting Approval
          </h2>
          <p className="mb-4 text-yellow-300">
            Your account is pending approval. You will receive an email when
            your access is activated.
          </p>
          <div className="bg-gray-900 p-5 rounded-xl border border-blue-700 mb-3">
            <h3 className="text-lg text-blue-300 font-bold mb-2">
              Your Profile
            </h3>
            <div className="text-left">
              <div>
                <b>Name:</b> {user.user_info.name}
              </div>
              <div>
                <b>Email:</b> {user.user_info.email}
              </div>
              <div>
                <b>Role:</b> {user.roles_and_permissions.primary_role}
              </div>
              <div>
                <b>Organization:</b> {user.user_info.client_name}
              </div>
              <div>
                <b>Status:</b>{" "}
                <span className="text-yellow-300">{user.user_info.status}</span>
              </div>
            </div>
          </div>
          <Button onClick={() => (window.location.href = "/")}>Sign Out</Button>
        </div>
      </div>
    );
  }

  // If we don't have a user but have tokens, we're still loading
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <LoadingScreen />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-blue-400">
          Dashboard - {
            isPlatformAdmin ? "Platform Admin" : 
            isSuperAdmin ? "Super Admin" :
            isAdmin ? "Admin" : 
            isLEAdmin ? "LE Admin" : 
            "User"
          }
        </h1>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => {
              window.location.href = "/enhanced";
            }}
          >
            Enhanced
          </Button>
          <Button
            onClick={() => performLogout("/dashboard")}
            className="bg-red-600 hover:bg-red-700 px-6 py-2"
          >
            Sign Out
          </Button>
        </div>
      </div>

      <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-blue-700 max-w-2xl mx-auto mb-10">
        <h3 className="text-2xl font-semibold mb-3 text-blue-300">
          User Profile
        </h3>
        <div className="mb-1">
          <b>Name:</b> {user.user_info.name}
        </div>
        <div className="mb-1">
          <b>Email:</b> {user.user_info.email}
        </div>
        <div className="mb-1">
          <b>Role:</b> {user.roles_and_permissions.primary_role}
        </div>
        <div className="mb-1">
          <b>Organization:</b> {user.user_info.client_name}
        </div>
        <div className="mb-1">
          <b>User Type:</b> {user.user_info.user_type}
        </div>
        <div className="mb-1">
          <b>Status:</b> <span className="text-green-400">{user.user_info.status}</span>
        </div>
        
        {user.accessible_organizations.length > 1 && (
          <div className="mb-1">
            <b>Organizations:</b> 
            <div className="ml-4 mt-1">
              {user.accessible_organizations.map((org, index) => (
                <div key={index} className="text-sm text-gray-300">
                  • {org.organization_name} ({org.role})
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="text-gray-400 text-xs mt-2">
          This information is fetched securely from the backend.
        </div>
      </div>

      <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-blue-700 max-w-3xl mx-auto">
        <h3 className="text-2xl font-semibold mb-5 text-blue-400">
          {isAdmin || isLEAdmin || isPlatformAdmin || isSuperAdmin ? "Administrative Features" : "Available Features"}
        </h3>
        <ul className="grid gap-4 md:grid-cols-2">
          {routes.map((route) => (
            <li key={route.path}>
              <Button className="w-full" onClick={() => navigate(route.path)}>
                {route.label}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
