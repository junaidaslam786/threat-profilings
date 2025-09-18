import React from 'react';
import Button from '../Common/Button';

interface Route {
  label: string;
  path: string;
  roles: string[];
}

interface NavigationMenuProps {
  routes: Route[];
  onNavigate: (path: string) => void;
  isAdmin?: boolean; // Legacy compatibility - maps to isOrgAdmin
  isLEAdmin?: boolean; // Legacy compatibility - maps to isLEMaster
  isPlatformAdmin?: boolean;
  isSuperAdmin?: boolean;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ 
  routes, 
  onNavigate, 
  isAdmin, 
  isLEAdmin, 
  isPlatformAdmin, 
  isSuperAdmin 
}) => {
  const getMenuTitle = () => {
    if (isPlatformAdmin) return "Platform Administrative Features";
    if (isSuperAdmin) return "Super Administrative Features";
    if (isAdmin) return "Organization Administrative Features";
    if (isLEAdmin) return "LE Master Features";
    return "Available Features";
  };

  const getMenuDescription = () => {
    if (isPlatformAdmin) return "Platform-level operations, user management, and system configuration";
    if (isSuperAdmin) return "Super administrator functions with elevated access";
    if (isAdmin) return "Manage your organization, users, and threat profiling operations";
    if (isLEAdmin) return "Manage multiple organizations and enterprise-level operations";
    return "View reports and access available features for your organization";
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-secondary-700 max-w-3xl mx-auto">
      <h3 className="text-2xl font-semibold mb-2 text-secondary-400">
        {getMenuTitle()}
      </h3>
      <p className="text-gray-400 text-sm mb-6">
        {getMenuDescription()}
      </p>
      <ul className="grid gap-4 md:grid-cols-2">
        {routes.map((route) => (
          <li key={route.path}>
            <Button 
              className="w-full justify-start text-left" 
              onClick={() => onNavigate(route.path)}
            >
              {route.label}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NavigationMenu;
