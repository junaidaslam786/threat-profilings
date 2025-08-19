import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Common/Navbar";
import LoadingScreen from "../../components/Common/LoadingScreen";
import Modal from "../../components/Common/Modal";
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
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <LoadingScreen />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 p-8 rounded-xl border border-red-500/30 text-center max-w-md">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-400 mb-4">Error Loading User List</h2>
            <p className="text-secondary-300 mb-6">Failed to load platform users.</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => refetch()}
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-500 hover:to-primary-600 transition-all duration-200 cursor-pointer"
              >
                Retry
              </button>
              <button
                onClick={() => navigate("/platform-admins")}
                className="px-6 py-3 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white rounded-lg hover:from-secondary-500 hover:to-secondary-600 transition-all duration-200 cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // IMPORTANT: This 'admins' variable should come from useListUsersQuery
  const users = usersResponse?.admins || []; // Using admins as placeholder for users

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent mb-3">
              User Management
            </h1>
            <p className="text-secondary-300 text-lg">
              Manage platform users, permissions, and access control
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => refetch()}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-all duration-200 cursor-pointer flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
            <button
              onClick={() => navigate("/platform-admins")}
              className="px-6 py-3 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white rounded-lg hover:from-secondary-500 hover:to-secondary-600 transition-all duration-200 cursor-pointer"
            >
              Back to Dashboard
            </button>
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
          <div className="p-6">
            <h2 className="text-2xl font-bold text-orange-400 mb-4">Suspend User</h2>
            <p className="mb-6 text-secondary-300">
              Are you sure you want to suspend user{" "}
              <span className="font-semibold text-primary-400">
                {userToSuspend?.email}
              </span>
              ?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-secondary-300 mb-2">Reason for Suspension</label>
              <textarea
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                placeholder="e.g., Policy violation, suspicious activity"
                rows={3}
                className="w-full px-4 py-3 bg-secondary-700/50 border border-secondary-600/50 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-secondary-300 mb-2">Suspension Duration</label>
              <input
                type="text"
                value={suspendDuration}
                onChange={(e) => setSuspendDuration(e.target.value)}
                placeholder="e.g., '7d', '30d', 'permanent'"
                className="w-full px-4 py-3 bg-secondary-700/50 border border-secondary-600/50 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowSuspendModal(false)}
                className="px-6 py-3 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white rounded-lg hover:from-secondary-500 hover:to-secondary-600 transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmSuspendUser}
                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-200 cursor-pointer"
              >
                Suspend User
              </button>
            </div>
          </div>
        </Modal>

        {/* Delete User Modal */}
        <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Delete User</h2>
            <p className="mb-6 text-secondary-300">
              Are you sure you want to delete user{" "}
              <span className="font-semibold text-primary-400">
                {userToDelete?.email}
              </span>
              ? This action is irreversible.
            </p>
            <div className="flex items-center mb-6 p-4 bg-red-500/10 rounded-lg border border-red-500/30">
              <input
                type="checkbox"
                id="forceDelete"
                checked={forceDelete}
                onChange={(e) => setForceDelete(e.target.checked)}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="forceDelete" className="ml-3 text-red-300 cursor-pointer">
                Force Delete (Delete associated data)
              </label>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-3 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white rounded-lg hover:from-secondary-500 hover:to-secondary-600 transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUser}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-500 hover:to-red-600 transition-all duration-200 cursor-pointer"
              >
                Delete User
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default UserManagement;
