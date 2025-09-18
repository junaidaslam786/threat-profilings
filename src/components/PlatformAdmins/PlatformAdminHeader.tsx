import React from 'react';
import Button from '../Common/Button';

interface PlatformAdminHeaderProps {
  adminLevel: string;
  onBackToDashboard: () => void;
  onSignOut: () => void;
}

const PlatformAdminHeader: React.FC<PlatformAdminHeaderProps> = ({
  adminLevel,
  onBackToDashboard,
  onSignOut
}) => {
  return (
    <div className="flex justify-between items-center mb-10">
      <h1 className="text-4xl font-bold text-secondary-400">
        Platform Admin Dashboard - {adminLevel.toUpperCase()}
      </h1>
      <div className="flex gap-4">
        <Button
          onClick={onBackToDashboard}
          className="bg-gray-600 hover:bg-gray-700 px-6 py-2"
        >
          Back to Dashboard
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

export default PlatformAdminHeader;
