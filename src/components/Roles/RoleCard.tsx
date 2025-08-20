import React from 'react';

interface Role {
  role_id: string;
  name: string;
  description?: string;
  permissions: string[];
}

interface RoleCardProps {
  role: Role;
  onView: (roleId: string) => void;
  onDelete: (roleId: string) => void;
  isDeleting: boolean;
  deleteTarget: string | null;
}

const RoleCard: React.FC<RoleCardProps> = ({
  role,
  onView,
  onDelete,
  isDeleting,
  deleteTarget
}) => {
  return (
    <div className="bg-gradient-to-r from-secondary-800/50 to-secondary-700/30 backdrop-blur-sm rounded-xl p-6 border border-secondary-600/30 hover:border-primary-500/30 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              {role.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-primary-300 transition-colors">
                {role.name}
              </h3>
              <p className="text-secondary-400 text-sm">{role.role_id}</p>
            </div>
          </div>
          
          {role.description && (
            <p className="text-secondary-300 text-sm mb-4">
              {role.description}
            </p>
          )}
          
          <div className="mb-4">
            <h4 className="text-primary-400 text-sm font-medium mb-2">Permissions</h4>
            <div className="flex flex-wrap gap-2">
              {role.permissions.slice(0, 3).map((permission, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-xs font-medium border border-primary-500/30"
                >
                  {permission}
                </span>
              ))}
              {role.permissions.length > 3 && (
                <span className="px-3 py-1 bg-secondary-600/50 text-secondary-300 rounded-full text-xs font-medium border border-secondary-500/30">
                  +{role.permissions.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2 ml-4">
          <button
            onClick={() => onView(role.role_id)}
            className="px-4 py-2 bg-primary-600/20 text-primary-300 rounded-lg hover:bg-primary-500/30 transition-colors border border-primary-500/30 hover:border-primary-400/50 text-sm font-medium"
          >
            View Details
          </button>
          <button
            onClick={() => onDelete(role.role_id)}
            disabled={isDeleting && deleteTarget === role.role_id}
            className="px-4 py-2 bg-red-600/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/30 hover:border-red-400/50 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting && deleteTarget === role.role_id ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-red-300 border-t-transparent rounded-full animate-spin"></div>
                <span>Deleting...</span>
              </div>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleCard;
