import { useState } from "react";
import { useJoinOrgRequestMutation } from "../../Redux/api/userApi";
import Button from "../../components/Common/Button";

export default function JoinOrgRequestPage() {
  const [joinOrgRequest, { isLoading }] = useJoinOrgRequestMutation();
  const [fields, setFields] = useState({ orgDomain: "", message: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!fields.orgDomain) {
      setError("Organization domain is required.");
      return;
    }
    try {
      await joinOrgRequest({
        orgDomain: fields.orgDomain,
        message: fields.message || undefined,
      }).unwrap();
      setSuccess("Request sent!");
      setFields({ orgDomain: "", message: "" });
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
            "Failed to send request."
        );
      } else {
        setError("Failed to send request.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        className="bg-gray-800 p-8 rounded-xl border border-secondary-700 w-full max-w-md shadow-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-secondary-300 mb-4">
          Join Organization
        </h2>
        <div className="space-y-4">
          <input
            className="w-full p-2 rounded bg-gray-700 border border-secondary-900"
            name="orgDomain"
            placeholder="Org Domain"
            value={fields.orgDomain}
            onChange={handleChange}
            required
          />
          <textarea
            className="w-full p-2 rounded bg-gray-700 border border-secondary-900"
            name="message"
            placeholder="Optional message"
            value={fields.message}
            onChange={handleChange}
          />
        </div>
        {error && <div className="text-red-400 mt-2">{error}</div>}
        {success && <div className="text-green-400 mt-2">{success}</div>}
        <div className="flex gap-2 mt-6">
          <Button type="submit" loading={isLoading}>
            Request to Join
          </Button>
        </div>
      </form>
    </div>
  );
}
