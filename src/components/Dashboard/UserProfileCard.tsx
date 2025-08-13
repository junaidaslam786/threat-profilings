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
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-blue-700 max-w-2xl mx-auto mb-10">
      <h3 className="text-2xl font-semibold mb-3 text-blue-300">
        User Profile
      </h3>
      <div className="mb-1">
        <b>Name:</b> {user.user_info.name}
      </div>
      <div className="mb-1">
        <b>Email:</b> {user.user_info.email}
      </div>
      <div className="mb-1">
        <b>Role:</b> {user.roles_and_permissions.primary_role}
      </div>
      <div className="mb-1">
        <b>Organization:</b> {user.user_info.client_name}
      </div>
      <div className="mb-1">
        <b>User Type:</b> {user.user_info.user_type}
      </div>
      <div className="mb-1">
        <b>Status:</b> <span className="text-green-400">{user.user_info.status}</span>
      </div>
      
      {user.accessible_organizations.length > 1 && (
        <div className="mb-1">
          <b>Organizations:</b> 
          <div className="ml-4 mt-1">
            {user.accessible_organizations.map((org, index) => (
              <div key={index} className="text-sm text-gray-300">
                • {org.organization_name} ({org.role})
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="text-gray-400 text-xs mt-2">
        This information is fetched securely from the backend.
      </div>
    </div>
  );
};

export default UserProfileCard;
