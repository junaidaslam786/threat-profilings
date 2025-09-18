import React, { memo, useCallback } from 'react';

interface Organization {
  client_name: string;
  organization_name: string;
  sector?: string;
  website_url?: string;
}

interface OrganizationCardProps {
  organization: Organization;
  onView: (clientName: string) => void;
  onRefresh: () => void;
}

// Memoized OrganizationCard for better list performance
const OrganizationCard: React.FC<OrganizationCardProps> = memo(({ 
  organization, 
  onView, 
  onRefresh 
}) => {
  // Memoize click handler to prevent recreating on each render
  const handleView = useCallback(() => {
    onView(organization.client_name);
  }, [onView, organization.client_name]);
  return (
    <div className="group bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl shadow-xl p-6 border border-secondary-700/50 hover:border-primary-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/10">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <div className="mb-3">
            <h3 className="text-xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent mb-1">
              {organization.organization_name}
            </h3>
            <div className="text-secondary-400 text-sm font-medium">
              Client: {organization.client_name}
            </div>
          </div>
          
          <div className="space-y-2">
            {organization.sector && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-tertiary-500 rounded-full"></div>
                <span className="text-sm text-secondary-300">
                  <span className="text-secondary-400">Sector:</span> {organization.sector}
                </span>
              </div>
            )}
            
            {organization.website_url && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
                <a
                  href={organization.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-400 hover:text-primary-300 transition-colors cursor-pointer inline-flex items-center space-x-1"
                >
                  <span>{organization.website_url}</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col gap-3 lg:min-w-[140px]">
          <button
            onClick={handleView}
            className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-500 hover:to-primary-600 transition-all duration-200 font-medium cursor-pointer shadow-lg hover:shadow-xl"
          >
            View Details
          </button>
          
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white rounded-lg hover:from-secondary-500 hover:to-secondary-600 transition-all duration-200 font-medium cursor-pointer shadow-lg hover:shadow-xl"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
});

// Set display name for better debugging
OrganizationCard.displayName = 'OrganizationCard';

export default OrganizationCard;
