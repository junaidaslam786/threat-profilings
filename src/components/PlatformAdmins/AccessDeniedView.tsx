import React from 'react';
import Button from '../Common/Button';

interface AccessDeniedViewProps {
  onGoToDashboard: () => void;
}

const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({ onGoToDashboard }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-red-700 text-center">
        <h2 className="text-2xl font-bold text-red-400 mb-4">
          Access Denied
        </h2>
        <p className="mb-4">
          You don't have platform admin access. Contact a super admin if you
          believe this is an error.
        </p>
        <Button onClick={onGoToDashboard}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default AccessDeniedView;
