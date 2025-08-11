
import { useGetProfileQuery } from "../../Redux/api/userApi";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { extractErrorMessage } from "../../utils/errorHandling";

export default function ProfilePage() {
  const { data, isLoading, error } = useGetProfileQuery();

  useEffect(() => {
    if (error) {
      const msg = extractErrorMessage(error) || "Failed to load profile.";
      toast.error(msg);
    }
  }, [error]);

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
              <span className="text-blue-400">Name:</span> {data.user_info.name}
            </div>
            <div>
              <span className="text-blue-400">Email:</span> {data.user_info.email}
            </div>
            <div>
              <span className="text-blue-400">Organization:</span>{" "}
              {data.user_info.client_name || "-"}
            </div>
            <div>
              <span className="text-blue-400">Role:</span> {data.roles_and_permissions.primary_role}
            </div>
            <div>
              <span className="text-blue-400">Status:</span> {data.user_info.status}
            </div>
            <div>
              <span className="text-blue-400">Partner Code:</span>{" "}
              {data.ui_config.sections.partner_codes || "-"}
            </div>
            <div>
              <span className="text-blue-400">Created:</span> {new Date(data.user_info.created_at).toDateString()}
            </div>
          </div>
        ) : (
          <div className="text-gray-400">No profile data found.</div>
        )}
      </div>
    </div>
  );
}
