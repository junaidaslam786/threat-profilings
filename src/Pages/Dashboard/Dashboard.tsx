import React, { useState, useEffect } from "react";
import { useUser } from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { performLogout } from "../../utils/cookieHelpers";
import LoadingScreen from "../../components/Common/LoadingScreen";
import DashboardHeader from "../../components/Dashboard/DashboardHeader";
import UserProfileCard from "../../components/Dashboard/UserProfileCard";
import NavigationMenu from "../../components/Dashboard/NavigationMenu";
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
        // Continue with default sign-in URL
      }
      setInitialLoad(false);
    };

    fetchAuthConfig();
  }, []);

  useEffect(() => {
    if (!user && hasBothTokens && hydrated && !initialLoad && !isLoading) {
      console.log("Debug - Redirecting to organization creation page", {
        user: !!user,
        hasBothTokens,
        hydrated,
        initialLoad,
        isLoading,
      });
      navigate("/user/organization/create", { replace: true });
    }
  }, [user, hasBothTokens, hydrated, initialLoad, isLoading, navigate]);

  // Determine available routes based on user role
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <LoadingScreen />
      </div>
    );
  }

  if (!user && hasBothTokens && hydrated && !isLoading) {
    console.log("Debug - User not found but has tokens, showing loading", {
      user: !!user,
      hasBothTokens,
      hydrated,
      isLoading,
    });
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <LoadingScreen />
      </div>
    );
  }

  const getUserRoleDisplay = () => {
    if (isPlatformAdmin) return "Platform Admin";
    if (isSuperAdmin) return "Super Admin";
    if (isAdmin) return "Admin";
    if (isLEAdmin) return "LE Admin";
    return "User";
  };

  const handleEnhancedClick = () => {
    window.location.href = "/enhanced";
  };

  const handleSignOut = () => {
    performLogout("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <DashboardHeader
        userRole={getUserRoleDisplay()}
        onEnhancedClick={handleEnhancedClick}
        onSignOut={handleSignOut}
      />

      <UserProfileCard user={user} />

      <NavigationMenu
        routes={routes}
        onNavigate={navigate}
        isAdmin={isAdmin}
        isLEAdmin={isLEAdmin}
        isPlatformAdmin={isPlatformAdmin}
        isSuperAdmin={isSuperAdmin}
      />
    </div>
  );
};

export default Dashboard;
