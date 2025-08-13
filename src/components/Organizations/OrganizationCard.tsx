import React from 'react';
import Button from '../Common/Button';

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

const OrganizationCard: React.FC<OrganizationCardProps> = ({ 
  organization, 
  onView, 
  onRefresh 
}) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow p-6 border border-blue-700 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <div className="text-lg font-semibold text-blue-300">
          {organization.organization_name}
        </div>
        <div className="text-gray-400 text-sm">{organization.client_name}</div>
        <div className="text-xs text-gray-500">
          {organization.sector}{" "}
          {organization.website_url && (
            <>
              |{" "}
              <a
                href={organization.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-500"
              >
                {organization.website_url}
              </a>
            </>
          )}
        </div>
      </div>
      <div className="mt-2 md:mt-0 flex gap-2">
        <Button
          variant="outline"
          onClick={() => onView(organization.client_name)}
        >
          View
        </Button>
        <Button variant="ghost" onClick={onRefresh}>
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default OrganizationCard;
