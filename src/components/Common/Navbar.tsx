import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';
import { performLogout } from '../../utils/cookieHelpers';

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

  const platformAdminNavItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Tier Management', path: '/tiers' },
    { label: 'User Management', path: '/platform-admins/users' },
    { label: 'Admin Management', path: '/platform-admins/admins' },
    { label: 'Platform Stats', path: '/platform-admins/stats' },
    { label: 'Activity Logs', path: '/platform-admins/activity-logs' },
  ];

  const adminNavItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Organizations', path: '/orgs' },
    { label: 'Join Requests', path: '/admin/join-requests' },
    { label: 'Invite User', path: '/admin/invite-user' },
    { label: 'Payments', path: '/payments' },
    { label: 'Invoices', path: '/invoices' },
  ];

  const userNavItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Organizations', path: '/orgs' },
    { label: 'Payments', path: '/payments' },
    { label: 'Profile', path: '/profile' },
  ];

  const getNavItems = (): NavItem[] => {
    if (isPlatformAdmin) return platformAdminNavItems;
    if (isAdmin || isLEAdmin) return adminNavItems;
    return userNavItems;
  };

  const handleLogout = () => {
    performLogout('/dashboard');
  };

  const navItems = getNavItems();
  const userRole = isPlatformAdmin ? 'Platform Admin' : isAdmin ? 'Admin' : isLEAdmin ? 'LE Admin' : 'User';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-gradient-to-r from-secondary-900 to-secondary-800 border-b border-secondary-700/50 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent hover:from-primary-300 hover:to-primary-200 transition-all duration-300 cursor-pointer"
            >
              Threat Profiling
            </button>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-secondary-300 hover:text-white hover:bg-secondary-700/50 transition-all duration-200 cursor-pointer relative group"
              >
                <span className="relative z-10">{item.label}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-primary-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-secondary-300 hover:text-white p-2 rounded-lg hover:bg-secondary-700/50 transition-all duration-200 cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Profile Menu */}
          <div className="hidden md:flex items-center relative" ref={dropdownRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-secondary-700/50 transition-all duration-200 cursor-pointer group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm group-hover:from-primary-400 group-hover:to-primary-500 transition-all duration-200">
                {(user?.user_info?.name || user?.user_info?.email || 'U').charAt(0).toUpperCase()}
              </div>
              <svg className={`w-4 h-4 text-secondary-400 transition-transform duration-200 ${showProfileDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Profile Dropdown */}
            <div className={`absolute right-0 top-full mt-2 w-72 bg-secondary-800 rounded-xl shadow-2xl border border-secondary-700/50 transition-all duration-300 transform origin-top-right ${
              showProfileDropdown ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
            }`}>
              <div className="p-4 border-b border-secondary-700/50">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {(user?.user_info?.name || user?.user_info?.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {user?.user_info?.name || 'User'}
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
                <button
                  onClick={() => {
                    navigate('/profile');
                    setShowProfileDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-secondary-300 hover:text-white hover:bg-secondary-700/50 transition-all duration-200 cursor-pointer"
                >
                  View Profile
                </button>
                <button
                  onClick={() => {
                    navigate('/settings');
                    setShowProfileDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-secondary-300 hover:text-white hover:bg-secondary-700/50 transition-all duration-200 cursor-pointer"
                >
                  Settings
                </button>
                <hr className="my-2 border-secondary-700/50" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${
        showMobileMenu ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
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

export default Navbar;