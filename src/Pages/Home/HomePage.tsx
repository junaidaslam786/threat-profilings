import React from "react";
import { useNavigate } from "react-router-dom";
import ThreatProfilingLayout from "../../components/Common/ThreatProfilingLayout";
import LoadingScreen from "../../components/Common/LoadingScreen";
import Button from "../../components/Common/Button";
import { useGetOrgsQuery } from "../../Redux/api/organizationsApi";
import { useStartProfilingMutation } from "../../Redux/api/threatProfilingApi";
import { useUser } from "../../hooks/useUser";
import { getIdToken } from "../../utils/authStorage";
import type { ClientDataDto } from "../../Redux/slices/organizationsSlice";

interface OrganizationSectionProps {
  organization: ClientDataDto;
  onRunProfiling: (clientName: string) => void;
  isRunning: boolean;
}

const OrganizationSection: React.FC<OrganizationSectionProps> = ({
  organization,
  onRunProfiling,
  isRunning,
}) => {
  const navigate = useNavigate();

  return (
    <div className="mb-16">
      {/* Organization Details Card */}
      <div className="bg-secondary-800/50 rounded-xl border border-secondary-700/50 p-6 mb-8">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <svg
            className="w-6 h-6 text-primary-400 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6m-6 4h6"
            />
          </svg>
          Organization Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div className="bg-secondary-900/50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-primary-400 mb-2">
                Organization Name
              </label>
              <p className="text-white">{organization.organization_name}</p>
            </div>

            <div className="bg-secondary-900/50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-primary-400 mb-2">
                Sector
              </label>
              <p className="text-white">
                {organization.sector || "Not specified"}
              </p>
            </div>

            <div className="bg-secondary-900/50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-primary-400 mb-2">
                Operating Countries
              </label>
              <p className="text-white">
                {organization.countries_of_operation?.join(", ") ||
                  "Not specified"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-secondary-900/50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-primary-400 mb-2">
                Website
              </label>
              <p className="text-white">
                {organization.website_url || "Not specified"}
              </p>
            </div>

            <div className="bg-secondary-900/50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-primary-400 mb-2">
                Client Name
              </label>
              <p className="text-white">{organization.client_name}</p>
            </div>

            <div className="bg-secondary-900/50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-primary-400 mb-2">
                Additional Context
              </label>
              <p className="text-white text-sm leading-relaxed">
                {organization.additional_details ||
                  "No additional details provided."}
              </p>
            </div>
          </div>
        </div>

        {/* Re-run Profiling Button */}
        <div className="flex justify-center">
          <Button
            onClick={() => onRunProfiling(organization.client_name)}
            disabled={isRunning}
            loading={isRunning}
            variant="primary"
            className="px-8 py-3 text-lg"
          >
            {isRunning ? "Running Profiling..." : "Run Profiling"}
          </Button>
        </div>
      </div>

      {/* Applications Section */}
      {organization.apps && organization.apps.length > 0 && (
        <div className="bg-secondary-800/50 rounded-xl border border-secondary-700/50 p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <svg
              className="w-6 h-6 text-blue-400 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              />
            </svg>
            Applications
          </h3>

          <div className="space-y-6">
            {organization.apps.map((app, index) => (
              <div
                key={index}
                className="bg-secondary-900/50 rounded-lg p-4 border border-secondary-600/30"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-400 mb-1">
                      Application Name
                    </label>
                    <p className="text-white font-medium">{app.app_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-400 mb-1">
                      Application Profile
                    </label>
                    <p className="text-white">{app.app_profile}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-blue-400 mb-1">
                      Application Details
                    </label>
                    <p className="text-secondary-300">
                      {app.app_additional_details || "No additional details"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-blue-400 mb-1">
                      Application Link
                    </label>
                    <p className="text-white">{app.app_url || "N/A"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          className="bg-gradient-to-br from-primary-600/20 to-primary-500/20 border border-primary-500/30 rounded-lg p-6 hover:from-primary-600/30 hover:to-primary-500/30 transition-all duration-200 cursor-pointer"
          onClick={() => navigate(`/threat-profiling/intro`)}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary-600/30 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h4 className="text-lg font-semibold text-white mb-2">
            Introduction
          </h4>
          <p className="text-sm text-secondary-300">
            Get started with threat profiling overview
          </p>
        </div>

        <div
          className="bg-gradient-to-br from-amber-600/20 to-amber-500/20 border border-amber-500/30 rounded-lg p-6 hover:from-amber-600/30 hover:to-amber-500/30 transition-all duration-200 cursor-pointer"
          onClick={() => navigate(`/threat-profiling/threat-actor`)}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-600/30 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-amber-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>
          <h4 className="text-lg font-semibold text-white mb-2">
            Threat Actors
          </h4>
          <p className="text-sm text-secondary-300">
            Identify potential adversaries and risks
          </p>
        </div>

        <div
          className="bg-gradient-to-br from-red-600/20 to-red-500/20 border border-red-500/30 rounded-lg p-6 hover:from-red-600/30 hover:to-red-500/30 transition-all duration-200 cursor-pointer"
          onClick={() => navigate(`/threat-profiling/threats`)}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-600/30 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>
          <h4 className="text-lg font-semibold text-white mb-2">
            Threats & TTPs
          </h4>
          <p className="text-sm text-secondary-300">
            Analyze attack methods and procedures
          </p>
        </div>

        <div
          className="bg-gradient-to-br from-green-600/20 to-green-500/20 border border-green-500/30 rounded-lg p-6 hover:from-green-600/30 hover:to-green-500/30 transition-all duration-200 cursor-pointer"
          onClick={() => navigate(`/threat-profiling/detection`)}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-600/30 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
          </div>
          <h4 className="text-lg font-semibold text-white mb-2">Detection</h4>
          <p className="text-sm text-secondary-300">
            Implement monitoring and detection
          </p>
        </div>
      </div>

      {/* Status Overview */}
      <div className="bg-secondary-800/50 rounded-xl border border-secondary-700/50 p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <svg
            className="w-6 h-6 text-green-400 mr-3"
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
          Assessment Progress
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-blue-400">7</span>
            </div>
            <h4 className="text-lg font-semibold text-white mb-1">
              Assessment Areas
            </h4>
            <p className="text-sm text-secondary-400">
              Complete threat profiling sections
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-amber-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-amber-400">
                {organization.apps?.length || 0}
              </span>
            </div>
            <h4 className="text-lg font-semibold text-white mb-1">
              Applications
            </h4>
            <p className="text-sm text-secondary-400">
              Systems under assessment
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-green-400">0%</span>
            </div>
            <h4 className="text-lg font-semibold text-white mb-1">
              Completion
            </h4>
            <p className="text-sm text-secondary-400">
              Overall progress status
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isPlatformAdmin, hasBothTokens } = useUser();
  const hasAuthToken = !!getIdToken();

  // Only fetch organizations if user is authenticated
  const {
    data: organizationsData,
    isLoading,
    error,
    refetch,
  } = useGetOrgsQuery(undefined, {
    skip: !hasAuthToken,
  });

  const [startProfiling] = useStartProfilingMutation();
  const [runningOrganizations, setRunningOrganizations] = React.useState<
    Set<string>
  >(new Set());

  // Check if user has only L0 subscription (free tier)
  const subscriptions = user?.subscriptions || [];
  const isL0User =
    subscriptions.length === 1 && subscriptions[0]?.subscription_level === "L0";

  // Extract organizations array from the API response
  const getOrganizationsList = (
    data: typeof organizationsData
  ): ClientDataDto[] => {
    if (!data) return [];

    // If it's already an array, return it directly
    if (Array.isArray(data)) {
      return data;
    }

    // If it's an object with managed_orgs, extract the organizations
    if ("managed_orgs" in data && data.managed_orgs) {
      const organizations: ClientDataDto[] = [...data.managed_orgs];

      // Also include the le_master organization if it exists
      if (data.le_master) {
        organizations.unshift(data.le_master);
      }

      return organizations;
    }

    return [];
  };

  const organizations = getOrganizationsList(organizationsData);

  const handleRunProfiling = async (clientName: string) => {
    try {
      setRunningOrganizations((prev) => new Set(prev).add(clientName));

      const result = await startProfiling({ client_name: clientName }).unwrap();

      if (result.success) {
        // Show success message or refresh data
        await refetch();
      }
    } catch (error) {
      console.error("Failed to start profiling:", error);
      // You could show a toast notification here
    } finally {
      setRunningOrganizations((prev) => {
        const newSet = new Set(prev);
        newSet.delete(clientName);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <ThreatProfilingLayout>
        <div className="p-6">
          <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-red-600/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-red-400 mb-2">
              Failed to load organizations
            </h3>
            <p className="text-secondary-300 mb-4">
              There was an error loading your organizations. Please try again.
            </p>
            <Button onClick={refetch} variant="primary">
              Try Again
            </Button>
          </div>
        </div>
      </ThreatProfilingLayout>
    );
  }

  const organizationsList = organizations;

  // Show subscription notice for L0 users (except platform admins)
  if (isL0User && !isPlatformAdmin) {
    return (
      <ThreatProfilingLayout>
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-1a2 2 0 00-2-2H6a2 2 0 00-2 2v1a2 2 0 002 2zM12 7a4 4 0 100 8 4 4 0 000-8z"
                  />
                </svg>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent mb-4">
                Welcome to Threat Profiling Platform
              </h1>
              <p className="text-xl text-secondary-300 mb-8">
                You're currently on the free tier. No subscription is present
                right now.
              </p>
            </div>
            <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-8 border border-secondary-700/50 text-center">
              <h2 className="text-2xl font-bold text-primary-300 mb-4">
                Upgrade to Access Premium Features
              </h2>
              <p className="text-secondary-300 mb-6">
                Subscribe to unlock organizations, threat profiling, analytics,
                and more premium features.
              </p>
              <Button
                onClick={() => navigate("/payments")}
                variant="primary"
                className="px-8 py-3 text-lg"
              >
                💳 Subscribe to a Tier
              </Button>
            </div>
          </div>
        </div>
      </ThreatProfilingLayout>
    );
  }

  return (
    <ThreatProfilingLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">
                Threat Profiling Dashboard
              </h1>
              <p className="text-lg text-secondary-400 mt-2">
                Manage and run threat profiling for your organizations
              </p>
            </div>
            <Button onClick={refetch} variant="outline" className="px-6">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </Button>
          </div>

          <div className="bg-gradient-to-r from-primary-600/20 to-primary-500/20 border border-primary-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">
                  {organizationsList.length} Organizations Available
                </h2>
                <p className="text-secondary-300">
                  Each organization can be profiled for comprehensive threat
                  assessment and security analysis
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-secondary-400">
                  Total: {organizationsList.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Organizations List or Login Button */}
        {!hasAuthToken || !hasBothTokens ? (
          <div className="text-center py-12">
            <Button
              onClick={() => (window.location.href = "/auth")}
              variant="primary"
              className="px-8 py-3 text-lg"
            >
              Sign In
            </Button>
          </div>
        ) : organizationsList.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-secondary-700 rounded-full flex items-center justify-center mx-auto mb-4">
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6m-6 4h6"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No Organizations Available
            </h3>
            <p className="text-secondary-400">
              You don't have access to any organizations or they haven't been
              set up for threat profiling yet.
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {organizationsList.map((organization: ClientDataDto) => (
              <OrganizationSection
                key={organization.client_name}
                organization={organization}
                onRunProfiling={handleRunProfiling}
                isRunning={runningOrganizations.has(organization.client_name)}
              />
            ))}
          </div>
        )}
      </div>
    </ThreatProfilingLayout>
  );
};

export default HomePage;
