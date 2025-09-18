import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Common/Navbar";
import LoadingScreen from "../../components/Common/LoadingScreen";
import Modal from "../../components/Common/Modal";
import {
  useListPlatformAdminsQuery,
  useGrantPlatformAdminMutation,
  useRevokePlatformAdminMutation,
} from "../../Redux/api/platformAdminApi";
import { toast } from "react-hot-toast";
import type { PlatformAdminUser } from "../../Redux/slices/platformAdminSlice";

const AdminManagement: React.FC = () => {
  const navigate = useNavigate();
  const {
    data: adminsResponse,
    isLoading,
    error,
    refetch,
  } = useListPlatformAdminsQuery();

  const [grantAdmin] = useGrantPlatformAdminMutation();
  const [revokeAdmin] = useRevokePlatformAdminMutation();

  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [adminToRevoke, setAdminToRevoke] = useState<PlatformAdminUser | null>(
    null
  );
  const [revokeReason, setRevokeReason] = useState("");

  const [showGrantModal, setShowGrantModal] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminLevel, setNewAdminLevel] = useState<
    "super" | "admin" | "read-only"
  >("read-only");
  const [grantReason, setGrantReason] = useState("");

  const handleRevokeClick = (admin: PlatformAdminUser) => {
    setAdminToRevoke(admin);
    setShowRevokeModal(true);
  };

  const confirmRevokeAdmin = async () => {
    if (adminToRevoke) {
      try {
        await revokeAdmin({
          email: adminToRevoke.email,
          reason: revokeReason,
        }).unwrap();
        toast.success(
          `Successfully revoked admin access for ${adminToRevoke.email}`
        );
        setShowRevokeModal(false);
        setAdminToRevoke(null);
        setRevokeReason("");
        refetch();
      } catch (err: unknown) {
        const errorMessage =
          typeof err === "string"
            ? err
            : (err as { data?: { message?: string } }).data?.message ||
              "Failed to revoke admin access.";
        toast.error(errorMessage);
      }
    }
  };

  const handleGrantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await grantAdmin({
        email: newAdminEmail,
        level: newAdminLevel,
        reason: grantReason,
      }).unwrap();
      toast.success(
        `Successfully granted ${newAdminLevel} access to ${newAdminEmail}`
      );
      setShowGrantModal(false);
      setNewAdminEmail("");
      setNewAdminLevel("read-only");
      setGrantReason("");
      refetch();
    } catch (err: unknown) {
      const errorMessage =
        typeof err === "string"
          ? err
          : (err as { data?: { message?: string } }).data?.message ||
            "Failed to grant admin access.";
      toast.error(errorMessage);
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
            <h2 className="text-2xl font-bold text-red-400 mb-4">Error Loading Admin List</h2>
            <p className="text-secondary-300 mb-6">Failed to load platform administrators.</p>
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

  const admins = adminsResponse?.admins || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent mb-3">
              Admin Management
            </h1>
            <p className="text-secondary-300 text-lg">
              Manage platform administrators and their access levels
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowGrantModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-all duration-200 cursor-pointer flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Grant Admin Access</span>
            </button>
            <button
              onClick={() => refetch()}
              className="px-6 py-3 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white rounded-lg hover:from-secondary-500 hover:to-secondary-600 transition-all duration-200 cursor-pointer flex items-center space-x-2"
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

        <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-8 border border-secondary-700/50">
          {admins.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-secondary-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <p className="text-secondary-400 text-lg">No platform administrators found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-secondary-700/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-300 uppercase tracking-wider">
                      Administrator
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-300 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-300 uppercase tracking-wider">
                      Granted By
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-300 uppercase tracking-wider">
                      Granted At
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin: PlatformAdminUser, index) => (
                    <tr key={admin.email} className={`border-b border-secondary-700/30 hover:bg-secondary-700/20 transition-colors ${index % 2 === 0 ? 'bg-secondary-800/30' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                            {admin.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-white font-medium">{admin.name}</div>
                            <div className="text-secondary-400 text-sm">{admin.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          admin.level === 'super' 
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            : admin.level === 'admin'
                            ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                            : 'bg-green-500/20 text-green-400 border border-green-500/30'
                        }`}>
                          {admin.level.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-secondary-300">
                        {admin.granted_by || 'System'}
                      </td>
                      <td className="px-6 py-4 text-sm text-secondary-300">
                        {admin.granted_at ? new Date(admin.granted_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleRevokeClick(admin)}
                          className="px-3 py-1 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-500 hover:to-red-600 transition-all duration-200 cursor-pointer text-sm"
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Revoke Admin Modal */}
        <Modal show={showRevokeModal} onClose={() => setShowRevokeModal(false)}>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Revoke Admin Access</h2>
            <p className="mb-6 text-secondary-300">
              Are you sure you want to revoke admin access for{" "}
              <span className="font-semibold text-primary-400">
                {adminToRevoke?.email}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-secondary-300 mb-2">Reason for Revocation (Optional)</label>
              <textarea
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                placeholder="e.g., User no longer requires admin privileges"
                rows={3}
                className="w-full px-4 py-3 bg-secondary-700/50 border border-secondary-600/50 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowRevokeModal(false)}
                className="px-6 py-3 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white rounded-lg hover:from-secondary-500 hover:to-secondary-600 transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmRevokeAdmin}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-500 hover:to-red-600 transition-all duration-200 cursor-pointer"
              >
                Revoke Access
              </button>
            </div>
          </div>
        </Modal>

        {/* Grant Admin Modal */}
        <Modal show={showGrantModal} onClose={() => setShowGrantModal(false)}>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-green-400 mb-4">Grant Admin Access</h2>
            <form onSubmit={handleGrantSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-secondary-300 mb-2">User Email</label>
                <input
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="Enter user's email"
                  required
                  className="w-full px-4 py-3 bg-secondary-700/50 border border-secondary-600/50 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-secondary-300 mb-2">Admin Level</label>
                <select
                  value={newAdminLevel}
                  onChange={(e) => setNewAdminLevel(e.target.value as "super" | "admin" | "read-only")}
                  className="w-full px-4 py-3 bg-secondary-700/50 border border-secondary-600/50 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="read-only">Read-Only</option>
                  <option value="admin">Admin</option>
                  <option value="super">Super Admin</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-secondary-300 mb-2">Reason for Grant (Optional)</label>
                <textarea
                  value={grantReason}
                  onChange={(e) => setGrantReason(e.target.value)}
                  placeholder="e.g., New team member requiring admin access"
                  rows={3}
                  className="w-full px-4 py-3 bg-secondary-700/50 border border-secondary-600/50 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowGrantModal(false)}
                  className="px-6 py-3 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white rounded-lg hover:from-secondary-500 hover:to-secondary-600 transition-all duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-all duration-200 cursor-pointer"
                >
                  Grant Access
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AdminManagement;
