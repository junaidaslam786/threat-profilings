import { useState } from "react";
import {
  useApproveJoinRequestMutation,
  useGetPendingJoinRequestsQuery,
  useGetProfileQuery,
} from "../../Redux/api/userApi";
import type { UserRole } from "../../Redux/slices/userSlice";
import Button from "../../components/Common/Button";
import Navbar from "../../components/Common/Navbar";

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
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent mb-3">
            Join Requests Management
          </h1>
          <p className="text-secondary-300 text-lg">
            Review and approve pending organization join requests
          </p>
        </div>

        {/* Organization Switcher */}
        {organizations.length > 0 && (
          <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 mb-8 border border-secondary-700/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-primary-300">
                Select Organization
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {organizations.map((org, index) => (
                <button
                  key={org.client_name}
                  onClick={() => setSelectedOrgIndex(index)}
                  className={`p-4 rounded-xl transition-all duration-200 text-left border ${
                    selectedOrgIndex === index
                      ? "bg-gradient-to-br from-primary-500 to-primary-600 text-white border-primary-400 shadow-lg"
                      : "bg-secondary-700/50 text-secondary-300 border-secondary-600/50 hover:bg-secondary-600/50 hover:border-secondary-500/50"
                  }`}
                >
                  <div className="font-semibold">{org.organization_name}</div>
                  <div className="text-sm opacity-75">{org.client_name}</div>
                </button>
              ))}
            </div>
            {selectedOrg && (
              <div className="mt-4 p-3 bg-primary-500/20 rounded-lg border border-primary-400/30">
                <p className="text-sm text-primary-200">
                  📋 Viewing requests for:{" "}
                  <span className="font-semibold text-primary-100">
                    {selectedOrg.organization_name}
                  </span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 animate-spin">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p className="text-xl text-gray-300">Loading requests...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xl text-red-400 mb-4">Failed to load requests</p>
            <Button onClick={() => refetch()} className="bg-red-500 hover:bg-red-600">
              Try Again
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && requestsArray.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">All caught up!</h3>
            <p className="text-xl text-gray-300">No pending join requests at the moment.</p>
          </div>
        )}

        {/* Requests Grid */}
        <div className="grid gap-6">
          {requestsArray.map((req) => (
            <div
              key={req.join_id}
              className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50 hover:border-primary-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/10"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {req.name}
                      </h3>
                      <p className="text-primary-300 mb-2">{req.email}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-3 py-1 bg-primary-500/20 text-primary-200 rounded-full text-sm border border-primary-400/30">
                          {req.client_name}
                        </span>
                        <span className="px-3 py-1 bg-secondary-600/50 text-secondary-200 rounded-full text-sm border border-secondary-500/50">
                          {new Date(req.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {req.message && (
                        <div className="bg-secondary-700/50 rounded-lg p-3 border border-secondary-600/50">
                          <p className="text-sm text-secondary-300">
                            <span className="font-medium text-secondary-200">Message:</span> {req.message}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 min-w-[200px]">
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 mb-2">
                      Assign Role
                    </label>
                    <select
                      className="w-full bg-secondary-700/50 text-white p-3 rounded-lg border border-secondary-600/50 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-all"
                      value={selectedRole[req.join_id] || "viewer"}
                      onChange={(e) =>
                        setSelectedRole((prev) => ({
                          ...prev,
                          [req.join_id]: e.target.value,
                        }))
                      }
                    >
                      <option value="admin">👑 Admin</option>
                      <option value="viewer">👁️ Viewer</option>
                      <option value="runner">🏃 Runner</option>
                    </select>
                  </div>
                  <Button
                    loading={isApproving}
                    onClick={() => handleApprove(req.join_id)}
                    className="w-full bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                  >
                    {isApproving ? "Approving..." : "✅ Approve Request"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
