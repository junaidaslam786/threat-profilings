import React from 'react';
import Button from '../Common/Button';

const UnauthenticatedView: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-blue-700 text-center">
        <h2 className="text-2xl font-bold text-blue-400 mb-4">
          Sign In Required
        </h2>
        <p className="mb-4">
          You are not signed in. Please log in to access the dashboard.
        </p>
        <Button onClick={() => (window.location.href = "/auth")}>
          Go to Login
        </Button>
      </div>
    </div>
  );
};

export default UnauthenticatedView;
