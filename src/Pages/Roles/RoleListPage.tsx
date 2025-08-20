import { useState } from "react";
import {
  useDeleteRoleMutation,
  useGetRolesQuery,
} from "../../Redux/api/rolesApi";
import RoleCreateModal from "../../components/Roles/CreateRoleModal";
import RoleListHeader from "../../components/Roles/RoleListHeader";
import RoleList from "../../components/Roles/RoleList";
import DataState from "../../components/Common/DataState";
import Navbar from "../../components/Common/Navbar";

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
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
      <Navbar />
      
      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent mb-3">
            Roles
          </h1>
          <p className="text-secondary-300 text-lg">
            Manage user roles and permissions
          </p>
        </div>

        <RoleListHeader onCreateRole={handleCreateRole} />
        
        <DataState
          isLoading={isLoading}
          error={error}
          hasNoData={hasNoRoles}
          loadingMessage="Loading roles..."
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
