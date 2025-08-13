import React from 'react';
import Button from '../Common/Button';

interface OrganizationListHeaderProps {
  onAddOrganization: () => void;
}

const OrganizationListHeader: React.FC<OrganizationListHeaderProps> = ({ onAddOrganization }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-blue-400">Organizations</h1>
      <Button onClick={onAddOrganization}>Add Organization</Button>
    </div>
  );
};

export default OrganizationListHeader;
