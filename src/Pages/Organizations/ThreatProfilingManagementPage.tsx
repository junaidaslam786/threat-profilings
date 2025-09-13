import React, { useState, useEffect } from "react";
import { useUser } from "../../hooks/useUser";
import { isLEMaster, isOrgAdmin } from "../../utils/roleUtils";
import ThreatProfilingOverviewDashboard from "../../components/Organizations/ThreatProfilingOverviewDashboard";
import FieldLockManager from "../../components/Organizations/FieldLockManager";
import ErrorBoundary from "../../components/Common/ErrorBoundary";
import { useGetAvailableOrganizationsQuery } from "../../Redux/api/threatProfilingApi";

const ThreatProfilingManagementPage: React.FC = () => {
  const { user } = useUser();
  const [selectedTab, setSelectedTab] = useState<"overview" | "field-locks">(
    "overview"
  );
  const [selectedOrganization, setSelectedOrganization] = useState<string>("");

  // Add debugging
  useEffect(() => {
    console.log("ThreatProfilingManagementPage mounted");
    console.log("User:", user);
  }, [user]);

  // Check if user has permission to access threat profiling management
  const hasPermission = user && (isLEMaster(user) || isOrgAdmin(user));

  const {
    data: availableOrgsResponse,
    isLoading: isLoadingOrgs,
    error: orgsError,
  } = useGetAvailableOrganizationsQuery(undefined, {
    skip: !user || !hasPermission,
  });

  // Extract the array from the response
  const availableOrgs = availableOrgsResponse?.available_organizations;

  // Add error logging
  useEffect(() => {
    if (orgsError) {
      console.error("Error loading organizations:", orgsError);
    }
  }, [orgsError]);

  // Add debugging for availableOrgs (can be removed in production)
  useEffect(() => {
    if (availableOrgsResponse) {
      console.log("Organizations loaded successfully:", availableOrgsResponse);
    }
  }, [availableOrgsResponse]);

  if (orgsError) {
    return (
      <div className="min-h-screen bg-primary-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">API Error</h2>
          <p className="text-gray-400">
            Failed to load organizations: {String(orgsError)}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-primary-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading user...</p>
        </div>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="min-h-screen bg-primary-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400">
            You don't have permission to access threat profiling management.
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: "overview" as const,
      name: "Overview Dashboard",
      description: "View organization profiling status and statistics",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      id: "field-locks" as const,
      name: "Field Lock Manager",
      description: "Manage field locks for organizations",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent mb-3">
            Threat Profiling Management
          </h1>
          <p className="text-secondary-300 text-lg">
            Manage threat profiling operations, view organization status, and
            configure field locks.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-secondary-700/50">
            <nav className="flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                    selectedTab === tab.id
                      ? "border-primary-500 text-primary-400"
                      : "border-transparent text-secondary-400 hover:text-secondary-300 hover:border-secondary-500"
                  }`}
                >
                  <span
                    className={`mr-3 transition-colors duration-300 ${
                      selectedTab === tab.id
                        ? "text-primary-400"
                        : "text-secondary-400 group-hover:text-secondary-300"
                    }`}
                  >
                    {tab.icon}
                  </span>
                  <div className="text-left">
                    <div className="font-semibold">{tab.name}</div>
                    <div className="text-xs text-secondary-500 mt-1">
                      {tab.description}
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Organization Selector for Field Locks */}
        {selectedTab === "field-locks" && (
          <div className="mb-6">
            <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl shadow-xl border border-secondary-700/50 p-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent mb-4">
                Select Organization
                {availableOrgsResponse?.total_count && (
                  <span className="text-sm font-normal text-secondary-400 ml-2">
                    ({availableOrgsResponse.total_count} available)
                  </span>
                )}
              </h3>

              {isLoadingOrgs ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-3 border-primary-500 border-t-transparent mx-auto"></div>
                  <p className="text-secondary-300 mt-4 font-medium">
                    Loading organizations...
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.isArray(availableOrgs) && availableOrgs.length > 0 ? (
                    availableOrgs.map((org) => (
                      <button
                        key={org.client_name}
                        onClick={() => setSelectedOrganization(org.client_name)}
                        className={`group p-5 rounded-xl border text-left transition-all duration-300 hover:shadow-lg ${
                          selectedOrganization === org.client_name
                            ? "border-primary-500 bg-gradient-to-br from-primary-500/10 to-primary-600/5 shadow-lg shadow-primary-500/20"
                            : "border-secondary-600/50 bg-gradient-to-br from-secondary-700 to-secondary-800 hover:border-secondary-500 hover:shadow-secondary-500/10"
                        }`}
                      >
                        <div className="font-bold text-lg bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent mb-2">
                          {org.organization_name}
                        </div>
                        <div className="text-sm text-secondary-400 mb-3 font-medium">
                          {org.client_name}
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="text-secondary-400">
                            <span className="font-medium">Role:</span>{" "}
                            <span className="text-tertiary-400">
                              {org.user_role}
                            </span>
                          </div>
                          <div
                            className={`flex items-center space-x-1 ${
                              org.can_run_profiling
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${
                                org.can_run_profiling
                                  ? "bg-green-400"
                                  : "bg-red-400"
                              }`}
                            ></div>
                            <span className="font-medium">
                              {org.can_run_profiling ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-secondary-700/50 rounded-full flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-secondary-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h4"
                          />
                        </svg>
                      </div>
                      <p className="text-secondary-400 font-medium">
                        {!availableOrgsResponse
                          ? "Loading organizations..."
                          : Array.isArray(availableOrgs) &&
                            availableOrgs.length === 0
                          ? "No organizations available for threat profiling."
                          : "No organizations found."}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="space-y-6">
          {selectedTab === "overview" && (
            <ErrorBoundary>
              <ThreatProfilingOverviewDashboard />
            </ErrorBoundary>
          )}

          {selectedTab === "field-locks" && (
            <ErrorBoundary>
              <FieldLockManager
                clientName={selectedOrganization || undefined}
              />
            </ErrorBoundary>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThreatProfilingManagementPage;
