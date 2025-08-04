// src/pages/PlatformAdmin/AdminManagement.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Common/Button";
import {
  useListPlatformAdminsQuery,
  useGrantPlatformAdminMutation,
  useRevokePlatformAdminMutation,
} from "../../Redux/api/platformAdminApi";
import { toast } from "react-hot-toast";
import type { PlatformAdminUser } from "../../Redux/slices/platformAdminSlice";
import TextArea from "../../components/Common/TextArea";
import Modal from "../../components/Common/Modal";
import InputField from "../../components/Common/InputField";

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
        refetch(); // Refetch the list of admins
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
      refetch(); // Refetch the list of admins
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Loading admin list...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-red-700 text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            Error Loading Admin List
          </h2>
          <p className="mb-4">Failed to load platform administrators.</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => refetch()}>Retry</Button>
            <Button
              onClick={() => navigate("/platform-admins")}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const admins = adminsResponse?.admins || [];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-blue-400">Admin Management</h1>
        <div className="flex gap-4">
          <Button
            onClick={() => setShowGrantModal(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Grant Admin Access
          </Button>
          <Button
            onClick={() => navigate("/platform-admins")}
            className="bg-gray-600 hover:bg-gray-700"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>

      <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-blue-700">
        {admins.length === 0 ? (
          <p className="text-center text-gray-400">
            No platform administrators found.
          </p>
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
                    Level
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Granted By
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Granted At
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
                {admins.map((admin: PlatformAdminUser) => (
                  <tr key={admin.email}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {admin.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-300">
                      {admin.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          admin.level === "super"
                            ? "bg-purple-600 text-white"
                            : admin.level === "admin"
                            ? "bg-blue-600 text-white"
                            : "bg-green-600 text-white"
                        }`}
                      >
                        {admin.level.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {admin.granted_by || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {admin.granted_at
                        ? new Date(admin.granted_at).toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        onClick={() => handleRevokeClick(admin)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Revoke
                      </Button>
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
        <h2 className="text-xl font-bold text-red-400 mb-4">
          Revoke Admin Access
        </h2>
        <p className="mb-4 text-gray-300">
          Are you sure you want to revoke admin access for{" "}
          <span className="font-semibold text-blue-300">
            {adminToRevoke?.email}
          </span>
          ? This action cannot be undone.
        </p>
        <TextArea
          label="Reason for Revocation (Optional)"
          name="revokeReason"
          value={revokeReason}
          onChange={(e) => setRevokeReason(e.target.value)}
          placeholder="e.g., User no longer requires admin privileges"
          rows={3}
        />
        <div className="mt-6 flex justify-end gap-4">
          <Button
            onClick={() => setShowRevokeModal(false)}
            className="bg-gray-600 hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmRevokeAdmin}
            className="bg-red-600 hover:bg-red-700"
          >
            Revoke Access
          </Button>
        </div>
      </Modal>

      {/* Grant Admin Modal */}
      <Modal show={showGrantModal} onClose={() => setShowGrantModal(false)}>
        <h2 className="text-xl font-bold text-blue-400 mb-4">
          Grant Admin Access
        </h2>
        <form onSubmit={handleGrantSubmit}>
          <InputField
            label="User Email"
            type="email"
            name="newAdminEmail"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
            placeholder="Enter user's email"
            required
            className="mb-4"
          />
          <div className="mb-4">
            <label
              htmlFor="adminLevel"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Admin Level
            </label>
            <select
              id="adminLevel"
              name="newAdminLevel"
              value={newAdminLevel}
              onChange={(e) =>
                setNewAdminLevel(
                  e.target.value as "super" | "admin" | "read-only"
                )
              }
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
            >
              <option value="read-only">Read-Only</option>
              <option value="admin">Admin</option>
              <option value="super">Super Admin</option>
            </select>
          </div>
          <TextArea
            label="Reason for Grant (Optional)"
            name="grantReason"
            value={grantReason}
            onChange={(e) => setGrantReason(e.target.value)}
            placeholder="e.g., New team member requiring admin access"
            rows={3}
            className="mb-6"
          />
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              onClick={() => setShowGrantModal(false)}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Grant Access
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminManagement;
