import { useState } from "react";
import {
  useDeleteRoleMutation,
  useGetRolesQuery,
} from "../../Redux/api/rolesApi";
import RoleCreateModal from "../../components/Roles/CreateRoleModal";
import RoleListHeader from "../../components/Roles/RoleListHeader";
import RoleList from "../../components/Roles/RoleList";
import DataState from "../../components/Common/DataState";

export default function RoleListPage() {
  const { data: roles, isLoading, error, refetch } = useGetRolesQuery();
  const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation();
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const hasNoRoles = !isLoading && !error && (!roles || roles.length === 0);

  const handleDelete = async (role_id: string) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      setDeleteTarget(role_id);
      await deleteRole(role_id).unwrap();
      refetch();
      setDeleteTarget(null);
    }
  };

  const handleViewRole = (roleId: string) => {
    window.location.href = `/roles/${roleId}`;
  };

  const handleCreateRole = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <RoleListHeader onCreateRole={handleCreateRole} />
        
        <DataState
          isLoading={isLoading}
          error={error}
          hasNoData={hasNoRoles}
          loadingMessage="Loading..."
          errorMessage="Failed to load roles."
          noDataMessage="No roles found."
        />
        
        {!isLoading && !error && roles && roles.length > 0 && (
          <RoleList
            roles={roles}
            onViewRole={handleViewRole}
            onDeleteRole={handleDelete}
            isDeleting={isDeleting}
            deleteTarget={deleteTarget}
          />
        )}
      </div>
      
      {showModal && (
        <RoleCreateModal onClose={handleCloseModal} />
      )}
    </div>
  );
}
