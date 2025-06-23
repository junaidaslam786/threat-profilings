import React, { useState, useEffect } from "react";
import Button from "../../components/Common/Button";

type UserData = {
  userId: string;
  organization_name: string;
  email: string;
  client_name: string;
};

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockUserData = {
        userId: "mockUser12345",
        organization_name: "Mock Org Inc.",
        email: "mock@example.com",
        client_name: "mock_example_com",
      };
      setUserData(mockUserData);
      setLoading(false);
    }, 1000);
  }, []);

  // Mock userId for display
  const mockUserIdDisplay = userData?.userId || "N/A";

  const handleSignInClick = () => {
    window.location.href = "https://eu-north-1p9cm0plzr.auth.eu-north-1.amazoncognito.com/login?client_id=5h8d5bk73e6f8m9fdvkkaq8mbt&response_type=token&scope=email+openid+phone&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F";
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

      {loading ? (
        <p className="text-center text-gray-400">Loading user data...</p>
      ) : userData ? (
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-blue-700 max-w-2xl mx-auto">
          <h3 className="text-2xl font-semibold mb-4 text-blue-400">
            User Information
          </h3>
          <p className="mb-2">
            <span className="font-medium">User ID:</span>{" "}
            <span className="break-words">{mockUserIdDisplay}</span>
          </p>
          <p className="mb-2">
            <span className="font-medium">Organization Name:</span>{" "}
            {userData.organization_name}
          </p>
          <p className="mb-2">
            <span className="font-medium">Email:</span> {userData.email}
          </p>
          <p className="mb-2">
            <span className="font-medium">Client Name:</span>{" "}
            {userData.client_name}
          </p>
          <p className="text-gray-400 text-sm mt-4">
            This is a mock dashboard for Milestone 1. Full dashboard
            functionality will be built in later milestones.
          </p>
        </div>
      ) : (
        <p className="text-center text-gray-400">
          No user data found. Please ensure you've signed up.
        </p>
      )}
    </div>
  );
};

export default Dashboard;
