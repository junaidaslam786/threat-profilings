import React from 'react';

interface TierListHeaderProps {
  showCreate: boolean;
  onToggleCreate: () => void;
}

const TierListHeader: React.FC<TierListHeaderProps> = ({ 
  showCreate, 
  onToggleCreate 
}) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center space-x-4">
        <div className="w-1 h-8 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full"></div>
        <h2 className="text-xl font-semibold text-white">Management Actions</h2>
      </div>
      <button
        onClick={onToggleCreate}
        className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl ${
          showCreate 
            ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600' 
            : 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-500 hover:to-primary-600'
        }`}
      >
        {showCreate ? "Cancel" : "Create New Tier"}
      </button>
    </div>
  );
};

export default TierListHeader;
