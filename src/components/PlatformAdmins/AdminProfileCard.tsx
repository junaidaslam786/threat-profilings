import React from 'react';

interface AdminProfile {
  name: string;
  email: string;
  level: string;
}

interface AdminProfileCardProps {
  admin: AdminProfile;
}

const AdminProfileCard: React.FC<AdminProfileCardProps> = ({ admin }) => {
  const getLevelStyle = (level: string) => {
    switch (level) {
      case 'super':
        return 'bg-purple-600 text-white';
      case 'admin':
        return 'bg-secondary-600 text-white';
      default:
        return 'bg-green-600 text-white';
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-secondary-700 mb-10">
      <h3 className="text-2xl font-semibold mb-3 text-secondary-300">
        Platform Admin Profile
      </h3>
      <div className="mb-1">
        <b>Name:</b> {admin.name}
      </div>
      <div className="mb-1">
        <b>Email:</b> {admin.email}
      </div>
      <div className="mb-1">
        <b>Admin Level:</b>
        <span
          className={`ml-2 px-2 py-1 rounded text-sm font-semibold ${getLevelStyle(admin.level)}`}
        >
          {admin.level.toUpperCase()}
        </span>
      </div>
    </div>
  );
};

export default AdminProfileCard;
