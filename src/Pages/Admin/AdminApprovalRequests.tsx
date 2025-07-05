import React, { useEffect } from "react";
import Button from "../../components/Common/Button";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useAppSelector, type RootState } from "../../Redux/store";
import { logoutUser, setUserDetails } from "../../Redux/slices/userSlice";
import { useGetProfileMutation } from "../../Redux/api/userApi";
import { useGetOrganizationsQuery } from "../../Redux/api/orgSubscriptionApi";

const AdminApprovalRequests: React.FC = () => {
  const dispatch = useDispatch();

  const { user: currentUser, isLoading: isUserLoading } = useAppSelector(
    (state: RootState) => state.user
  );
  const [fetchCurrentUserProfile] = useGetProfileMutation();

  const {
    data: organizations = [],
    isLoading: isOrganizationsLoading,
    isFetching: isOrganizationsFetching,
    error: organizationsError,
  } = useGetOrganizationsQuery();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await fetchCurrentUserProfile().unwrap();
        dispatch(setUserDetails(profileData));
      } catch (err) {
        console.error("Failed to fetch current user profile:", err);
        dispatch(logoutUser());
        toast.error("Session expired or invalid. Please sign in again.");
      }
    };
    if (!currentUser && !isUserLoading) {
      fetchProfile();
    }
  }, [fetchCurrentUserProfile, dispatch, currentUser, isUserLoading]);
  const handleSignOut = () => {
    dispatch(logoutUser());
    toast.success("You have been signed out.");
  };

  const isAdmin = currentUser?.role?.toLowerCase() === "admin";

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
        <p className="text-center text-gray-400">
          Loading user authentication...
        </p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-blue-700">
          <h2 className="text-3xl font-bold text-center mb-6 text-blue-500">
            Access Denied
          </h2>
          <p className="text-center text-gray-300 mb-4">
            You do not have administrative privileges to view this page.
          </p>
          <Button onClick={handleSignOut} className="w-full">
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-blue-500">All Organizations</h2>
        <Button
          onClick={handleSignOut}
          className="bg-red-600 hover:bg-red-700 w-auto px-6 py-2"
        >
          Sign Out
        </Button>
      </div>

      {organizationsError && (
        <p className="text-red-500 text-center mb-4">
          Error:{" "}
          {(typeof organizationsError === "object" &&
            organizationsError !== null &&
            "data" in organizationsError &&
            typeof (organizationsError as { data?: unknown }).data ===
              "object" &&
            (organizationsError as { data?: { message?: string } }).data
              ?.message) ||
            "Failed to load organizations."}
        </p>
      )}

      {isOrganizationsLoading || isOrganizationsFetching ? (
        <p className="text-center text-gray-400">Loading organizations...</p>
      ) : organizations.length === 0 ? (
        <p className="text-center text-gray-400">No organizations found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-xl border border-blue-700">
          <table className="min-w-full bg-gray-800 text-white">
            <thead className="bg-gray-700 border-b border-blue-700">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-blue-400 uppercase tracking-wider">
                  Organization Name
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-blue-400 uppercase tracking-wider">
                  Client Name
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-blue-400 uppercase tracking-wider">
                  Domain
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-blue-400 uppercase tracking-wider">
                  Sector
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-blue-400 uppercase tracking-wider">
                  Website URL
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-blue-400 uppercase tracking-wider">
                  Countries of Operation
                </th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((org) => (
                <tr
                  key={org.clientName}
                  className="border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200"
                >
                  <td className="py-3 px-4 whitespace-nowrap">{org.orgName}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {org.clientName}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {org.orgDomain}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {org.sector || "N/A"}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {org.websiteUrl ? (
                      <a
                        href={org.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        {org.websiteUrl}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {org.countriesOfOperation?.join(", ") || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminApprovalRequests;
