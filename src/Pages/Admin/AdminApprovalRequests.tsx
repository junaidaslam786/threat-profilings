import React, { useState, useEffect } from "react";
import Button from "../../components/Common/Button";

// Dummy data for pending requests (replace with actual data fetching in a real app)
const DUMMY_PENDING_REQUESTS = [
  {
    id: "req123",
    requesterUid: "userABCDEF123456",
    targetOrgId: "TechSolutionsInc",
    requestedAt: new Date().getTime() / 1000 - 3600,
  },
  {
    id: "req456",
    requesterUid: "userGHIJKL789012",
    targetOrgId: "GlobalInnovations",
    requestedAt: new Date().getTime() / 1000 - 7200,
  },
];

const AdminApprovalRequests: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<any>(null);
  const [approvalRole, setApprovalRole] = useState<"Admin" | "Viewer">(
    "Viewer"
  );

  useEffect(() => {
    // Simulate fetching data
    setLoading(true);
    setTimeout(() => {
      setRequests(DUMMY_PENDING_REQUESTS);
      setLoading(false);
    }, 1000);
  }, []);

  const handleApproveClick = (request: any) => {
    setCurrentRequest(request);
    setShowConfirmation(true);
  };

  const handleConfirmApproval = () => {
    if (currentRequest) {
      console.log(
        `Approving request ${currentRequest.id} for organization ${currentRequest.targetOrgId} as ${approvalRole}`
      );
      alert(
        `Request from ${currentRequest.requesterUid} for ${currentRequest.targetOrgId} approved as ${approvalRole}. (Simulated)`
      );
      setRequests((prev) => prev.filter((req) => req.id !== currentRequest.id)); // Remove approved request
      setShowConfirmation(false);
      setCurrentRequest(null);
      setGeneralError(null); // Clear any previous errors
    }
  };

  const handleCancelApproval = () => {
    setShowConfirmation(false);
    setCurrentRequest(null);
  };

  const handleSignOut = () => {
    console.log("Admin signing out (Simulated)");
  };

  // Mock userId for demonstration purposes as we removed Firebase auth
  const mockUserId = "mockAdminUser123";

  if (!mockUserId) {
    // This block acts as a static placeholder for non-authenticated state
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-blue-700">
          <h2 className="text-3xl font-bold text-center mb-6 text-blue-500">
            Admin Portal
          </h2>
          <p className="text-center text-gray-300 mb-4">
            Please sign in as an administrator to view this page.
          </p>
          <Button onClick={() => {}}>Go to Admin Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-blue-500">
          Admin Approval Requests
        </h2>
        <Button
          onClick={handleSignOut}
          className="bg-red-600 hover:bg-red-700 w-auto px-6 py-2"
        >
          Sign Out
        </Button>
      </div>

      {generalError && (
        <p className="text-red-500 text-center mb-4">{generalError}</p>
      )}

      {loading ? (
        <p className="text-center text-gray-400">Loading pending requests...</p>
      ) : requests.length === 0 ? (
        <p className="text-center text-gray-400">No pending join requests.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-gray-800 p-6 rounded-lg shadow-xl border border-blue-700"
            >
              <h3 className="text-xl font-semibold mb-2 text-blue-400">
                Join Request #{request.id.substring(0, 8)}
              </h3>
              <p className="text-gray-300 mb-1">
                <span className="font-medium">Requester ID:</span>{" "}
                {request.requesterUid.substring(0, 12)}...
              </p>
              <p className="text-gray-300 mb-1">
                <span className="font-medium">Target Organization:</span>{" "}
                {request.targetOrgId}
              </p>
              <p className="text-gray-300 mb-4">
                <span className="font-medium">Requested At:</span>{" "}
                {new Date(request.requestedAt.seconds * 1000).toLocaleString()}
              </p>
              <Button
                onClick={() => handleApproveClick(request)}
                className="w-full"
              >
                Approve Request
              </Button>
            </div>
          ))}
        </div>
      )}

      {showConfirmation && currentRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-blue-700">
            <h3 className="text-2xl font-bold text-blue-400 mb-4">
              Approve Join Request
            </h3>
            <p className="text-gray-300 mb-4">
              Are you sure you want to approve the join request for organization{" "}
              <span className="font-semibold text-white">
                {currentRequest.targetOrgId}
              </span>{" "}
              from user{" "}
              <span className="font-semibold text-white">
                {currentRequest.requesterUid.substring(0, 12)}...
              </span>
              ?
            </p>
            <div className="mb-4">
              <label
                htmlFor="roleSelect"
                className="block text-gray-300 text-sm font-bold mb-2"
              >
                Assign Role:
              </label>
              <select
                id="roleSelect"
                className="block w-full py-2 px-3 border border-gray-600 bg-gray-700 rounded-lg text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={approvalRole}
                onChange={(e) =>
                  setApprovalRole(e.target.value as "Admin" | "Viewer")
                }
              >
                <option value="Viewer">Viewer</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="flex justify-end space-x-4">
              <Button
                onClick={handleCancelApproval}
                className="bg-gray-600 hover:bg-gray-700 w-auto"
              >
                Cancel
              </Button>
              <Button onClick={handleConfirmApproval} className="w-auto">
                Confirm Approval
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApprovalRequests;
