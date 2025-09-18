import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  memo,
} from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { performLogout } from "../../utils/authStorage";
import Image from "/assets/logo.png";

interface NavItem {
  label: string;
  path: string;
}

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, isPlatformAdmin, isAdmin, isLEAdmin } = useUser();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Memoize static nav items for better performance
  const adminNavItems: NavItem[] = useMemo(
    () => [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Organizations", path: "/orgs" },
      { label: "Join Requests", path: "/admin/join-requests" },
      { label: "Invite User", path: "/admin/invite-user" },
      { label: "Payments", path: "/payments" },
      { label: "Invoices", path: "/invoices" },
    ],
    []
  );

  const platformAdminPaymentsNavItems: NavItem[] = useMemo(
    () => [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Platform Stats", path: "/platform-admins/stats" },
      { label: "Activity Logs", path: "/platform-admins/activity-logs" },
      { label: "Payment Details", path: "/platform-admin/payments-details" },
    ],
    []
  );

  const userNavItems: NavItem[] = useMemo(
    () => [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Organizations", path: "/orgs" },
      { label: "Payments", path: "/payments" },
      { label: "Profile", path: "/profile" },
    ],
    []
  );

  const getNavItems = useCallback((): NavItem[] => {
    if (isPlatformAdmin) return platformAdminPaymentsNavItems;

    // Check if user has only L0 subscription (free tier) - restrict access
    const subscriptions = user?.subscriptions || [];
    const isL0User =
      subscriptions.length === 1 &&
      subscriptions[0]?.subscription_level === "L0";

    if (isL0User && !isPlatformAdmin) {
      return [{ label: "Profile", path: "/profile" }];
    }

    if (isAdmin || isLEAdmin) return adminNavItems;
    return userNavItems;
  }, [
    isPlatformAdmin,
    user?.subscriptions,
    isAdmin,
    isLEAdmin,
    adminNavItems,
    platformAdminPaymentsNavItems,
    userNavItems,
  ]);

  const handleLogout = useCallback(() => {
    performLogout("/auth");
  }, []);

  // Memoize nav items calculation for better performance
  const navItems = useMemo(() => getNavItems(), [getNavItems]);

  // Memoize user role calculation
  const userRole = useMemo(
    () =>
      isPlatformAdmin
        ? "Platform Admin"
        : isAdmin
        ? "Admin"
        : isLEAdmin
        ? "LE Admin"
        : "User",
    [isPlatformAdmin, isAdmin, isLEAdmin]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-gradient-to-r from-secondary-900 to-secondary-800 border-b border-secondary-700/50 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={() =>
                navigate(isPlatformAdmin ? "/platform-admins" : "/")
              }
              className="cursor-pointer"
            >
              <img src={Image} alt="Logo" className="h-8" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-secondary-300 hover:text-white p-2 rounded-lg hover:bg-secondary-700/50 transition-all duration-200 cursor-pointer"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Profile Menu */}
          <div
            className="hidden md:flex items-center relative"
            ref={dropdownRef}
          >
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-secondary-700/50 transition-all duration-200 cursor-pointer group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm group-hover:from-primary-400 group-hover:to-primary-500 transition-all duration-200">
                {(user?.user_info?.name || user?.user_info?.email || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>
              <svg
                className={`w-4 h-4 text-secondary-400 transition-transform duration-200 ${
                  showProfileDropdown ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Profile Dropdown */}
            <div
              className={`absolute right-0 top-full mt-2 w-72 bg-secondary-800 rounded-xl shadow-2xl border border-secondary-700/50 transition-all duration-300 transform origin-top-right ${
                showProfileDropdown
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              }`}
            >
              <div className="p-4 border-b border-secondary-700/50">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {(user?.user_info?.name || user?.user_info?.email || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {user?.user_info?.name || "User"}
                    </div>
                    <div className="text-sm text-secondary-400">
                      {user?.user_info?.email}
                    </div>
                    <div className="text-xs px-2 py-1 bg-primary-600/20 text-primary-300 rounded-full mt-1 inline-block">
                      {userRole}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-2">
                {/* Navigation items for all users */}
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-secondary-300 hover:text-white hover:bg-secondary-700/50 transition-all duration-200 cursor-pointer flex items-center gap-3"
                  >
                    <svg
                      className="w-4 h-4 text-primary-400"
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
                    {item.label}
                  </button>
                ))}

                {/* Platform Admin Management Links */}
                {isPlatformAdmin && (
                  <>
                    <hr className="my-2 border-secondary-700/50" />
                    <div className="px-3 py-2 text-xs font-semibold text-secondary-400 uppercase tracking-wider">
                      Management
                    </div>
                    <button
                      onClick={() => {
                        navigate("/tiers");
                        setShowProfileDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-secondary-300 hover:text-white hover:bg-secondary-700/50 transition-all duration-200 cursor-pointer flex items-center gap-3"
                    >
                      <svg
                        className="w-4 h-4 text-primary-400"
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
                      Tier Management
                    </button>
                    <button
                      onClick={() => {
                        navigate("/platform-admins/users");
                        setShowProfileDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-secondary-300 hover:text-white hover:bg-secondary-700/50 transition-all duration-200 cursor-pointer flex items-center gap-3"
                    >
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
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        />
                      </svg>
                      User Management
                    </button>
                    <button
                      onClick={() => {
                        navigate("/platform-admins/admins");
                        setShowProfileDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-secondary-300 hover:text-white hover:bg-secondary-700/50 transition-all duration-200 cursor-pointer flex items-center gap-3"
                    >
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
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      Admin Management
                    </button>
                  </>
                )}

                <hr className="my-2 border-secondary-700/50" />

                <button
                  onClick={() => {
                    navigate("/profile");
                    setShowProfileDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-secondary-300 hover:text-white hover:bg-secondary-700/50 transition-all duration-200 cursor-pointer flex items-center gap-3"
                >
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  View Profile
                </button>
                <button
                  onClick={() => {
                    navigate("/settings");
                    setShowProfileDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-secondary-300 hover:text-white hover:bg-secondary-700/50 transition-all duration-200 cursor-pointer flex items-center gap-3"
                >
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
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Settings
                </button>
                <hr className="my-2 border-secondary-700/50" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 cursor-pointer flex items-center gap-3"
                >
                  <svg
                    className="w-4 h-4 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          showMobileMenu ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-2 bg-secondary-800/50 backdrop-blur-sm">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setShowMobileMenu(false);
              }}
              className="w-full text-left px-4 py-3 rounded-lg text-secondary-300 hover:text-white hover:bg-secondary-700/50 transition-all duration-200 cursor-pointer"
            >
              {item.label}
            </button>
          ))}
          <hr className="my-2 border-secondary-700/50" />
          <div className="px-4 py-2">
            <div className="text-sm text-secondary-400 mb-1">
              {user?.user_info?.name || user?.user_info?.email}
            </div>
            <div className="text-xs px-2 py-1 bg-primary-600/20 text-primary-300 rounded-full inline-block mb-2">
              {userRole}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default memo(Navbar);
