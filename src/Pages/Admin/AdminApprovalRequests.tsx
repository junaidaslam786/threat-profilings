import React from "react";
import Button from "../../components/Common/Button";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useAppSelector, type RootState } from "../../Redux/store";
import { logoutUser, setUserDetails } from "../../Redux/slices/userSlice";
import { useGetProfileMutation, useGetPendingJoinRequestsQuery, useApproveJoinRequestMutation } from "../../Redux/api/userApi";

const AdminApprovalRequests: React.FC = () => {
  const dispatch = useDispatch();
  const { user: currentUser, isLoading: isUserLoading } = useAppSelector((state: RootState) => state.user);
  const [fetchCurrentUserProfile] = useGetProfileMutation();

  // Fetch join requests for this org
  const orgName = currentUser?.client_name;
  const {
    data: pendingUsers = [],
    isLoading: isPendingLoading,
    isError: isPendingError,
    refetch,
  } = useGetPendingJoinRequestsQuery(orgName!, { skip: !orgName });

  const [approveJoinRequest, { isLoading: isApproving }] = useApproveJoinRequestMutation();

  React.useEffect(() => {
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

  const handleApprove = async (joinId: string, requestedRole: "Admin" | "Viewer") => {
    try {
      await approveJoinRequest({ joinId, body: { role: requestedRole } }).unwrap();
      toast.success("User approved successfully!");
      refetch();
    } catch {
      toast.error("Failed to approve user. Try again.");
    }
  };

  const isAdmin = currentUser?.role?.toLowerCase() === "admin";

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
        <p className="text-center text-gray-400">Loading user authentication...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-blue-700">
          <h2 className="text-3xl font-bold text-center mb-6 text-blue-500">Access Denied</h2>
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
        <h2 className="text-4xl font-bold text-blue-500">Pending User Approvals</h2>
        <Button
          onClick={handleSignOut}
          className="bg-red-600 hover:bg-red-700 w-auto px-6 py-2"
        >
          Sign Out
        </Button>
      </div>

      {isPendingLoading ? (
        <p className="text-center text-gray-400">Loading pending users...</p>
      ) : isPendingError ? (
        <p className="text-center text-red-500">Failed to load pending users.</p>
      ) : pendingUsers.length === 0 ? (
        <p className="text-center text-gray-400">No pending user join requests.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-xl border border-blue-700">
          <table className="min-w-full bg-gray-800 text-white">
            <thead className="bg-gray-700 border-b border-blue-700">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-blue-400 uppercase tracking-wider">Name</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-blue-400 uppercase tracking-wider">Email</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-blue-400 uppercase tracking-wider">Requested Role</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map((user) => (
                <tr key={user.join_id} className="border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200">
                  <td className="py-3 px-4 whitespace-nowrap">{user.name}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{user.email}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{user.requestedRole}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <Button
                      onClick={() => handleApprove(user.join_id, user.requestedRole)}
                      disabled={isApproving}
                      className="bg-green-700 hover:bg-green-800 px-4 py-1"
                    >
                      Approve
                    </Button>
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
