import React, { useState } from "react";
import {
  useUpdateAdminsMutation,
  useUpdateViewersMutation,
  useUpdateStatusMutation,
  useUpdateOrganizationMutation,
} from "../../Redux/api/orgSubscriptionApi";
import Button from "../../components/Common/Button";
import toast from "react-hot-toast";
import type { OrgDetails } from "../../Redux/slices/orgSubscriptionSlice";

const ManageOrganizationModal: React.FC<{
  org: OrgDetails;
  onClose: () => void;
  onSave: () => void;
}> = ({ org, onClose, onSave }) => {
  const [admins, setAdmins] = useState<string[]>(org.admins || []);
  const [viewers, setViewers] = useState<string[]>(org.viewers || []);
  const [newAdmin, setNewAdmin] = useState("");
  const [newViewer, setNewViewer] = useState("");
  const [status, setStatus] = useState(org.status || "Active");

  const [updateAdmins, { isLoading: isAdminsLoading }] =
    useUpdateAdminsMutation();
  const [updateViewers, { isLoading: isViewersLoading }] =
    useUpdateViewersMutation();
  const [updateStatus] = useUpdateStatusMutation();
  const [updateOrg, { isLoading: isOrgLoading }] =
    useUpdateOrganizationMutation();

  // Admin add/remove
  const handleAddAdmin = async () => {
    if (!newAdmin) return;
    const updated = [...admins, newAdmin];
    try {
      await updateAdmins({
        clientName: org.clientName,
        admins: updated,
      }).unwrap();
      setAdmins(updated);
      setNewAdmin("");
      toast.success("Admin added!");
    } catch {
      toast.error("Failed to add admin.");
    }
  };
  const handleRemoveAdmin = async (email: string) => {
    const updated = admins.filter((a) => a !== email);
    try {
      await updateAdmins({
        clientName: org.clientName,
        admins: updated,
      }).unwrap();
      setAdmins(updated);
      toast.success("Admin removed!");
    } catch {
      toast.error("Failed to remove admin.");
    }
  };

  // Viewer add/remove
  const handleAddViewer = async () => {
    if (!newViewer) return;
    const updated = [...viewers, newViewer];
    try {
      await updateViewers({
        clientName: org.clientName,
        viewers: updated,
      }).unwrap();
      setViewers(updated);
      setNewViewer("");
      toast.success("Viewer added!");
    } catch {
      toast.error("Failed to add viewer.");
    }
  };
  const handleRemoveViewer = async (email: string) => {
    const updated = viewers.filter((a) => a !== email);
    try {
      await updateViewers({
        clientName: org.clientName,
        viewers: updated,
      }).unwrap();
      setViewers(updated);
      toast.success("Viewer removed!");
    } catch {
      toast.error("Failed to remove viewer.");
    }
  };

  // Status update
  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    try {
      await updateStatus({
        clientName: org.clientName,
        status: newStatus,
      }).unwrap();
      toast.success("Status updated!");
    } catch {
      toast.error("Failed to update status.");
    }
  };

  // Basic org info update (sector, website, etc)
  const [form, setForm] = useState({
    sector: org.sector || "",
    websiteUrl: org.websiteUrl || "",
    countriesOfOperation: org.countriesOfOperation
      ? org.countriesOfOperation.join(", ")
      : "",
    homeUrl: org.homeUrl || "",
    aboutUsUrl: org.aboutUsUrl || "",
    additionalDetails: org.additionalDetails || "",
  });
  const isEditable = !org.run_number || org.run_number === 0;
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateOrg({
        clientName: org.clientName,
        body: {
          sector: form.sector,
          websiteUrl: form.websiteUrl,
          countriesOfOperation: form.countriesOfOperation
            ? form.countriesOfOperation.split(",").map((s) => s.trim())
            : [],
          homeUrl: form.homeUrl,
          aboutUsUrl: form.aboutUsUrl,
          additionalDetails: form.additionalDetails,
        },
      }).unwrap();
      toast.success("Organization updated!");
      onSave();
    } catch {
      toast.error("Failed to update organization.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg max-w-lg w-full border border-blue-700"
      >
        <h2 className="text-2xl font-bold text-blue-400 mb-4">
          Manage Organization
        </h2>
        {/* Admins */}
        <div className="mb-4">
          <label className="font-semibold">Admins:</label>
          <ul>
            {admins.map((email) => (
              <li key={email} className="flex justify-between items-center">
                <span>{email}</span>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemoveAdmin(email);
                  }}
                  className="bg-red-600 px-2 py-0"
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
          <input
            className="mb-2 w-full px-2 py-1 rounded text-black mt-2"
            placeholder="Add admin email"
            value={newAdmin}
            onChange={(e) => setNewAdmin(e.target.value)}
            disabled={isAdminsLoading}
          />
          <Button
            onClick={handleAddAdmin}
            className="bg-green-600 mb-2"
            disabled={isAdminsLoading}
          >
            Add Admin
          </Button>
        </div>
        {/* Viewers */}
        <div className="mb-4">
          <label className="font-semibold">Viewers:</label>
          <ul>
            {viewers.map((email) => (
              <li key={email} className="flex justify-between items-center">
                <span>{email}</span>
                <Button
                  onClick={() => handleRemoveViewer(email)}
                  className="bg-red-600 px-2 py-0"
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
          <input
            className="mb-2 w-full px-2 py-1 rounded text-black mt-2"
            placeholder="Add viewer email"
            value={newViewer}
            onChange={(e) => setNewViewer(e.target.value)}
            disabled={isViewersLoading}
          />
          <Button
            onClick={handleAddViewer}
            className="bg-green-600 mb-2"
            disabled={isViewersLoading}
          >
            Add Viewer
          </Button>
        </div>
        {/* Subscription Tier */}
        <div className="mb-4">
          <label className="font-semibold">Subscription Tier:</label>
          <div>{org.subscriptionTier || "N/A"}</div>
        </div>
        {/* Status */}
        <div className="mb-4">
          <label className="font-semibold">Status:</label>
          <select
            value={status}
            onChange={handleStatusChange}
            className="text-black rounded p-1"
          >
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
        {/* Editable Org Fields */}
        <div className="mb-2">
          <label>Sector</label>
          <input
            name="sector"
            value={form.sector}
            onChange={handleChange}
            className="w-full mb-2 text-black rounded px-2 py-1"
            disabled={!isEditable}
          />
          <label>Website URL</label>
          <input
            name="websiteUrl"
            value={form.websiteUrl}
            onChange={handleChange}
            className="w-full mb-2 text-black rounded px-2 py-1"
            disabled={!isEditable}
          />
          <label>Countries (comma separated)</label>
          <input
            name="countriesOfOperation"
            value={form.countriesOfOperation}
            onChange={handleChange}
            className="w-full mb-2 text-black rounded px-2 py-1"
            disabled={!isEditable}
          />
          <label>Home URL</label>
          <input
            name="homeUrl"
            value={form.homeUrl}
            onChange={handleChange}
            className="w-full mb-2 text-black rounded px-2 py-1"
            disabled={!isEditable}
          />
          <label>About Us URL</label>
          <input
            name="aboutUsUrl"
            value={form.aboutUsUrl}
            onChange={handleChange}
            className="w-full mb-2 text-black rounded px-2 py-1"
            disabled={!isEditable}
          />
          <label>Additional Details</label>
          <textarea
            name="additionalDetails"
            value={form.additionalDetails}
            onChange={handleChange}
            className="w-full mb-2 text-black rounded px-2 py-1"
            disabled={!isEditable}
          />
          {!isEditable && (
            <div className="text-yellow-400 text-xs mt-2">
              Organization fields cannot be edited after the first profiling
              run.
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button onClick={onClose} className="bg-gray-700">
            Close
          </Button>
          <button
            className="bg-green-700 px-4 py-2 rounded text-white"
            type="submit"
            disabled={!isEditable || isOrgLoading}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManageOrganizationModal;
