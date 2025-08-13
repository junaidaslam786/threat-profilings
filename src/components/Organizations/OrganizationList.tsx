import React from 'react';
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

const OrganizationList: React.FC<OrganizationListProps> = ({ 
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
};

export default OrganizationList;
