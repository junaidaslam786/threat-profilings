import React from 'react';
import LoadingScreen from '../Common/LoadingScreen';

interface OrganizationListStateProps {
  isLoading: boolean;
  error: unknown;
  hasNoOrganizations: boolean;
}

const OrganizationListState: React.FC<OrganizationListStateProps> = ({ 
  isLoading, 
  error, 
  hasNoOrganizations 
}) => {
  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-400">
        Failed to load organizations.
      </div>
    );
  }

  if (hasNoOrganizations) {
    return (
      <div className="text-center text-gray-400 py-12">
        No organizations found.
      </div>
    );
  }

  return null;
};

export default OrganizationListState;
