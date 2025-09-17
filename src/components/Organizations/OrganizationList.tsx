import React, { memo } from 'react';
import OrganizationCard from './OrganizationCard';

interface Organization {
  client_name: string;
  organization_name: string;
  sector?: string;
  website_url?: string;
}

interface OrganizationListProps {
  organizations: Organization[];
  onViewOrganization: (clientName: string) => void;
  onRefresh: () => void;
}

// Memoized OrganizationList for better performance
const OrganizationList: React.FC<OrganizationListProps> = memo(({ 
  organizations, 
  onViewOrganization, 
  onRefresh 
}) => {
  return (
    <div className="space-y-4">
      {organizations.map((org) => (
        <OrganizationCard
          key={org.client_name}
          organization={org}
          onView={onViewOrganization}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
});

// Set display name for better debugging
OrganizationList.displayName = 'OrganizationList';

export default OrganizationList;
