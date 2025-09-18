import React from 'react';
import Button from '../Common/Button';
import { performLogout } from '../../utils/authStorage';

interface PendingApprovalViewProps {
  user: {
    user_info: {
      name: string;
      email: string;
      client_name: string;
      status: string;
    };
    roles_and_permissions: {
      primary_role: string;
    };
  };
}

const PendingApprovalView: React.FC<PendingApprovalViewProps> = ({ user }) => {
  const handleSignOut = () => {
    performLogout("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-yellow-700 text-center max-w-md">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">
          Awaiting Approval
        </h2>
        <p className="mb-4 text-yellow-300">
          Your account is pending approval. You will receive an email when
          your access is activated.
        </p>
        <div className="bg-gray-900 p-5 rounded-xl border border-secondary-700 mb-3">
          <h3 className="text-lg text-secondary-300 font-bold mb-2">
            Your Profile
          </h3>
          <div className="text-left">
            <div>
              <b>Name:</b> {user.user_info.name}
            </div>
            <div>
              <b>Email:</b> {user.user_info.email}
            </div>
            <div>
              <b>Role:</b> {user.roles_and_permissions.primary_role}
            </div>
            <div>
              <b>Organization:</b> {user.user_info.client_name}
            </div>
            <div>
              <b>Status:</b>{" "}
              <span className="text-yellow-300">{user.user_info.status}</span>
            </div>
          </div>
        </div>
        <Button onClick={handleSignOut}>Sign Out</Button>
      </div>
    </div>
  );
};

export default PendingApprovalView;
