import React, { useState } from 'react';
import { useUser } from '../../hooks/useUser';
import { isLEMaster, isOrgAdmin } from '../../utils/roleUtils';
import Button from '../Common/Button';
import {
  useGetFieldLocksQuery,
  useIsFieldLockedQuery,
} from '../../Redux/api/threatProfilingApi';

interface FieldLockManagerProps {
  clientName?: string;
}

const FieldLockManager: React.FC<FieldLockManagerProps> = ({ clientName }) => {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState<string>('');

  // Validate and sanitize clientName
  const sanitizedClientName = clientName?.trim();

  const {
    data: fieldLocks,
    isLoading,
    error,
    refetch,
  } = useGetFieldLocksQuery(
    sanitizedClientName!,
    { skip: !sanitizedClientName }
  );

  const {
    data: fieldLockStatus,
    isLoading: isCheckingLock,
  } = useIsFieldLockedQuery(
    { clientName: sanitizedClientName!, fieldName: selectedField },
    { skip: !sanitizedClientName || !selectedField }
  );

  // Check if user has permission to manage field locks
  const hasPermission = user && (isLEMaster(user) || isOrgAdmin(user));

  if (!hasPermission) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">You don't have permission to manage field locks.</p>
      </div>
    );
  }

  if (!sanitizedClientName) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Please select an organization to manage field locks.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">API Error</h3>
        <p className="text-gray-400">Failed to load field locks: {String(error)}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-secondary-600 text-white rounded hover:bg-secondary-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const getFieldDisplayName = (fieldName: string) => {
    return fieldName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  // Common organization fields that might be locked
  const commonFields = [
    'organization_name',
    'org_domain', 
    'industry_sector',
    'government',
    'operating_countries',
    'primary_contact',
    'business_type',
    'employee_count',
    'annual_revenue',
    'headquarters_location',
    'compliance_requirements',
    'risk_tolerance',
    'security_budget',
    'existing_security_tools',
  ];

  const filteredFields = commonFields.filter(fieldName =>
    fieldName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 border border-secondary-700 rounded-xl shadow-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-secondary-700 pb-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent">
            Field Lock Manager
          </h2>
          <p className="text-secondary-400 mt-1 font-medium">Manage field locks for {clientName}</p>
        </div>
        <Button
          onClick={() => refetch()}
          className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search fields..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-3 border border-secondary-600 rounded-lg leading-5 bg-secondary-800/50 placeholder-secondary-400 text-white focus:outline-none focus:placeholder-secondary-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-secondary-600 border-t-primary-500 mx-auto"></div>
          <p className="text-secondary-300 mt-4 font-medium">Loading field locks...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-700/50 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-red-300 font-medium">Failed to load field locks: {String(error)}</p>
        </div>
      )}

      {/* Field Lock Information */}
      {fieldLocks && (
        <div className="bg-gradient-to-r from-secondary-800/50 to-secondary-700/30 rounded-xl border border-secondary-600 shadow-xl">
          <div className="p-6 border-b border-secondary-600">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent">
              Field Lock Status
            </h3>
            {fieldLocks && (
              <div className="mt-4 bg-gradient-to-r from-primary-900/20 to-primary-800/10 p-6 rounded-lg border border-primary-500/30 backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <span className="text-secondary-400 font-medium">Locked Fields:</span>
                    <span className="text-white ml-2 font-bold text-lg">
                      {fieldLocks.locked_fields?.length || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-secondary-400 font-medium">Locked At:</span>
                    <span className="text-white ml-2 font-semibold">{formatDate(fieldLocks.locked_at)}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-secondary-400 font-medium">Reason:</span>
                    <span className="text-white ml-2 font-semibold">{fieldLocks.locked_reason}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-secondary-400 font-medium">Can Unlock:</span>
                    <span className="text-white ml-2 font-semibold">
                      {fieldLocks.can_unlock?.join(', ') || 'None specified'}
                    </span>
                  </div>
                </div>
                
                {fieldLocks.locked_fields && fieldLocks.locked_fields.length > 0 && (
                  <div className="mt-6">
                    <span className="text-secondary-400 block mb-3 font-medium">Locked Fields:</span>
                    <div className="flex flex-wrap gap-3">
                      {fieldLocks.locked_fields.map((field) => (
                        <span
                          key={field}
                          className="px-4 py-2 bg-gradient-to-r from-red-600/30 to-red-500/20 text-red-300 rounded-full text-sm border border-red-500/50 font-medium shadow-md backdrop-blur-sm"
                        >
                          {getFieldDisplayName(field)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-6">
            <h4 className="text-lg font-semibold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent mb-6">
              Check Individual Field Status
            </h4>
            
            {filteredFields.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-secondary-400 font-medium">
                  {searchTerm ? 'No fields match your search.' : 'No fields available to check.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFields.map((fieldName) => {
                  const isLocked = fieldLocks?.locked_fields?.includes(fieldName) || false;
                  
                  return (
                    <div
                      key={fieldName}
                      className={`bg-gradient-to-br from-secondary-800/60 to-secondary-700/40 rounded-lg p-5 border transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-xl backdrop-blur-sm ${
                        isLocked 
                          ? 'border-red-500/50 hover:border-red-400/70 shadow-lg shadow-red-500/10' 
                          : 'border-green-500/50 hover:border-green-400/70 shadow-lg shadow-green-500/10'
                      }`}
                      onClick={() => setSelectedField(fieldName)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {isLocked ? (
                            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                            </svg>
                          )}
                          <h4 className="text-white font-semibold text-sm">{getFieldDisplayName(fieldName)}</h4>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 shadow-md ${
                          isLocked 
                            ? 'bg-gradient-to-r from-red-600/30 to-red-500/20 text-red-300 border-red-500/50' 
                            : 'bg-gradient-to-r from-green-600/30 to-green-500/20 text-green-300 border-green-500/50'
                        }`}>
                          {isLocked ? 'Locked' : 'Unlocked'}
                        </span>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="text-secondary-400 font-medium">Field Name:</span>
                          <span className="text-white ml-2 font-mono text-xs bg-secondary-700/50 px-2 py-1 rounded">{fieldName}</span>
                        </div>
                        
                        {selectedField === fieldName && fieldLockStatus && (
                          <div className="mt-3 p-3 bg-gradient-to-r from-secondary-700/50 to-secondary-600/30 rounded-lg border border-secondary-600/50 backdrop-blur-sm">
                            <div className="text-xs text-secondary-300 font-medium">
                              Detailed Status: <span className={`font-bold ${isLocked ? 'text-red-300' : 'text-green-300'}`}>
                                {fieldLockStatus.is_locked ? 'Locked' : 'Unlocked'}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {selectedField === fieldName && isCheckingLock && (
                          <div className="mt-3 p-3 bg-gradient-to-r from-secondary-700/50 to-secondary-600/30 rounded-lg border border-secondary-600/50 backdrop-blur-sm">
                            <div className="flex items-center text-xs text-secondary-300 font-medium">
                              <div className="animate-spin rounded-full h-3 w-3 border-2 border-secondary-400 border-t-primary-500 mr-2"></div>
                              Checking status...
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldLockManager;