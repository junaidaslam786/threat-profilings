import React from 'react';

interface UserProfileCardProps {
  user: {
    user_info: {
      name: string;
      email: string;
      client_name: string;
      user_type: string;
      status: string;
    };
    roles_and_permissions: {
      primary_role: string;
    };
    accessible_organizations: Array<{
      organization_name: string;
      role: string;
    }>;
  };
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
  return (
    <div className="bg-secondary-800 p-6 rounded-lg shadow-lg border border-primary-600">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mr-4">
            <span className="text-xl font-bold text-white">
              {user.user_info.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-primary-300">
              {user.user_info.name}
            </h3>
            <p className="text-secondary-400">{user.user_info.email}</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-success-600 text-white text-sm rounded-full">
          {user.user_info.status}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-secondary-700 p-4 rounded">
          <div className="text-sm text-secondary-400">Primary Role</div>
          <div className="font-semibold text-primary-300">{user.roles_and_permissions.primary_role}</div>
        </div>
        
        <div className="bg-secondary-700 p-4 rounded">
          <div className="text-sm text-secondary-400">Organization</div>
          <div className="font-semibold text-white">{user.user_info.client_name}</div>
        </div>
        
        <div className="bg-secondary-700 p-4 rounded">
          <div className="text-sm text-secondary-400">User Type</div>
          <div className="font-semibold text-tertiary-400">{user.user_info.user_type}</div>
        </div>
        
        {user.accessible_organizations.length > 0 && (
          <div className="bg-secondary-700 p-4 rounded">
            <div className="text-sm text-secondary-400">Organizations Access</div>
            <div className="font-semibold text-white">{user.accessible_organizations.length} org(s)</div>
          </div>
        )}
      </div>
      
      {user.accessible_organizations.length > 1 && (
        <div className="mt-4">
          <div className="text-sm text-secondary-400 mb-2">Organization Access:</div>
          <div className="space-y-1">
            {user.accessible_organizations.map((org, index) => (
              <div key={index} className="flex justify-between items-center text-sm bg-secondary-700 p-2 rounded">
                <span className="text-white">{org.organization_name}</span>
                <span className="text-primary-300">{org.role}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileCard;
