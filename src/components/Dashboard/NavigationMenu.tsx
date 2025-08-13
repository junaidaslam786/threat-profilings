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
  isAdmin?: boolean;
  isLEAdmin?: boolean;
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
    if (isAdmin || isLEAdmin) return "Administrative Features";
    return "Available Features";
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-blue-700 max-w-3xl mx-auto">
      <h3 className="text-2xl font-semibold mb-5 text-blue-400">
        {getMenuTitle()}
      </h3>
      <ul className="grid gap-4 md:grid-cols-2">
        {routes.map((route) => (
          <li key={route.path}>
            <Button 
              className="w-full" 
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
