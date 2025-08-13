import React from 'react';
import RoleCard from './RoleCard';

interface Role {
  role_id: string;
  name: string;
  description?: string;
  permissions: string[];
}

interface RoleListProps {
  roles: Role[];
  onViewRole: (roleId: string) => void;
  onDeleteRole: (roleId: string) => void;
  isDeleting: boolean;
  deleteTarget: string | null;
}

const RoleList: React.FC<RoleListProps> = ({
  roles,
  onViewRole,
  onDeleteRole,
  isDeleting,
  deleteTarget
}) => {
  return (
    <div className="space-y-4">
      {roles.map((role) => (
        <RoleCard
          key={role.role_id}
          role={role}
          onView={onViewRole}
          onDelete={onDeleteRole}
          isDeleting={isDeleting}
          deleteTarget={deleteTarget}
        />
      ))}
    </div>
  );
};

export default RoleList;
