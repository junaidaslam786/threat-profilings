import React, { useState, useEffect } from "react";
import Button from "../../components/Common/Button";

const Dashboard: React.FC<{ onViewChange: (view: string) => void }> = ({
  onViewChange,
}) => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching user data
    setLoading(true);
    setTimeout(() => {
      // Mock user data as Firebase is removed
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

  const handleSignOut = () => {
    console.log("User signing out (Simulated)");
    onViewChange("signIn");
  };

  // Mock userId for display
  const mockUserIdDisplay = userData?.userId || "N/A";

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-blue-500">
          Welcome to Your Dashboard!
        </h2>
        <Button
          onClick={handleSignOut}
          className="bg-red-600 hover:bg-red-700 w-auto px-6 py-2"
        >
          Sign Out
        </Button>
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

      <div className="mt-8 text-center">
        <button
          onClick={() => onViewChange("signUp")}
          className="text-blue-500 hover:underline mx-2"
        >
          Sign Up Page
        </button>
        <button
          onClick={() => onViewChange("signIn")}
          className="text-blue-500 hover:underline mx-2"
        >
          Sign In Page
        </button>
        <button
          onClick={() => onViewChange("adminLogin")}
          className="text-blue-500 hover:underline mx-2"
        >
          Admin Login Page
        </button>
        <button
          onClick={() => onViewChange("adminApprovalRequests")}
          className="text-blue-500 hover:underline mx-2"
        >
          Admin Approval Requests Page
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
