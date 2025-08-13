import { useState } from "react";
import {
  useApproveJoinRequestMutation,
  useGetPendingJoinRequestsQuery,
  useGetProfileQuery,
} from "../../Redux/api/userApi";
import type { UserRole } from "../../Redux/slices/userSlice";
import Button from "../../components/Common/Button";

export default function AdminPendingJoinRequests() {
  const { data: user } = useGetProfileQuery();
  const organizations = user?.accessible_organizations || [];

  // State for selected organization, default to first organization
  const [selectedOrgIndex, setSelectedOrgIndex] = useState(0);
  const selectedOrg = organizations[selectedOrgIndex];

  const {
    data: requests,
    isLoading,
    error,
    refetch,
  } = useGetPendingJoinRequestsQuery(
    { org: selectedOrg?.client_name },
    { skip: !selectedOrg?.client_name }
  );

  const requestsArray = Array.isArray(requests) ? requests : [];

  const [approveJoinRequest, { isLoading: isApproving }] =
    useApproveJoinRequestMutation();
  const [selectedRole, setSelectedRole] = useState<{ [id: string]: string }>(
    {}
  );

  const handleApprove = async (join_id: string) => {
    const role = selectedRole[join_id] || "viewer";
    await approveJoinRequest({
      joinId: join_id,
      body: { role: role as UserRole },
    }).unwrap();
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-400 mb-8">
          Pending Join Requests
        </h1>

        {/* Organization Switcher */}
        {organizations.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-300 mb-3">
              Select Organization:
            </h2>
            <div className="flex flex-wrap gap-3">
              {organizations.map((org, index) => (
                <Button
                  key={org.client_name}
                  onClick={() => setSelectedOrgIndex(index)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedOrgIndex === index
                      ? "bg-blue-600 text-white border-blue-500"
                      : "bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700"
                  }`}
                >
                  {org.organization_name}
                </Button>
              ))}
            </div>
            {selectedOrg && (
              <p className="text-sm text-gray-400 mt-2">
                Viewing requests for:{" "}
                <span className="text-blue-400">
                  {selectedOrg.organization_name}
                </span>
              </p>
            )}
          </div>
        )}

        {isLoading && <div className="text-center py-8">Loading...</div>}
        {error && (
          <div className="text-center text-red-400 py-8">
            Failed to load requests.
          </div>
        )}
        {!isLoading && !error && requestsArray.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            No pending requests.
          </div>
        )}
        <div className="space-y-4">
          {requestsArray.map((req) => (
            <div
              key={req.join_id}
              className="bg-gray-800 rounded-lg shadow p-6 border border-blue-700 flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div>
                <div className="text-lg font-semibold text-blue-300">
                  {req.name} ({req.email})
                </div>
                <div className="text-xs text-gray-400">{req.client_name}</div>
                <div className="text-xs text-gray-400">
                  {req.message || "-"}
                </div>
                <div className="text-xs text-gray-500">{req.created_at}</div>
              </div>
              <div className="mt-2 md:mt-0 flex flex-col gap-2">
                <select
                  className="bg-gray-900 text-white p-2 rounded border border-blue-800 mb-2"
                  value={selectedRole[req.join_id] || "viewer"}
                  onChange={(e) =>
                    setSelectedRole((prev) => ({
                      ...prev,
                      [req.join_id]: e.target.value,
                    }))
                  }
                >
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                  <option value="runner">Runner</option>
                </select>
                <Button
                  loading={isApproving}
                  onClick={() => handleApprove(req.join_id)}
                >
                  Approve
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
