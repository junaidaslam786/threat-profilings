// src/pages/PlatformAdmin/UserManagement.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Common/Button";
import Modal from "../../components/Common/Modal";
import Input from "../../components/Common/InputField";
import TextArea from "../../components/Common/TextArea";
import {
  useListPlatformAdminsQuery,
  useSuspendUserMutation,
  useActivateUserMutation,
  useDeleteUserMutation,
} from "../../Redux/api/platformAdminApi";
import { toast } from "react-hot-toast";
import type { PlatformAdminUser } from "../../Redux/slices/platformAdminSlice";

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const {
    data: usersResponse,
    isLoading,
    error,
    refetch,
  } = useListPlatformAdminsQuery();

  const [suspendUser] = useSuspendUserMutation();
  const [activateUser] = useActivateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [userToSuspend, setUserToSuspend] = useState<PlatformAdminUser | null>(
    null
  );
  const [suspendReason, setSuspendReason] = useState("");
  const [suspendDuration, setSuspendDuration] = useState(""); // e.g., "7d", "30d", "permanent"

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<PlatformAdminUser | null>(
    null
  );
  const [forceDelete, setForceDelete] = useState(false);

  const handleSuspendClick = (user: PlatformAdminUser) => {
    setUserToSuspend(user);
    setShowSuspendModal(true);
  };

  const handleActivateClick = async (user: PlatformAdminUser) => {
    if (
      window.confirm(`Are you sure you want to activate user ${user.email}?`)
    ) {
      try {
        await activateUser({ email: user.email }).unwrap();
        toast.success(`Successfully activated user ${user.email}`);
        refetch();
      } catch (err: unknown) {
        const errorMessage =
          typeof err === "string"
            ? err
            : (err as { data?: { message?: string } }).data?.message ||
              "Failed to activate user.";
        toast.error(errorMessage);
      }
    }
  };

  const handleDeleteClick = (user: PlatformAdminUser) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmSuspendUser = async () => {
    if (userToSuspend) {
      try {
        await suspendUser({
          email: userToSuspend.email,
          reason: suspendReason,
          duration: suspendDuration || undefined,
        }).unwrap();
        toast.success(`Successfully suspended user ${userToSuspend.email}`);
        setShowSuspendModal(false);
        setUserToSuspend(null);
        setSuspendReason("");
        setSuspendDuration("");
        refetch();
      } catch (err: unknown) {
        const errorMessage =
          typeof err === "string"
            ? err
            : (err as { data?: { message?: string } }).data?.message ||
              "Failed to suspend user.";
        toast.error(errorMessage);
      }
    }
  };

  const confirmDeleteUser = async () => {
    if (userToDelete) {
      try {
        await deleteUser({
          email: userToDelete.email,
          force: forceDelete,
        }).unwrap();
        toast.success(`Successfully deleted user ${userToDelete.email}`);
        setShowDeleteModal(false);
        setUserToDelete(null);
        setForceDelete(false);
        refetch();
      } catch (err: unknown) {
        const errorMessage =
          typeof err === "string"
            ? err
            : (err as { data?: { message?: string } }).data?.message ||
              "Failed to delete user.";
        toast.error(errorMessage);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Loading user list...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-red-700 text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            Error Loading User List
          </h2>
          <p className="mb-4">Failed to load platform users.</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => refetch()}>Retry</Button>
            <Button
              onClick={() => navigate("/super-admin")}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // IMPORTANT: This 'admins' variable should come from useListUsersQuery
  const users = usersResponse?.admins || []; // Using admins as placeholder for users

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-blue-400">User Management</h1>
        <div className="flex gap-4">
          <Button
            onClick={() => refetch()}
            className="bg-green-600 hover:bg-green-700"
          >
            Refresh Users
          </Button>
          <Button
            onClick={() => navigate("/super-admin")}
            className="bg-gray-600 hover:bg-gray-700"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>

      <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-blue-700">
        {users.length === 0 ? (
          <p className="text-center text-gray-400">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Status (Placeholder)
                  </th>{" "}
                  {/* You'll need an actual status field */}
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Last Login
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {users.map((user: PlatformAdminUser) => (
                  // Here, you would iterate over your actual user list
                  // The PlatformAdminUser type has fields like created_at, last_login
                  // You'd also need a 'status' field in your actual User type.
                  <tr key={user.email}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          // Placeholder for status. You'd replace this with actual user status logic.
                          user.level === "super"
                            ? "bg-green-600 text-white" // Active
                            : user.level === "admin"
                            ? "bg-yellow-600 text-white" // Pending/Suspended
                            : "bg-red-600 text-white" // Inactive/Deleted
                        }`}
                      >
                        {/* Placeholder text for status */}
                        {user.level === "super"
                          ? "Active"
                          : user.level === "admin"
                          ? "Pending"
                          : "Suspended"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.last_login
                        ? new Date(user.last_login).toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSuspendClick(user)}
                          className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Suspend
                        </Button>
                        <Button
                          onClick={() => handleActivateClick(user)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Activate
                        </Button>
                        <Button
                          onClick={() => handleDeleteClick(user)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Suspend User Modal */}
      <Modal show={showSuspendModal} onClose={() => setShowSuspendModal(false)}>
        <h2 className="text-xl font-bold text-orange-400 mb-4">Suspend User</h2>
        <p className="mb-4 text-gray-300">
          Are you sure you want to suspend user{" "}
          <span className="font-semibold text-blue-300">
            {userToSuspend?.email}
          </span>
          ?
        </p>
        <TextArea
          label="Reason for Suspension"
          name="suspendReason"
          value={suspendReason}
          onChange={(e) => setSuspendReason(e.target.value)}
          placeholder="e.g., Policy violation, suspicious activity"
          rows={3}
          required
          className="mb-4"
        />
        <Input
          label="Suspension Duration (e.g., '7d', '30d', 'permanent')"
          type="text"
          name="suspendDuration"
          value={suspendDuration}
          onChange={(e) => setSuspendDuration(e.target.value)}
          placeholder="Optional"
          className="mb-6"
        />
        <div className="mt-6 flex justify-end gap-4">
          <Button
            onClick={() => setShowSuspendModal(false)}
            className="bg-gray-600 hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmSuspendUser}
            className="bg-orange-600 hover:bg-orange-700"
          >
            Suspend User
          </Button>
        </div>
      </Modal>

      {/* Delete User Modal */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <h2 className="text-xl font-bold text-red-400 mb-4">Delete User</h2>
        <p className="mb-4 text-gray-300">
          Are you sure you want to delete user{" "}
          <span className="font-semibold text-blue-300">
            {userToDelete?.email}
          </span>
          ? This action is irreversible.
        </p>
        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="forceDelete"
            checked={forceDelete}
            onChange={(e) => setForceDelete(e.target.checked)}
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
          <label htmlFor="forceDelete" className="ml-2 block text-gray-300">
            Force Delete (Delete associated data)
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Button
            onClick={() => setShowDeleteModal(false)}
            className="bg-gray-600 hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDeleteUser}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete User
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;
