// pages/roles/RoleCreateModal.tsx
import { useState, useMemo } from "react";
import { useCreateRoleMutation } from "../../Redux/api/rolesApi";
import { useGetAllSystemPermissionsQuery } from "../../Redux/api/platformAdminApi";
import Button from "../Common/Button";
import Modal from "../Common/Modal";
import MultiSelect, { type Option } from "../Common/MultiSelect";
import type { CreateRoleDto } from "../../Redux/slices/rolesSlice";

export default function RoleCreateModal({
  onClose,
  isOpen = true,
}: {
  onClose: () => void;
  isOpen?: boolean;
}) {
  const [createRole, { isLoading }] = useCreateRoleMutation();
  const { data: permissionsData, isLoading: permissionsLoading } = useGetAllSystemPermissionsQuery();
  
  const [fields, setFields] = useState<CreateRoleDto>({
    name: "",
    description: "",
    permissions: [],
  });
  const [error, setError] = useState("");

  // Transform permissions data into options for the multiselect
  const permissionOptions: Option[] = useMemo(() => {
    if (!permissionsData?.permissions) return [];

    const options: Option[] = [];
    
    Object.entries(permissionsData.permissions).forEach(([categoryKey, category]) => {
      Object.entries(category.permissions).forEach(([permissionKey, permission]) => {
        options.push({
          value: `${categoryKey}.${permissionKey}`,
          label: `${category.category}: ${permission.name}`,
        });
      });
    });

    return options.sort((a, b) => a.label.localeCompare(b.label));
  }, [permissionsData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePermissionsChange = (selectedPermissions: string[]) => {
    setFields((prev) => ({ ...prev, permissions: selectedPermissions }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!fields.name) {
      setError("Role name is required.");
      return;
    }
    if (fields.permissions.length === 0) {
      setError("At least one permission must be selected.");
      return;
    }
    try {
      await createRole({
        name: fields.name,
        description: fields.description,
        permissions: fields.permissions,
      }).unwrap();
      onClose();
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "data" in err &&
        typeof (err as { data?: unknown }).data === "object" &&
        (err as { data?: unknown }).data !== null &&
        "message" in (err as { data: { message?: string } }).data
      ) {
        setError(
          (err as { data: { message?: string } }).data?.message ||
            "Failed to create role."
        );
      } else {
        setError("Failed to create role.");
      }
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="xl">
      <div className="text-white max-h-[80vh] overflow-visible">
        <h2 className="text-xl font-bold text-blue-300 mb-4">Create Role</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="space-y-4 overflow-visible">
            <input
              className="w-full p-2 rounded bg-gray-700 border border-blue-900 text-white placeholder-gray-400"
              name="name"
              placeholder="Role Name *"
              value={fields.name}
              onChange={handleChange}
              required
            />
            <textarea
              className="w-full p-2 rounded bg-gray-700 border border-blue-900 text-white placeholder-gray-400"
              name="description"
              placeholder="Description"
              value={fields.description}
              onChange={handleChange}
              rows={3}
            />
            
            {permissionsLoading ? (
              <div className="text-center py-4">
                <div className="text-gray-400">Loading permissions...</div>
              </div>
            ) : (
              <div className="relative z-50">
                <MultiSelect
                  id="permissions"
                  label="Permissions *"
                  options={permissionOptions}
                  values={fields.permissions}
                  onChange={handlePermissionsChange}
                  searchable={true}
                  placeholder="Select permissions..."
                  error={fields.permissions.length === 0 && error ? "At least one permission is required" : undefined}
                  required={true}
                />
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-6 pt-4">
            <Button type="submit" loading={isLoading}>
              Create Role
            </Button>
            <Button variant="ghost" type="button" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
