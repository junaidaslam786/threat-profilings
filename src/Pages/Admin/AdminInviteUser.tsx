import { useState } from "react";
import { useInviteUserMutation } from "../../Redux/api/userApi";
import Button from "../../components/Common/Button";

export default function AdminInviteUser() {
  const [inviteUser, { isLoading }] = useInviteUserMutation();
  const [fields, setFields] = useState({ name: "", email: "", orgName: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!fields.name || !fields.email || !fields.orgName) {
      setError("Name, email, and organization name are required.");
      return;
    }
    try {
      await inviteUser({
        name: fields.name,
        email: fields.email,
        orgName: fields.orgName,
      }).unwrap();
      setSuccess("User invited!");
      setFields({ name: "", email: "", orgName: "" });
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
            "Failed to invite user."
        );
      } else {
        setError("Failed to invite user.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        className="bg-gray-800 p-8 rounded-xl border border-blue-700 w-full max-w-md shadow-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-blue-300 mb-4">Invite User</h2>
        <div className="space-y-4">
          <input
            className="w-full p-2 rounded bg-gray-700 border border-blue-900"
            name="name"
            placeholder="Name"
            value={fields.name}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-2 rounded bg-gray-700 border border-blue-900"
            name="email"
            placeholder="Email"
            value={fields.email}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-2 rounded bg-gray-700 border border-blue-900"
            name="orgName"
            placeholder="Organization Name"
            value={fields.orgName}
            onChange={handleChange}
            required
          />
        </div>
        {error && <div className="text-red-400 mt-2">{error}</div>}
        {success && <div className="text-green-400 mt-2">{success}</div>}
        <div className="flex gap-2 mt-6">
          <Button type="submit" loading={isLoading}>
            Invite
          </Button>
        </div>
      </form>
    </div>
  );
}
