import React from 'react';

interface OrganizationListHeaderProps {
  onAddOrganization: () => void;
}

const OrganizationListHeader: React.FC<OrganizationListHeaderProps> = ({ onAddOrganization }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center space-x-4">
        <div className="w-1 h-8 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full"></div>
        <h2 className="text-xl font-semibold text-white">Management Actions</h2>
      </div>
      <button
        onClick={onAddOrganization}
        className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-500 hover:to-primary-600 transition-all duration-200 font-medium cursor-pointer shadow-lg hover:shadow-xl"
      >
        Add Organization
      </button>
    </div>
  );
};

export default OrganizationListHeader;
