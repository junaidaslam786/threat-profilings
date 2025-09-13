import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  description: string;
}

interface ThreatProfilingSidebarProps {
  className?: string;
}

const ThreatProfilingSidebar: React.FC<ThreatProfilingSidebarProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems: SidebarItem[] = [
    {
      id: 'organization-details',
      label: 'Organization Details',
      path: '/home',
      icon: 'building',
      description: 'Organization information and overview'
    },
    {
      id: 'target',
      label: 'Target',
      path: '/threat-profiling/target',
      icon: 'target',
      description: 'Organization and application details'
    },
    {
      id: 'intro',
      label: 'Intro',
      path: '/threat-profiling/intro',
      icon: 'info',
      description: 'Introduction and overview'
    },
    {
      id: 'threat-actor',
      label: 'Threat Actor',
      path: '/threat-profiling/threat-actor',
      icon: 'user-x',
      description: 'Potential threat actors and adversaries'
    },
    {
      id: 'threats',
      label: 'Threats',
      path: '/threat-profiling/threats',
      icon: 'alert-triangle',
      description: 'Tactics, Techniques, and Procedures (TTPs)'
    },
    {
      id: 'detection',
      label: 'Detection',
      path: '/threat-profiling/detection',
      icon: 'eye',
      description: 'Detection methods and monitoring'
    },
    {
      id: 'compliance-ism',
      label: 'Compliance: ISM',
      path: '/threat-profiling/compliance-ism',
      icon: 'shield-check',
      description: 'Information Security Manual compliance'
    },
    {
      id: 'compliance-e8',
      label: 'Compliance: E8',
      path: '/threat-profiling/compliance-e8',
      icon: 'clipboard-check',
      description: 'Essential Eight compliance framework'
    }
  ];

  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactElement } = {
      building: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6m-6 4h6" />
        </svg>
      ),
      target: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      info: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'user-x': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      'alert-triangle': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      eye: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      'shield-check': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      'clipboard-check': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    };
    return iconMap[iconName] || iconMap.info;
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className={`w-64 bg-secondary-800 border-r border-secondary-700/50 flex flex-col ${className}`}>
      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-auto">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-start p-3 rounded-lg transition-all duration-200 text-left group ${
              isActive(item.path)
                ? 'bg-primary-600/20 text-primary-300 border border-primary-500/30'
                : 'text-secondary-300 hover:text-white hover:bg-secondary-700/50 border border-transparent'
            }`}
          >
            <div className={`mr-3 mt-0.5 ${
              isActive(item.path) 
                ? 'text-primary-400' 
                : 'text-secondary-400 group-hover:text-primary-400'
            }`}>
              {getIcon(item.icon)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium mb-1">{item.label}</div>
              <div className="text-xs text-secondary-500 group-hover:text-secondary-400 leading-relaxed">
                {item.description}
              </div>
            </div>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default ThreatProfilingSidebar;