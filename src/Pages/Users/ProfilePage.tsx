import { useEffect } from "react";
import { useGetProfileMutation } from "../../Redux/api/userApi";

export default function ProfilePage() {
  const [getProfile, { data, isLoading, error }] = useGetProfileMutation();
  useEffect(() => {
    getProfile();
  }, [getProfile]);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-400">
        Failed to load profile.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center">
      <div className="bg-gray-800 p-8 rounded-xl border border-blue-700 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold text-blue-300 mb-4">Profile</h2>
        {data ? (
          <div className="space-y-2">
            <div>
              <span className="text-blue-400">Name:</span> {data.name}
            </div>
            <div>
              <span className="text-blue-400">Email:</span> {data.email}
            </div>
            <div>
              <span className="text-blue-400">Organization:</span>{" "}
              {data.client_name || "-"}
            </div>
            <div>
              <span className="text-blue-400">Role:</span> {data.role}
            </div>
            <div>
              <span className="text-blue-400">Status:</span> {data.status}
            </div>
            <div>
              <span className="text-blue-400">Partner Code:</span>{" "}
              {data.partner_code || "-"}
            </div>
            <div>
              <span className="text-blue-400">Created:</span> {data.created_at}
            </div>
          </div>
        ) : (
          <div className="text-gray-400">No profile data found.</div>
        )}
      </div>
    </div>
  );
}
