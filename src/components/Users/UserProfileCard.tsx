import React from 'react';

export interface UserProfile {
  user_info: {
    name: string;
    email: string;
    client_name?: string;
    status: string;
    created_at: string;
  };
  roles_and_permissions: {
    primary_role: string;
  };
  ui_config: {
    sections: {
      partner_codes?: string;
    };
  };
}

interface UserProfileCardProps {
  profile: UserProfile;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ profile }) => {
  return (
    <div className="bg-gray-800 p-8 rounded-xl border border-blue-700 w-full max-w-md shadow-lg">
      <h2 className="text-2xl font-bold text-blue-300 mb-4">Profile</h2>
      <div className="space-y-2">
        <div>
          <span className="text-blue-400">Name:</span> {profile.user_info.name}
        </div>
        <div>
          <span className="text-blue-400">Email:</span> {profile.user_info.email}
        </div>
        <div>
          <span className="text-blue-400">Organization:</span>{" "}
          {profile.user_info.client_name || "-"}
        </div>
        <div>
          <span className="text-blue-400">Role:</span> {profile.roles_and_permissions.primary_role}
        </div>
        <div>
          <span className="text-blue-400">Status:</span> {profile.user_info.status}
        </div>
        <div>
          <span className="text-blue-400">Partner Code:</span>{" "}
          {profile.ui_config.sections.partner_codes || "-"}
        </div>
        <div>
          <span className="text-blue-400">Created:</span> {new Date(profile.user_info.created_at).toDateString()}
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
