import React from 'react';
import Button from '../Common/Button';

interface RoleListHeaderProps {
  onCreateRole: () => void;
}

const RoleListHeader: React.FC<RoleListHeaderProps> = ({ onCreateRole }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-blue-400">Roles</h1>
      <Button onClick={onCreateRole}>Create Role</Button>
    </div>
  );
};

export default RoleListHeader;
