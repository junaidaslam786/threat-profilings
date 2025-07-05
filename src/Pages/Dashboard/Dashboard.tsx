// src/pages/Dashboard.tsx

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Button from "../../components/Common/Button";
import { useGetProfileMutation } from "../../Redux/api/userApi";
import { setUserDetails } from "../../Redux/slices/userSlice";
import { useAppSelector, type RootState } from "../../Redux/store";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useAppSelector(
    (state: RootState) => state.user
  );

  const [
    fetchMe,
    {
      data: fetchedUserData,
      isLoading: isFetchingMe,
      isSuccess,
      isError,
      error: fetchError,
    },
  ] = useGetProfileMutation();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    if (isSuccess && fetchedUserData) {
      dispatch(setUserDetails(fetchedUserData));
    } else if (isError) {
      console.error("Failed to fetch user details:", fetchError);
      dispatch(setUserDetails(null));
    }
  }, [isSuccess, fetchedUserData, isError, fetchError, dispatch]);

  const handleSignInClick = () => {
    window.location.href =
      "https://eu-north-1p9cm0plzr.auth.eu-north-1.amazoncognito.com/login?client_id=5h8d5bk73e6f8m9fdvkkaq8mbt&response_type=token&scope=email+openid+phone&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-blue-500">
          Welcome to Your Dashboard!
        </h2>
        <div>
          <Button
            onClick={handleSignInClick}
            className="bg-green-600 hover:bg-green-700 w-auto px-6 py-2"
          >
            Sign In
          </Button>
        </div>
      </div>

      {isLoading || isFetchingMe ? ( // Use isLoading from slice or isFetchingMe from mutation
        <p className="text-center text-gray-400">Loading user data...</p>
      ) : user ? (
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-blue-700 max-w-2xl mx-auto">
          <h3 className="text-2xl font-semibold mb-4 text-blue-400">
            User Information
          </h3>
          <p className="mb-2">
            <span className="font-medium">User ID:</span>{" "}
            <span className="break-words">21245012421</span>
          </p>
          <p className="mb-2">
            <span className="font-medium">Organization Name:</span>{" "}
            {user.client_name || "N/A"}
          </p>
          <p className="mb-2">
            <span className="font-medium">Email:</span> {user.email}
          </p>
          <p className="mb-2">
            <span className="font-medium">Client Name:</span>{" "}
            {user.name
              ? user.name.toLowerCase().replace(/\s/g, "_")
              : "N/A"}{" "}
            {/* Assuming client_name is derived from org name */}
          </p>
          <p className="mb-2">
            <span className="font-medium">Role:</span>{" "}
            {user.role ? user.role : "N/A"}
          </p>
          <p className="text-gray-400 text-sm mt-4">
            This dashboard displays user information fetched from the backend.
          </p>
        </div>
      ) : (
        <p className="text-center text-gray-400">
          No user data found. Please ensure you've signed in.
          {error && (
            <span className="text-red-500 block mt-2">Error: {error}</span>
          )}
        </p>
      )}
    </div>
  );
};

export default Dashboard;
