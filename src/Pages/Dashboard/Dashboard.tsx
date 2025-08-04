import React, { useState, useEffect } from "react";
import Button from "../../components/Common/Button";
import { useUser } from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const ADMIN_AND_LE_ROUTES = [
  { label: "Pending Join Requests", path: "/admin/join-requests" },
  { label: "Invite User", path: "/admin/invite-user" },
  { label: "Organization List", path: "/orgs" },
  { label: "Roles", path: "/roles" },
  { label: "Subscriptions", path: "/subscriptions/create" },
  { label: "Tiers", path: "/tiers" },
];
const USER_ROUTES = [
  { label: "Organization List", path: "/orgs" },
  { label: "Roles", path: "/roles" },
  { label: "Tiers", path: "/tiers" },
  { label: "Join Org Request", path: "/join-org-request" },
  { label: "Profile", path: "/profile" },
];

const Dashboard: React.FC = () => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();
  const [signInUrl, setSignInUrl] = useState<string>("/");

  const role = user?.role?.toLowerCase();
  const isAdmin = role === "admin";
  const isLEAdmin = role === "le_admin";
  const isActive = user?.status?.toLowerCase() === "active";

  useEffect(() => {
    const fetchAuthConfig = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/config`);
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
    };

    fetchAuthConfig();
  }, []);

  const routes =
    isAdmin || isLEAdmin
      ? [
          ...ADMIN_AND_LE_ROUTES,
          { label: "Join Org Request", path: "/join-org-request" },
          { label: "Profile", path: "/profile" },
        ]
      : USER_ROUTES;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
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

  if (!isActive) {
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
                <b>Name:</b> {user.name}
              </div>
              <div>
                <b>Email:</b> {user.email}
              </div>
              <div>
                <b>Role:</b> {user.role}
              </div>
              <div>
                <b>Organization:</b> {user.client_name}
              </div>
              <div>
                <b>Status:</b>{" "}
                <span className="text-yellow-300">{user.status}</span>
              </div>
            </div>
          </div>
          <Button onClick={() => (window.location.href = "/")}>Sign Out</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-blue-400">
          Dashboard - {isAdmin ? "Admin" : isLEAdmin ? "LE Admin" : "Viewer"}
        </h1>
        <Button
          onClick={() => {
            Cookies.remove("id_token");
            localStorage.clear();
            sessionStorage.clear();
            window.location.reload();
          }}
          className="bg-red-600 hover:bg-red-700 px-6 py-2"
        >
          Sign Out
        </Button>
      </div>

      <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-blue-700 max-w-2xl mx-auto mb-10">
        <h3 className="text-2xl font-semibold mb-3 text-blue-300">
          User Profile
        </h3>
        <div className="mb-1">
          <b>Name:</b> {user.name}
        </div>
        <div className="mb-1">
          <b>Email:</b> {user.email}
        </div>
        <div className="mb-1">
          <b>Role:</b> {user.role}
        </div>
        <div className="mb-1">
          <b>Organization:</b> {user.client_name}
        </div>
        {user.partner_code && (
          <div className="mb-1">
            <b>Partner Code:</b> {user.partner_code}
          </div>
        )}
        <div className="mb-1">
          <b>Status:</b> <span className="text-green-400">{user.status}</span>
        </div>
        <div className="text-gray-400 text-xs mt-2">
          This information is fetched securely from the backend.
        </div>
      </div>

      <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-blue-700 max-w-3xl mx-auto">
        <h3 className="text-2xl font-semibold mb-5 text-blue-400">
          {isAdmin || isLEAdmin ? "All Features" : "Your Features"}
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
