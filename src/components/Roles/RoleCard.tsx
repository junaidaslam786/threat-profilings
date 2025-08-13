import React from 'react';
import Button from '../Common/Button';

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
    <div className="bg-gray-800 rounded-lg shadow p-6 border border-blue-700 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <div className="text-lg font-semibold text-blue-300">
          {role.name}
        </div>
        <div className="text-gray-400 text-xs">{role.role_id}</div>
        <div className="text-xs text-gray-400">
          {role.description || "-"}
        </div>
        <div className="text-xs mt-2 text-blue-400">
          {role.permissions.join(", ")}
        </div>
      </div>
      <div className="mt-2 md:mt-0 flex gap-2">
        <Button
          variant="outline"
          onClick={() => onView(role.role_id)}
        >
          View
        </Button>
        <Button
          variant="danger"
          loading={isDeleting && deleteTarget === role.role_id}
          onClick={() => onDelete(role.role_id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default RoleCard;
