import { useParams } from "react-router-dom";
import { useGetRoleQuery } from "../../Redux/api/rolesApi";
import Button from "../../components/Common/Button";

export default function RoleDetailPage() {
  const { role_id } = useParams<{ role_id: string }>();
  const { data: role, isLoading, error } = useGetRoleQuery(role_id!);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading...
      </div>
    );
  if (error || !role)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-400">
        Role not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-xl mx-auto bg-gray-800 rounded-xl shadow-lg border border-blue-700 p-8">
        <h1 className="text-2xl font-bold text-blue-300 mb-2">{role.name}</h1>
        <div className="text-gray-400 text-sm mb-2">{role.role_id}</div>
        <div className="mb-3 text-blue-400 font-semibold">Permissions</div>
        <div className="mb-3 text-xs text-gray-300">
          {role.permissions.join(", ")}
        </div>
        <div className="mb-3 text-blue-400 font-semibold">Description</div>
        <div className="mb-3 text-xs text-gray-300">
          {role.description || "-"}
        </div>
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/roles")}
        >
          Back to Roles
        </Button>
      </div>
    </div>
  );
}
