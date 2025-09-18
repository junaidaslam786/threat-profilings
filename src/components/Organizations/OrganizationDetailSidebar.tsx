import React, { useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Common/Sidebar";
import ThreatProfilingControlPanel from "./ThreatProfilingControlPanel";

interface Organization {
  client_name: string;
  organization_name: string;
  sector?: string;
  website_url?: string;
  description?: string;
  contact_email?: string;
  phone?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

interface OrganizationDetailSidebarProps {
  organization: Organization | null;
  isOpen: boolean;
  onClose: () => void;
  canEdit?: boolean;
}

const OrganizationDetailSidebar: React.FC<OrganizationDetailSidebarProps> = ({
  organization,
  isOpen,
  onClose,
  canEdit = true,
}) => {
  const navigate = useNavigate();

  const handleNavigate = useCallback((path: string) => {
    navigate(path);
    onClose();
  }, [navigate, onClose]);

  // Memoized navigation handlers for better performance
  const handleEditClick = useCallback(() => {
    if (organization) {
      handleNavigate(`/orgs/${organization.client_name}/edit`);
    }
  }, [organization, handleNavigate]);
  
  const handleSettingsClick = useCallback(() => {
    if (organization) {
      handleNavigate(`/orgs/${organization.client_name}/settings`);
    }
  }, [organization, handleNavigate]);
  
  const handleThreatProfilingClick = useCallback(() => {
    handleNavigate("/threat-profiling-management");
  }, [handleNavigate]);

  if (!organization) return null;

  return (
    <Sidebar
      isOpen={isOpen}
      onClose={onClose}
      title={organization.organization_name}
    >
      <div className="space-y-6">
        {/* Organization Header */}
        <div className="bg-gradient-to-r from-primary-500/10 to-primary-600/10 rounded-xl p-6 border border-primary-500/20">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              {organization.organization_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {organization.organization_name}
              </h3>
              <p className="text-primary-400 text-sm">
                {organization.client_name}
              </p>
              {organization.sector && (
                <span className="inline-block mt-2 px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-xs font-medium border border-primary-500/30">
                  {organization.sector}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Management Actions */}
        {canEdit && (
          <div className="bg-secondary-800/50 rounded-xl p-6 border border-secondary-700/30">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-secondary-500/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-secondary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Management</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleEditClick}
                className="p-3 bg-secondary-700/50 rounded-lg hover:bg-secondary-600/50 transition-colors border border-secondary-600/30 hover:border-yellow-500/30 group"
              >
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-4 h-4 text-yellow-400 group-hover:text-yellow-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <svg
                      className="w-4 h-4 text-yellow-400 group-hover:text-yellow-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>{" "}
                  </svg>
                  <span className="text-white text-sm font-medium">Edit</span>
                </div>
              </button>
              <button
                onClick={handleSettingsClick}
                className="p-3 bg-secondary-700/50 rounded-lg hover:bg-secondary-600/50 transition-colors border border-secondary-600/30 hover:border-purple-500/30 group"
              >
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-4 h-4 text-purple-400 group-hover:text-purple-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                  </svg>
                  <span className="text-white text-sm font-medium">
                    Settings
                  </span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Threat Profiling Management */}
        <div className="bg-secondary-800/50 rounded-xl p-6 border border-secondary-700/30">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-secondary-500/20 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-secondary-400"
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
            </div>
            <h3 className="text-lg font-semibold text-white">
              Threat Profiling
            </h3>
          </div>
          <button
            onClick={handleThreatProfilingClick}
            className="w-full p-4 bg-gradient-to-r from-secondary-600/20 to-secondary-700/20 rounded-lg hover:from-secondary-500/30 hover:to-secondary-600/30 transition-all duration-200 border border-secondary-500/30 hover:border-secondary-400/50 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg
                  className="w-5 h-5 text-secondary-400 group-hover:text-secondary-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V9a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="text-white font-medium">
                  Management Dashboard
                </span>
              </div>
              <svg
                className="w-4 h-4 text-secondary-400 group-hover:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        </div>

        {/* Threat Profiling Control Panel */}
        <ThreatProfilingControlPanel clientName={organization.client_name} />

        {/* Contact Information */}
        {(organization.contact_email ||
          organization.phone ||
          organization.website_url) && (
          <div className="bg-secondary-800/50 rounded-xl p-6 border border-secondary-700/30">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">
                Contact Information
              </h3>
            </div>
            <div className="space-y-3">
              {organization.contact_email && (
                <div className="flex items-center space-x-3 p-3 bg-secondary-700/30 rounded-lg">
                  <svg
                    className="w-4 h-4 text-cyan-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                  <a
                    href={`mailto:${organization.contact_email}`}
                    className="text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer"
                  >
                    {organization.contact_email}
                  </a>
                </div>
              )}
              {organization.phone && (
                <div className="flex items-center space-x-3 p-3 bg-secondary-700/30 rounded-lg">
                  <svg
                    className="w-4 h-4 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="text-white">{organization.phone}</span>
                </div>
              )}
              {organization.website_url && (
                <div className="flex items-center space-x-3 p-3 bg-secondary-700/30 rounded-lg">
                  <svg
                    className="w-4 h-4 text-secondary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                    />
                  </svg>
                  <a
                    href={organization.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary-300 hover:text-secondary-200 transition-colors cursor-pointer flex items-center space-x-1"
                  >
                    <span>{organization.website_url}</span>
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Timeline */}
        {(organization.created_at || organization.updated_at) && (
          <div className="bg-secondary-800/50 rounded-xl p-6 border border-secondary-700/30">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Timeline</h3>
            </div>
            <div className="space-y-4">
              {organization.created_at && (
                <div className="flex items-center space-x-4 p-3 bg-secondary-700/30 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      Organization Created
                    </div>
                    <div className="text-xs text-secondary-400">
                      {new Date(organization.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )}
              {organization.updated_at && (
                <div className="flex items-center space-x-4 p-3 bg-secondary-700/30 rounded-lg">
                  <div className="w-3 h-3 bg-secondary-500 rounded-full flex-shrink-0"></div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      Last Updated
                    </div>
                    <div className="text-xs text-secondary-400">
                      {new Date(organization.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default memo(OrganizationDetailSidebar);
