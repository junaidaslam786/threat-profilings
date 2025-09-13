import React from 'react';
import Navbar from './Navbar';
import ThreatProfilingSidebar from './ThreatProfilingSidebar';
import { useUser } from '../../hooks/useUser';

interface ThreatProfilingLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  showSidebar?: boolean;
  className?: string;
}

const ThreatProfilingLayout: React.FC<ThreatProfilingLayoutProps> = ({ 
  children, 
  showNavbar = true, 
  showSidebar = true,
  className = '' 
}) => {
  const { isPlatformAdmin, isSuperAdmin } = useUser();
  
  // Show sidebar for all users except platform admins and super admins
  // LEAdmins and standard admins should have access to the sidebar
  const shouldShowSidebar = showSidebar && !isPlatformAdmin && !isSuperAdmin;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 ${className}`}>
      {showNavbar && <Navbar />}
      <div className="flex h-screen">
        {shouldShowSidebar && <ThreatProfilingSidebar />}
        <main className={`flex-1 overflow-auto ${showNavbar ? 'h-[calc(100vh-4rem)]' : 'h-screen'} text-white`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default ThreatProfilingLayout;