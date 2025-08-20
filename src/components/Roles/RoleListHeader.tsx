import React from 'react';

interface RoleListHeaderProps {
  onCreateRole: () => void;
}

const RoleListHeader: React.FC<RoleListHeaderProps> = ({ onCreateRole }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center space-x-4">
        <div className="w-1 h-8 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full"></div>
        <h2 className="text-xl font-semibold text-white">Management Actions</h2>
      </div>
      <button
        onClick={onCreateRole}
        className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-500 hover:to-primary-600 transition-all duration-200 font-medium cursor-pointer shadow-lg hover:shadow-xl flex items-center space-x-2"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <span>Create Role</span>
      </button>
    </div>
  );
};

export default RoleListHeader;
