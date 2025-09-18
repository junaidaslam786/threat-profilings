import React from 'react';
import Button from '../Common/Button';

interface DashboardHeaderProps {
  userRole: string;
  onEnhancedClick: () => void;
  onSignOut: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userRole,
  onEnhancedClick,
  onSignOut
}) => {
  return (
    <div className="flex justify-between items-center mb-10">
      <h1 className="text-4xl font-bold text-secondary-400">
        Dashboard - {userRole}
      </h1>
      <div className="flex items-center gap-4">
        <Button onClick={onEnhancedClick}>
          Enhanced
        </Button>
        <Button
          onClick={onSignOut}
          className="bg-red-600 hover:bg-red-700 px-6 py-2"
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
