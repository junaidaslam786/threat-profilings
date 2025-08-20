import { useState } from "react";
import { useInviteUserMutation } from "../../Redux/api/userApi";
import Button from "../../components/Common/Button";
import Navbar from "../../components/Common/Navbar";

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
      setSuccess("User invited successfully!");
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
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900">
      <Navbar />
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent mb-2">
              Invite New User
            </h1>
            <p className="text-xl text-secondary-300">
              Send an invitation to join your organization
            </p>
          </div>

          {/* Form */}
          <form
            className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-8 border border-secondary-700/50 shadow-2xl"
            onSubmit={handleSubmit}
          >
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-secondary-300 mb-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Full Name
                </label>
                <input
                  className="w-full p-4 rounded-xl bg-secondary-700/50 border border-secondary-600/50 text-white placeholder-secondary-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-all duration-200"
                  name="name"
                  placeholder="Enter full name"
                  value={fields.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-secondary-300 mb-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                  Email Address
                </label>
                <input
                  className="w-full p-4 rounded-xl bg-secondary-700/50 border border-secondary-600/50 text-white placeholder-secondary-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-all duration-200"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  value={fields.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Organization Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-secondary-300 mb-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  Organization Name
                </label>
                <input
                  className="w-full p-4 rounded-xl bg-secondary-700/50 border border-secondary-600/50 text-white placeholder-secondary-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-all duration-200"
                  name="orgName"
                  placeholder="Enter organization name"
                  value={fields.orgName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Status Messages */}
            {error && (
              <div className="mt-6 p-4 bg-red-500/20 border border-red-400/30 rounded-xl">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-red-300">{error}</span>
                </div>
              </div>
            )}

            {success && (
              <div className="mt-6 p-4 bg-green-500/20 border border-green-400/30 rounded-xl">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-green-300">{success}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-8">
              <Button
                type="submit"
                loading={isLoading}
                className="w-full bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5 animate-spin"
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
                    Sending Invitation...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
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
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    Send Invitation
                  </div>
                )}
              </Button>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-primary-500/10 border border-primary-400/20 rounded-xl">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-primary-400 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="text-sm text-primary-200">
                  <p className="font-medium mb-1">Invitation Process:</p>
                  <ul className="space-y-1 text-primary-300">
                    <li>• User will receive an email invitation</li>
                    <li>
                      • They can register and join the specified organization
                    </li>
                    <li>• Default role will be assigned upon registration</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
