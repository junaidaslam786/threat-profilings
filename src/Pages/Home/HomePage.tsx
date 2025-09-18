import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ThreatProfilingLayout from "../../components/Common/ThreatProfilingLayout";
import LoadingScreen from "../../components/Common/LoadingScreen";
import Button from "../../components/Common/Button";
import InputField from "../../components/Common/InputField";
import TextArea from "../../components/Common/TextArea";
import MultiSelect from "../../components/Common/MultiSelect";
import { useGetOrgsQuery, useUpdateOrgMutation } from "../../Redux/api/organizationsApi";
import { useStartProfilingMutation } from "../../Redux/api/threatProfilingApi";
import { useUser } from "../../hooks/useUser";
import { getIdToken } from "../../utils/authStorage";
import { WORLD_COUNTRIES } from "../../constants/countries";
import toast from "react-hot-toast";

type EditableField = 'sector' | 'countries_of_operation' | 'about_us_url' | 'additional_details' | 'govt_sector';

interface AppData {
  app_name: string;
  app_profile: string;
  app_additional_details?: string;
  app_url?: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading: userLoading } = useUser();

  // State for editing
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string | string[]>>({});
  const [govtSector, setGovtSector] = useState<string>('No');

  // Profiling state
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  // Check if user is authenticated
  const hasToken = !!getIdToken();

  // Check if user has L0 subscription level
  const hasL0Subscription = user?.subscriptions && user.subscriptions.length > 0 && 
                           user.subscriptions.some(sub => sub.subscription_level === 'L0');

  // Fetch organizations data only if authenticated and user doesn't have L0 subscription
  const { data: orgsData, isLoading: orgsLoading, error: orgsError } = useGetOrgsQuery(undefined, {
    skip: !hasToken || hasL0Subscription
  });

  // Update organization mutation
  const [updateOrg, { isLoading: isUpdating }] = useUpdateOrgMutation();

  // Start profiling mutation
  const [startProfiling] = useStartProfilingMutation();

  // Get the primary organization
  const organization = Array.isArray(orgsData) && orgsData.length > 0 ? orgsData[0] : 
                      orgsData && 'managed_orgs' in orgsData && orgsData.managed_orgs.length > 0 ? orgsData.managed_orgs[0] :
                      orgsData && 'le_master' in orgsData ? orgsData.le_master : null;

  // Load govt sector from localStorage on component mount
  useEffect(() => {
    if (organization?.client_name) {
      const savedGovtSector = localStorage.getItem(`govt_sector_${organization.client_name}`);
      if (savedGovtSector) {
        setGovtSector(savedGovtSector);
      }
    }
  }, [organization?.client_name]);

  // Helper functions for editing
  const startEditing = (field: EditableField, currentValue: string | string[]) => {
    setEditingField(field);
    setEditValues({ [field]: currentValue });
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditValues({});
  };

  const handleUpdate = async (field: EditableField) => {
    if (!organization) return;

    try {
      if (field === 'govt_sector') {
        // Save to localStorage for govt_sector
        const value = editValues[field] as string;
        localStorage.setItem(`govt_sector_${organization.client_name}`, value);
        setGovtSector(value);
        toast.success("Government sector updated successfully");
      } else {
        // Update via API for other fields
        const updateData = {
          [field]: editValues[field]
        };
        await updateOrg({
          clientName: organization.client_name,
          body: updateData
        }).unwrap();
        toast.success("Organization updated successfully");
      }
      
      setEditingField(null);
      setEditValues({});
    } catch (error) {
      console.error('Error updating organization:', error);
      toast.error("Update failed");
    }
  };

  const handleRunProfiling = async () => {
    if (!organization || !user) return;

    try {
      setIsRunning(true);
      setProgress(0);

      const token = getIdToken();
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 500);

      await startProfiling({
        client_name: organization.client_name
      }).unwrap();

      setProgress(100);
      toast.success("Threat profiling started successfully");
      
      setTimeout(() => {
        setIsRunning(false);
        setProgress(0);
      }, 1000);

    } catch (error) {
      console.error('Error starting profiling:', error);
      toast.error("Failed to start threat profiling");
      setIsRunning(false);
      setProgress(0);
    }
  };

  // Show loading only if user is loading or if user is authenticated, doesn't have L0, and orgs are loading
  if (userLoading || (hasToken && !hasL0Subscription && orgsLoading)) {
    return <LoadingScreen />;
  }

  // If user is not authenticated, redirect to login
  if (!hasToken || !user) {
    navigate('/auth/login');
    return null;
  }

  // If user has L0 subscription, show subscription prompt
  if (hasL0Subscription) {
    return (
      <ThreatProfilingLayout>
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent mb-4">
                Welcome to Threat Profiling
              </h1>
              <p className="text-lg text-secondary-400">By: CYORN</p>
            </div>

            {/* Subscription Required Card */}
            <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/30 rounded-xl p-8 text-center">
              <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-4">
                Subscription Required
              </h2>
              
              <p className="text-lg text-secondary-300 mb-6 max-w-2xl mx-auto">
                To activate your organization and start using the CYORN threat profiling tools, 
                you need to subscribe to a tier that fits your needs.
              </p>
              
              <div className="bg-secondary-800/50 rounded-lg p-6 mb-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-white mb-2">Your Current Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary-400">Organization:</span>
                    <span className="text-white">{user.accessible_organizations?.[0]?.organization_name || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-400">Current Plan:</span>
                    <span className="text-amber-400 font-medium">L0 (Inactive)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-400">Status:</span>
                    <span className="text-red-400">Requires Subscription</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('/payments')}
                  variant="primary"
                  className="px-8 py-3 text-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Subscribe to a Tier
                </Button>
              </div>
            </div>

            {/* Features Preview */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-secondary-800/30 rounded-lg p-6 text-center border border-secondary-700/50">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Threat Assessment</h3>
                <p className="text-sm text-secondary-400">Comprehensive threat profiling for your organization</p>
              </div>
              
              <div className="bg-secondary-800/30 rounded-lg p-6 text-center border border-secondary-700/50">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Real-time Scanning</h3>
                <p className="text-sm text-secondary-400">Monitor your applications and infrastructure</p>
              </div>
              
              <div className="bg-secondary-800/30 rounded-lg p-6 text-center border border-secondary-700/50">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Detailed Reports</h3>
                <p className="text-sm text-secondary-400">Comprehensive security reports and recommendations</p>
              </div>
            </div>
          </div>
        </div>
      </ThreatProfilingLayout>
    );
  }

  if (orgsError || !organization) {
    return (
      <ThreatProfilingLayout>
        <div className="p-6">
          <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-red-400 mb-2">No Organization Found</h3>
            <p className="text-secondary-300 mb-4">
              No organization data available. Please contact support if this persists.
            </p>
            <Button onClick={() => navigate('/orgs')} variant="primary">
              Manage Organizations
            </Button>
          </div>
        </div>
      </ThreatProfilingLayout>
    );
  }

  // Calculate remaining runs and quota information
  const totalRuns = user?.subscriptions?.[0]?.run_quota || 0;
  const usedRuns = 0; // Would need to be tracked in backend/state
  const remainingRuns = Math.max(0, totalRuns - usedRuns);

  const canRunProfiling = user?.roles_and_permissions?.permissions?.can_run_profiling ?? false;

  return (
    <ThreatProfilingLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">
                Threat Readiness Action Plan
              </h1>
              <p className="text-lg text-secondary-400 mt-2">By: CYORN</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-primary-600/20 to-primary-500/20 border border-primary-500/30 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">
              Organization: {organization.organization_name}
            </h2>
            <p className="text-secondary-300">
              Comprehensive threat profiling and security assessment for your organization's digital assets and infrastructure.
            </p>
          </div>
        </div>

        {/* Organization Details Card */}
        <div className="bg-secondary-800/50 rounded-xl border border-secondary-700/50 p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <svg className="w-6 h-6 text-primary-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6m-6 4h6" />
            </svg>
            Organization Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Organization Name - Not Editable */}
              <div className="bg-secondary-900/50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-primary-400 mb-2">Organization Name</label>
                <p className="text-white">{organization.organization_name}</p>
              </div>
              
              {/* Sector - Editable */}
              <div className="bg-secondary-900/50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-primary-400 mb-2">Sector</label>
                {editingField === 'sector' ? (
                  <div className="space-y-3">
                    <InputField
                      label=""
                      type="text"
                      name="sector"
                      value={(editValues.sector as string) || ''}
                      onChange={(e) => setEditValues({ ...editValues, sector: e.target.value })}
                      placeholder="Enter sector"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleUpdate('sector')}
                        variant="primary"
                        disabled={isUpdating}
                      >
                        {isUpdating ? 'Updating...' : 'Update'}
                      </Button>
                      <Button
                        onClick={cancelEditing}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p 
                    className="text-white cursor-pointer hover:text-primary-300 transition-colors"
                    onClick={() => startEditing('sector', organization.sector || '')}
                  >
                    {organization.sector || 'Not specified'}
                  </p>
                )}
              </div>
              
              {/* Operating Countries - Editable with MultiSelect */}
              <div className="bg-secondary-900/50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-primary-400 mb-2">Operating Countries</label>
                {editingField === 'countries_of_operation' ? (
                  <div className="space-y-3">
                    <MultiSelect
                      id="countries"
                      label=""
                      options={WORLD_COUNTRIES}
                      values={(editValues.countries_of_operation as string[]) || []}
                      onChange={(values) => setEditValues({ ...editValues, countries_of_operation: values })}
                      placeholder="Select countries"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleUpdate('countries_of_operation')}
                        variant="primary"
                        disabled={isUpdating}
                      >
                        {isUpdating ? 'Updating...' : 'Update'}
                      </Button>
                      <Button
                        onClick={cancelEditing}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p 
                    className="text-white cursor-pointer hover:text-primary-300 transition-colors"
                    onClick={() => startEditing('countries_of_operation', organization.countries_of_operation || [])}
                  >
                    {organization.countries_of_operation && organization.countries_of_operation.length > 0
                      ? organization.countries_of_operation.map((country: string) => 
                          WORLD_COUNTRIES.find(c => c.value === country)?.label || country
                        ).join(', ')
                      : 'Not specified'
                    }
                  </p>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              {/* About Us URL - Editable */}
              <div className="bg-secondary-900/50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-primary-400 mb-2">About Us URL</label>
                {editingField === 'about_us_url' ? (
                  <div className="space-y-3">
                    <InputField
                      label=""
                      type="url"
                      name="about_us_url"
                      value={(editValues.about_us_url as string) || ''}
                      onChange={(e) => setEditValues({ ...editValues, about_us_url: e.target.value })}
                      placeholder="Enter About Us URL"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleUpdate('about_us_url')}
                        variant="primary"
                        disabled={isUpdating}
                      >
                        {isUpdating ? 'Updating...' : 'Update'}
                      </Button>
                      <Button
                        onClick={cancelEditing}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p 
                    className="text-white cursor-pointer hover:text-primary-300 transition-colors"
                    onClick={() => startEditing('about_us_url', organization.about_us_url || '')}
                  >
                    {organization.about_us_url || 'Not specified'}
                  </p>
                )}
              </div>
              
              {/* Government Sector - Editable with localStorage */}
              <div className="bg-secondary-900/50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-primary-400 mb-2">Govt Sector</label>
                {editingField === 'govt_sector' ? (
                  <div className="space-y-3">
                    <select
                      value={editValues.govt_sector || govtSector}
                      onChange={(e) => setEditValues({ ...editValues, govt_sector: e.target.value })}
                      className="w-full px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleUpdate('govt_sector')}
                        variant="primary"
                      >
                        Update
                      </Button>
                      <Button
                        onClick={cancelEditing}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p 
                    className="text-white cursor-pointer hover:text-primary-300 transition-colors"
                    onClick={() => startEditing('govt_sector', govtSector)}
                  >
                    {govtSector}
                  </p>
                )}
              </div>
              
              {/* Additional Context - Editable */}
              <div className="bg-secondary-900/50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-primary-400 mb-2">Additional Context</label>
                {editingField === 'additional_details' ? (
                  <div className="space-y-3">
                    <TextArea
                      id="additional_details"
                      label=""
                      value={(editValues.additional_details as string) || ''}
                      onChange={(e) => setEditValues({ ...editValues, additional_details: e.target.value })}
                      placeholder="Enter additional details"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleUpdate('additional_details')}
                        variant="primary"
                        disabled={isUpdating}
                      >
                        {isUpdating ? 'Updating...' : 'Update'}
                      </Button>
                      <Button
                        onClick={cancelEditing}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p 
                    className="text-white text-sm leading-relaxed cursor-pointer hover:text-primary-300 transition-colors"
                    onClick={() => startEditing('additional_details', organization.additional_details || '')}
                  >
                    {organization.additional_details || 'No additional details provided.'}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Run Profiling Section */}
          <div className="mt-8 pt-6 border-t border-secondary-700">
            <div className="flex flex-col items-center space-y-4">
              {/* Progress Bar - only show when running */}
              {isRunning && (
                <div className="w-full max-w-md">
                  <div className="flex items-center justify-between text-sm text-secondary-300 mb-2">
                    <span>Profiling Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-secondary-700 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Run button with quota info */}
              <div className="text-center">
                <Button
                  onClick={handleRunProfiling}
                  disabled={isRunning || !canRunProfiling || remainingRuns <= 0}
                  loading={isRunning}
                  variant="primary"
                  className="px-8 py-3 text-lg"
                >
                  {isRunning ? "Running Profiling..." : "Run Profiling"}
                </Button>
                
                {/* Quota information */}
                <div className="mt-2 text-sm text-secondary-400">
                  <span className="font-medium text-primary-400">{remainingRuns}</span> of{" "}
                  <span className="font-medium">{totalRuns}</span> runs remaining
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Applications Section */}
        {organization.apps && organization.apps.length > 0 && (
          <div className="bg-secondary-800/50 rounded-xl border border-secondary-700/50 p-6 mb-8">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <svg className="w-6 h-6 text-secondary-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              Applications
            </h3>
            
            <div className="space-y-6">
              {organization.apps.map((app: AppData, index: number) => (
                <div key={index} className="bg-secondary-900/50 rounded-lg p-4 border border-secondary-600/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-400 mb-1">Application Name</label>
                      <p className="text-white font-medium">{app.app_name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-400 mb-1">Application Profile</label>
                      <p className="text-white">{app.app_profile}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-secondary-400 mb-1">Application Details</label>
                      <p className="text-secondary-300">{app.app_additional_details || 'No additional details'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-secondary-400 mb-1">Application Link</label>
                      <p className="text-white">{app.app_url || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status Overview */}
        <div className="bg-secondary-800/50 rounded-xl border border-secondary-700/50 p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <svg className="w-6 h-6 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Assessment Progress
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-secondary-400">7</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-1">Assessment Areas</h4>
              <p className="text-sm text-secondary-400">Complete threat profiling sections</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-amber-400">
                  {organization.apps?.length || 0}
                </span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-1">Applications</h4>
              <p className="text-sm text-secondary-400">Systems under assessment</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-green-400">0%</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-1">Completion</h4>
              <p className="text-sm text-secondary-400">Overall progress status</p>
            </div>
          </div>
        </div>
      </div>
    </ThreatProfilingLayout>
  );
};

export default HomePage;