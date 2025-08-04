// pages/roles/RoleCreateModal.tsx
import { useState } from "react";
import { useCreateRoleMutation } from "../../Redux/api/rolesApi";
import Button from "../Common/Button";
import Modal from "../Common/Modal";

export default function RoleCreateModal({ 
  onClose, 
  isOpen = true 
}: { 
  onClose: () => void;
  isOpen?: boolean;
}) {
  const [createRole, { isLoading }] = useCreateRoleMutation();
  const [fields, setFields] = useState({
    role_id: "",
    name: "",
    description: "",
    permissions: "",
  });
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!fields.role_id || !fields.name) {
      setError("Role ID and Name are required.");
      return;
    }
    try {
      await createRole({
        role_id: fields.role_id,
        name: fields.name,
        description: fields.description,
        permissions: fields.permissions
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean),
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
    <Modal show={isOpen} onClose={onClose} size="lg">
      <div className="text-white max-h-[80vh] overflow-auto scrollbar-hide">
        <h2 className="text-xl font-bold text-blue-300 mb-4">Create Role</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="space-y-2">
          <input
            className="w-full p-2 rounded bg-gray-700 border border-blue-900"
            name="role_id"
            placeholder="Role ID *"
            value={fields.role_id}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-2 rounded bg-gray-700 border border-blue-900"
            name="name"
            placeholder="Name *"
            value={fields.name}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-2 rounded bg-gray-700 border border-blue-900"
            name="description"
            placeholder="Description"
            value={fields.description}
            onChange={handleChange}
          />
          <input
            className="w-full p-2 rounded bg-gray-700 border border-blue-900"
            name="permissions"
            placeholder="Permissions (comma-separated)"
            value={fields.permissions}
            onChange={handleChange}
          />
          </div>
          <div className="flex gap-2 mt-4">
            <Button type="submit" loading={isLoading}>
              Create
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
