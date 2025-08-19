import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, showNavbar = true, className = '' }) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 ${className}`}>
      {showNavbar && <Navbar />}
      <main className={`${showNavbar ? '' : 'min-h-screen'} text-white`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;