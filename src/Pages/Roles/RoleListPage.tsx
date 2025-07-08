import { useState } from "react";
import { useDeleteRoleMutation, useGetRolesQuery } from "../../Redux/api/rolesApi";
import Button from "../../components/Common/Button";
import RoleCreateModal from "../../components/Roles/CreateRoleModal";


export default function RoleListPage() {
  const { data: roles, isLoading, error, refetch } = useGetRolesQuery();
  const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation();
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleDelete = async (role_id: string) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      await deleteRole(role_id).unwrap();
      refetch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-400">Roles</h1>
          <Button onClick={() => setShowModal(true)}>Create Role</Button>
        </div>
        {isLoading && <div className="py-8 text-center">Loading...</div>}
        {error && <div className="text-red-400 py-8 text-center">Failed to load roles.</div>}
        {!isLoading && !error && roles?.length === 0 && (
          <div className="text-center text-gray-400 py-12">No roles found.</div>
        )}
        <div className="space-y-4">
          {roles?.map((role) => (
            <div key={role.role_id} className="bg-gray-800 rounded-lg shadow p-6 border border-blue-700 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-lg font-semibold text-blue-300">{role.name}</div>
                <div className="text-gray-400 text-xs">{role.role_id}</div>
                <div className="text-xs text-gray-400">{role.description || "-"}</div>
                <div className="text-xs mt-2 text-blue-400">
                  {role.permissions.join(", ")}
                </div>
              </div>
              <div className="mt-2 md:mt-0 flex gap-2">
                <Button variant="outline" onClick={() => window.location.href = `/roles/${role.role_id}`}>
                  View
                </Button>
                <Button
                  variant="danger"
                  loading={isDeleting && deleteTarget === role.role_id}
                  onClick={() => {
                    setDeleteTarget(role.role_id);
                    handleDelete(role.role_id);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showModal && <RoleCreateModal onClose={() => { setShowModal(false); refetch(); }} />}
    </div>
  );
}
