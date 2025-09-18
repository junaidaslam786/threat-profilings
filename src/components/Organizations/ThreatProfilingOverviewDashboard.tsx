import React, { useState } from 'react';
import { useUser } from '../../hooks/useUser';
import { isLEMaster, isOrgAdmin } from '../../utils/roleUtils';
import Button from '../Common/Button';
import Modal from '../Common/Modal';
import {
  useGetStatusOverviewQuery,
  useGetBulkStatusMutation,
  type OrganizationProfilingOverview,
  type ProfilingStatus,
} from '../../Redux/api/threatProfilingApi';

const ThreatProfilingOverviewDashboard: React.FC = () => {
  const { user } = useUser();
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>([]);
  const [showBulkModal, setShowBulkModal] = useState(false);
  
  const {
    data: statusOverview,
    isLoading: isLoadingOverview,
    error: overviewError,
    refetch: refetchOverview,
  } = useGetStatusOverviewQuery();

  const [getBulkStatus, { 
    data: bulkStatusData, 
    isLoading: isBulkLoading 
  }] = useGetBulkStatusMutation();

  // Check if user has permission to access threat profiling
  const hasPermission = user && (isLEMaster(user) || isOrgAdmin(user));

  if (!hasPermission) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">You don't have permission to view threat profiling overview.</p>
      </div>
    );
  }

  const getStatusColor = (status: ProfilingStatus) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-900/20 border-green-500/30';
      case 'in_progress':
      case 'analyzing':
      case 'generating_report':
        return 'text-secondary-400 bg-secondary-900/20 border-secondary-500/30';
      case 'failed':
        return 'text-red-400 bg-red-900/20 border-red-500/30';
      case 'preparing':
        return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
      default:
        return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: ProfilingStatus) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'in_progress':
      case 'analyzing':
      case 'generating_report':
        return (
          <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'failed':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const handleBulkStatusCheck = async () => {
    if (selectedOrgs.length === 0) {
      alert('Please select at least one organization');
      return;
    }

    try {
      await getBulkStatus({ client_names: selectedOrgs });
      setShowBulkModal(true);
    } catch (error) {
      console.error('Failed to get bulk status:', error);
      alert('Failed to get bulk status');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent">
          Threat Profiling Overview
        </h2>
        <Button
          onClick={() => refetchOverview()}
          className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </Button>
      </div>

      {/* Loading State */}
      {isLoadingOverview && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent mx-auto"></div>
          <p className="text-secondary-300 mt-6 text-lg font-medium">Loading overview...</p>
        </div>
      )}

      {/* Error State */}
      {overviewError && (
        <div className="bg-gradient-to-r from-red-900/50 to-red-800/50 border border-red-700/50 rounded-xl p-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-300 font-medium">Failed to load overview: {String(overviewError)}</p>
          </div>
        </div>
      )}

      {/* Overview Stats */}
      {statusOverview && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary-500/20 to-secondary-600/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-secondary-400 font-medium">Total Organizations</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent">
                    {statusOverview.total_organizations}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-secondary-400 font-medium">Active Profilings</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent">
                    {statusOverview.available_for_profiling}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-secondary-400 font-medium">Completed</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent">
                    {statusOverview.completed_profiles}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-secondary-400 font-medium">Success Rate</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent">
                    {statusOverview.total_organizations > 0 
                      ? Math.round((statusOverview.completed_profiles / statusOverview.total_organizations) * 100)
                      : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Organization List */}
          <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl border border-secondary-700/50 shadow-xl">
            <div className="p-6 border-b border-secondary-700/50">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent">
                  Organization Details
                </h3>
                {isLEMaster(user) && (
                  <div className="flex items-center space-x-3">
                    <Button
                      onClick={handleBulkStatusCheck}
                      disabled={selectedOrgs.length === 0 || isBulkLoading}
                      className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-600 disabled:to-gray-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isBulkLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          Checking...
                        </>
                      ) : (
                        `Bulk Check (${selectedOrgs.length})`
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              {statusOverview.organizations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-secondary-700/50 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h4" />
                    </svg>
                  </div>
                  <p className="text-secondary-400 font-medium">No organizations available for threat profiling.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {statusOverview.organizations.map((org: OrganizationProfilingOverview) => (
                    <div
                      key={org.client_name}
                      className="bg-gradient-to-r from-secondary-700/50 to-secondary-600/30 rounded-xl p-5 border border-secondary-600/30 hover:border-secondary-500/50 transition-all duration-300 hover:shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {isLEMaster(user) && (
                            <input
                              type="checkbox"
                              checked={selectedOrgs.includes(org.client_name)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedOrgs(prev => [...prev, org.client_name]);
                                } else {
                                  setSelectedOrgs(prev => prev.filter(name => name !== org.client_name));
                                }
                              }}
                              className="w-5 h-5 text-primary-600 bg-secondary-700 border-secondary-500 rounded focus:ring-primary-500 focus:ring-2"
                            />
                          )}
                          <div>
                            <h4 className="text-lg font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent">
                              {org.organization_name}
                            </h4>
                            <p className="text-sm text-secondary-400 font-medium">{org.client_name}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6">
                          <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 font-medium transition-colors ${getStatusColor(org.profiling_status)}`}>
                            {getStatusIcon(org.profiling_status)}
                            <span className="text-sm font-semibold capitalize">
                              {org.profiling_status.replace('_', ' ')}
                            </span>
                          </div>

                          <div className="text-center">
                            <p className="text-xs text-secondary-400 font-medium">Progress</p>
                            <p className="text-lg font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent">
                              {org.progress}%
                            </p>
                          </div>

                          <div className="text-center">
                            <p className="text-xs text-secondary-400 font-medium">Last Run</p>
                            <p className="text-sm font-semibold text-white">{formatDate(org.last_profiling_date)}</p>
                          </div>

                          <div className="text-center">
                            <p className="text-xs text-secondary-400 font-medium">Runs</p>
                            <p className="text-sm font-semibold text-white">
                              {org.runs_used}/{org.runs_remaining === 'unlimited' ? '∞' : org.runs_remaining}
                            </p>
                          </div>

                          <div className="flex items-center space-x-3">
                            {org.can_run_profiling && (
                              <div className="flex items-center space-x-1">
                                <span className="w-3 h-3 bg-green-500 rounded-full shadow-lg" title="Can run profiling"></span>
                                <span className="text-xs text-green-400 font-medium">Active</span>
                              </div>
                            )}
                            {org.has_results && (
                              <div className="flex items-center space-x-1">
                                <span className="w-3 h-3 bg-secondary-500 rounded-full shadow-lg" title="Has results"></span>
                                <span className="text-xs text-secondary-400 font-medium">Results</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {org.progress > 0 && (
                        <div className="mt-3">
                          <div className="w-full bg-secondary-800 rounded-full h-2 shadow-inner">
                            <div 
                              className="bg-gradient-to-r from-primary-500 to-primary-400 h-2 rounded-full shadow-md transition-all duration-300"
                              style={{width: org.progress + '%'}}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Bulk Status Modal */}
      <Modal show={showBulkModal} onClose={() => setShowBulkModal(false)}>
        <div className="bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 border border-secondary-700 rounded-xl shadow-2xl p-6">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent mb-6">
            Bulk Status Results
          </h3>
          
          {bulkStatusData ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {Object.entries(bulkStatusData.statuses).map(([clientName, status]) => (
                <div key={clientName} className="bg-gradient-to-r from-secondary-800/50 to-secondary-700/30 p-4 rounded-lg border border-secondary-600 hover:from-secondary-700/50 hover:to-secondary-600/30 transition-all duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-white font-semibold text-lg">{clientName}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border-2 ${getStatusColor(status.status)}`}>
                      {status.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div>
                      <span className="text-secondary-400 font-medium">Progress:</span>
                      <span className="text-white ml-2 font-semibold">{status.progress}%</span>
                    </div>
                    
                    <div>
                      <span className="text-secondary-400 font-medium">Can Rerun:</span>
                      <span className={`ml-2 font-semibold ${status.can_rerun ? 'text-green-400' : 'text-red-400'}`}>
                        {status.can_rerun ? 'Yes' : 'No'}
                      </span>
                    </div>
                    
                    <div>
                      <span className="text-secondary-400 font-medium">Has Results:</span>
                      <span className={`ml-2 font-semibold ${status.has_results ? 'text-green-400' : 'text-red-400'}`}>
                        {status.has_results ? 'Yes' : 'No'}
                      </span>
                    </div>
                    
                    {status.last_updated && (
                      <div>
                        <span className="text-secondary-400 font-medium">Last Updated:</span>
                        <span className="text-white ml-2 font-semibold">{formatDate(status.last_updated)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-secondary-300 text-center py-8">No bulk status data available.</p>
          )}

          <div className="flex justify-end mt-6">
            <Button
              onClick={() => setShowBulkModal(false)}
              className="bg-gradient-to-r from-secondary-600 to-secondary-700 hover:from-secondary-700 hover:to-secondary-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ThreatProfilingOverviewDashboard;