import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../Redux/hooks';
import { 
  openApplicationModal,
  setApplicationsLoading,
  setApplicationsError 
} from '../../Redux/slices/applicationsSlice';
import { 
  useGetApplicationsQuery 
} from '../../Redux/api/applicationsApi';
import ApplicationCard from './ApplicationCard';
import ApplicationModal from './ApplicationModal';
import Button from '../Common/Button';
import LoadingScreen from '../Common/LoadingScreen';
import { useUser } from '../../hooks/useUser';

interface ApplicationManagementProps {
  className?: string;
}

const ApplicationManagement: React.FC<ApplicationManagementProps> = ({ className = "" }) => {
  const dispatch = useAppDispatch();
  const { isOrgAdmin, isLEAdmin } = useUser();
  
  const { loading, error } = useAppSelector((state) => state.applications);
  
  // Fetch applications for current organization
  const { 
    data: applicationsData, 
    isLoading: applicationsLoading, 
    error: applicationsError,
    refetch: refetchApplications
  } = useGetApplicationsQuery();

  // Check user permissions - use role checking functions from useUser
  const canCreateApps = isOrgAdmin || isLEAdmin;

  useEffect(() => {
    dispatch(setApplicationsLoading(applicationsLoading));
  }, [applicationsLoading, dispatch]);

  useEffect(() => {
    if (applicationsError) {
      dispatch(setApplicationsError('Failed to load applications'));
      toast.error('Failed to load applications');
    }
  }, [applicationsError, dispatch]);

  const handleCreateApp = () => {
    if (!canCreateApps) return;
    dispatch(openApplicationModal({ mode: 'create' }));
  };

  const handleRefresh = () => {
    refetchApplications();
  };

  const apps = applicationsData?.apps || [];
  const summary = applicationsData?.summary;

  if (loading.applications) {
    return (
      <div className={`bg-secondary-800/50 rounded-xl border border-secondary-700/50 p-6 ${className}`}>
        <LoadingScreen />
      </div>
    );
  }

  return (
    <>
      <div className={`bg-secondary-800/50 rounded-xl border border-secondary-700/50 p-6 ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-secondary-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
            <h3 className="text-xl font-semibold text-white">Applications</h3>
            <span className="ml-3 px-2 py-1 bg-secondary-600/20 text-secondary-400 text-sm rounded-full">
              {apps.length}
            </span>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={handleRefresh}
              variant="secondary"
              className="text-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </Button>
            
            {canCreateApps && (
              <Button
                onClick={handleCreateApp}
                variant="primary"
                className="text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Application
              </Button>
            )}
          </div>
        </div>

        {/* Summary Statistics */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 p-4 bg-secondary-900/50 rounded-lg border border-secondary-600/30">
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-400">{summary.total_apps}</div>
              <div className="text-sm text-secondary-400">Total Apps</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{summary.active_apps}</div>
              <div className="text-sm text-secondary-400">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">{summary.archived_apps}</div>
              <div className="text-sm text-secondary-400">Archived</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{summary.recent_scans}</div>
              <div className="text-sm text-secondary-400">Recent Scans</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {summary.average_threat_score ? summary.average_threat_score.toFixed(1) : 'N/A'}
              </div>
              <div className="text-sm text-secondary-400">Avg Threat Score</div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error.applications && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-300 text-sm">{error.applications}</span>
            </div>
          </div>
        )}

        {/* Permission Notice */}
        {!canCreateApps && (
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-yellow-300 text-sm">
                You have view-only access to applications. Only administrators can create and manage applications.
              </span>
            </div>
          </div>
        )}

        {/* Applications List */}
        {apps.length > 0 ? (
          <div className="space-y-6">
            {apps.map((app) => (
              <ApplicationCard
                key={app.app_id}
                application={app}
                showActions={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-secondary-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
            <h4 className="text-lg font-semibold text-white mb-2">No Applications Found</h4>
            <p className="text-secondary-400 mb-6">
              No applications have been added to this organization yet.
            </p>
            {canCreateApps && (
              <Button
                onClick={handleCreateApp}
                variant="primary"
                className="inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Application
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Application Modal */}
      <ApplicationModal />
    </>
  );
};

export default ApplicationManagement;