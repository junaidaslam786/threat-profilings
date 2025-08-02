import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Common/Button";
import Input from "../../components/Common/InputField";
import TextArea from "../../components/Common/TextArea";
import { useGrantPlatformAdminMutation } from "../../Redux/api/platformAdminApi";
import { toast } from "react-hot-toast";

const GrantAdminAccess: React.FC = () => {
  const navigate = useNavigate();
  const [grantAdmin, { isLoading, error }] = useGrantPlatformAdminMutation();

  const [email, setEmail] = useState("");
  const [level, setLevel] = useState<"super" | "admin" | "read-only">(
    "read-only"
  );
  const [reason, setReason] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await grantAdmin({ email, level, reason }).unwrap();
      toast.success(`Successfully granted ${level} access to ${email}`);
      setEmail("");
      setLevel("read-only");
      setReason("");
      navigate("/super-admin/admins");
    } catch (err: unknown) {
      const errorMessage =
        typeof err === "string"
          ? err
          : (err as { data?: { message?: string } }).data?.message ||
            "Failed to grant admin access.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-blue-400">Grant Admin Access</h1>
        <Button
          onClick={() => navigate("/super-admin")}
          className="bg-gray-600 hover:bg-gray-700"
        >
          Back to Dashboard
        </Button>
      </div>

      <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-blue-700 max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-blue-300">
          Provide Admin Privileges
        </h2>
        <form onSubmit={handleSubmit}>
          <Input
            label="User Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter user's email address"
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
              name="level"
              value={level}
              onChange={(e) =>
                setLevel(e.target.value as "super" | "admin" | "read-only")
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
            name="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., New team member requiring admin access"
            rows={3}
            className="mb-6"
          />

          {error && typeof error === "string" && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              onClick={() => navigate("/super-admin")}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Granting..." : "Grant Admin Access"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GrantAdminAccess;
