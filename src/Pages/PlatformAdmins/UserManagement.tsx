import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../components/Common/Navbar";
import LoadingScreen from "../../components/Common/LoadingScreen";
import Modal from "../../components/Common/Modal";
import {
  useGetAllUsersQuery,
  useSuspendUserMutation,
  useActivateUserMutation,
  useDeleteUserMutation,
} from "../../Redux/api/platformAdminApi";
import { toast } from "react-hot-toast";
import type { UserWithPartnerInfo } from "../../Redux/api/platformAdminApi";

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // State for filters and pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get("status") || "");
  const [userTypeFilter, setUserTypeFilter] = useState<string>(searchParams.get("user_type") || "");
  const [partnerFilter, setPartnerFilter] = useState<string>(searchParams.get("has_partner") || "");
  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get("search") || "");

  const {
    data: usersResponse,
    isLoading,
    error,
    refetch,
  } = useGetAllUsersQuery({
    page,
    limit,
    status: statusFilter || undefined,
    user_type: userTypeFilter || undefined,
    has_partner: partnerFilter ? partnerFilter === "true" : undefined,
    search: searchTerm || undefined,
  });

  const [suspendUser] = useSuspendUserMutation();
  const [activateUser] = useActivateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [userToSuspend, setUserToSuspend] = useState<UserWithPartnerInfo | null>(
    null
  );
  const [suspendReason, setSuspendReason] = useState("");
  const [suspendDuration, setSuspendDuration] = useState(""); // e.g., "7d", "30d", "permanent"

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserWithPartnerInfo | null>(
    null
  );
  const [forceDelete, setForceDelete] = useState(false);

  const handleSuspendClick = (user: UserWithPartnerInfo) => {
    setUserToSuspend(user);
    setShowSuspendModal(true);
  };

  const handleActivateClick = async (user: UserWithPartnerInfo) => {
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

  // Update delete function for UserWithPartnerInfo type
  const handleDeleteClick = (user: UserWithPartnerInfo) => {
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

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-semibold";
    switch (status?.toLowerCase()) {
      case "active":
        return `${baseClasses} bg-green-600 text-white`;
      case "pending":
        return `${baseClasses} bg-yellow-600 text-white`;
      case "suspended":
        return `${baseClasses} bg-red-600 text-white`;
      case "inactive":
        return `${baseClasses} bg-gray-600 text-white`;
      default:
        return `${baseClasses} bg-gray-600 text-white`;
    }
  };

  const getSubscriptionTier = (user: UserWithPartnerInfo) => {
    if (!user.subscriptions || user.subscriptions.length === 0) {
      return "No Subscription";
    }
    
    // Get the highest tier subscription
    const tierPriority = { "L3": 3, "L2": 2, "L1": 1, "L0": 0 };
    const highestTier = user.subscriptions.reduce((prev, current) => {
      const prevPriority = tierPriority[prev.subscription_level as keyof typeof tierPriority] || -1;
      const currentPriority = tierPriority[current.subscription_level as keyof typeof tierPriority] || -1;
      return currentPriority > prevPriority ? current : prev;
    });
    
    return highestTier.subscription_level;
  };

  const getTierBadge = (tier: string) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-semibold";
    switch (tier) {
      case "L3":
        return `${baseClasses} bg-purple-600 text-white`;
      case "L2":
        return `${baseClasses} bg-blue-600 text-white`;
      case "L1":
        return `${baseClasses} bg-green-600 text-white`;
      case "L0":
        return `${baseClasses} bg-gray-600 text-white`;
      default:
        return `${baseClasses} bg-gray-500 text-white`;
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1); // Reset to first page when searching
  };

  const handleFilterChange = (filterType: string, value: string) => {
    switch (filterType) {
      case "status":
        setStatusFilter(value);
        break;
      case "userType":
        setUserTypeFilter(value);
        break;
      case "partner":
        setPartnerFilter(value);
        break;
    }
    setPage(1); // Reset to first page when filtering
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
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-400 mb-4">
              Error Loading User List
            </h2>
            <p className="text-secondary-300 mb-6">
              Failed to load platform users.
            </p>
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

  // Get users from the correct response structure
  const users = usersResponse?.users || [];
  
  // Handle potential API inconsistency - try both 'total' and 'total_users'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiResponse = usersResponse as any;
  const totalUsers = usersResponse?.total || apiResponse?.total_users || users.length || 0;

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
              Manage platform users, permissions, and access control ({totalUsers} users)
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => refetch()}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-all duration-200 cursor-pointer flex items-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
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

        {/* Filters Section */}
        <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50 mb-6">
          <h3 className="text-lg font-semibold text-primary-300 mb-4">Search & Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-secondary-300 mb-2">Search Users</label>
              <input
                type="text"
                placeholder="Search by email or name..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-secondary-300 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* User Type Filter */}
            <div>
              <label className="block text-sm font-medium text-secondary-300 mb-2">User Type</label>
              <select
                value={userTypeFilter}
                onChange={(e) => handleFilterChange("userType", e.target.value)}
                className="w-full px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Types</option>
                <option value="platform_admin">Platform Admin</option>
                <option value="LE">LE Admin</option>
                <option value="standard">Standard Admin</option>
                <option value="client">Client User</option>
              </select>
            </div>

            {/* Partner Filter */}
            <div>
              <label className="block text-sm font-medium text-secondary-300 mb-2">Partner Status</label>
              <select
                value={partnerFilter}
                onChange={(e) => handleFilterChange("partner", e.target.value)}
                className="w-full px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All</option>
                <option value="true">Has Partner</option>
                <option value="false">No Partner</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-blue-700">
          {users.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-secondary-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-secondary-300 mb-2">No users found</h3>
              <p className="text-secondary-400">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      User Details
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Joined Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Subscription Tier
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Organization
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Status & Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Partner Info
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Payment Summary
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
                  {users.map((user: UserWithPartnerInfo) => (
                    <tr key={user.email} className="hover:bg-gray-700/50 transition-colors">
                      {/* User Details */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-white">{user.name}</div>
                          <div className="text-sm text-blue-300">{user.email}</div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-indigo-600/20 text-indigo-300 border border-indigo-400/30 rounded text-xs font-medium">
                          {user.role}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>

                      {/* Subscription Tier */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getTierBadge(getSubscriptionTier(user))}>
                          {getSubscriptionTier(user)}
                        </span>
                      </td>

                      {/* Organization */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {user.organization?.organization_name || "No organization"}
                      </td>

                      {/* Status & Type */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-2">
                          <span className={getStatusBadge(user.status)}>
                            {user.status}
                          </span>
                          <span className="px-2 py-1 bg-blue-600/20 text-blue-300 border border-blue-400/30 rounded text-xs">
                            {user.user_type}
                          </span>
                        </div>
                      </td>

                      {/* Partner Info */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.partner_relationship?.has_partner ? (
                          <div className="flex flex-col">
                            <span className="text-primary-300 font-medium">
                              {user.partner_relationship.partner_info?.partner_code}
                            </span>
                            <span className="text-xs text-green-400">
                              {user.partner_relationship.partner_info?.discount_percent}% discount
                            </span>
                            <span className="text-xs text-secondary-400">
                              {user.partner_relationship.partner_info?.commission_percent}% commission
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">No partner</span>
                        )}
                      </td>

                      {/* Payment Summary */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.payment_summary ? (
                          <div className="flex flex-col">
                            <span className="text-primary-300 font-medium">
                              ${user.payment_summary.total_amount_spent?.toFixed(2) || "0.00"}
                            </span>
                            <span className="text-xs text-secondary-300">
                              {user.payment_summary.total_payments || 0} payments
                            </span>
                            {user.payment_summary.last_payment_date && (
                              <span className="text-xs text-secondary-400">
                                Last: {new Date(user.payment_summary.last_payment_date).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">No payments</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-col gap-2">
                          {user.status === "suspended" ? (
                            <button
                              onClick={() => handleActivateClick(user)}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition-colors"
                            >
                              Activate
                            </button>
                          ) : (
                            <button
                              onClick={() => handleSuspendClick(user)}
                              className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-xs transition-colors"
                            >
                              Suspend
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {users.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalUsers)} of {totalUsers} users
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 bg-secondary-600 hover:bg-secondary-500 disabled:bg-secondary-700 disabled:opacity-50 text-white rounded transition-all duration-200"
                >
                  Previous
                </button>
                <span className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded">
                  Page {page} of {Math.ceil(totalUsers / limit)}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= Math.ceil(totalUsers / limit)}
                  className="px-3 py-1 bg-secondary-600 hover:bg-secondary-500 disabled:bg-secondary-700 disabled:opacity-50 text-white rounded transition-all duration-200"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Suspend User Modal */}
        <Modal
          show={showSuspendModal}
          onClose={() => setShowSuspendModal(false)}
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-orange-400 mb-4">
              Suspend User
            </h2>
            <p className="mb-6 text-secondary-300">
              Are you sure you want to suspend user{" "}
              <span className="font-semibold text-primary-400">
                {userToSuspend?.email}
              </span>
              ?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-secondary-300 mb-2">
                Reason for Suspension
              </label>
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
              <label className="block text-sm font-medium text-secondary-300 mb-2">
                Suspension Duration
              </label>
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
            <h2 className="text-2xl font-bold text-red-400 mb-4">
              Delete User
            </h2>
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
              <label
                htmlFor="forceDelete"
                className="ml-3 text-red-300 cursor-pointer"
              >
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
