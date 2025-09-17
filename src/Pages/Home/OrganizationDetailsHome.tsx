import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ThreatProfilingLayout from '../../components/Common/ThreatProfilingLayout';
import LoadingScreen from '../../components/Common/LoadingScreen';
import Button from '../../components/Common/Button';
import InputField from '../../components/Common/InputField';
import TextArea from '../../components/Common/TextArea';
import MultiSelect from '../../components/Common/MultiSelect';
import { useGetOrgQuery, useUpdateOrgMutation } from '../../Redux/api/organizationsApi';
import type { ClientDataDto } from '../../Redux/slices/organizationsSlice';
import { WORLD_COUNTRIES } from '../../constants/countries';

interface OrganizationDetailsHomeProps {
  className?: string;
}

type EditableField = 'sector' | 'countries_of_operation' | 'website_url' | 'additional_details' | 'govt_sector';

const OrganizationDetailsHome: React.FC<OrganizationDetailsHomeProps> = ({ className = '' }) => {
  const { client_name } = useParams<{ client_name: string }>();
  const navigate = useNavigate();

  // State for editing
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string | string[]>>({});
  const [govtSector, setGovtSector] = useState<string>('No');

  // Fetch organization data
  const { data: orgData, isLoading: orgLoading, error: orgError } = useGetOrgQuery(client_name!, {
    skip: !client_name,
  });

  // Update organization mutation
  const [updateOrg, { isLoading: isUpdating }] = useUpdateOrgMutation();

  // Load govt sector from localStorage on component mount
  useEffect(() => {
    if (client_name) {
      const savedGovtSector = localStorage.getItem(`govt_sector_${client_name}`);
      if (savedGovtSector) {
        setGovtSector(savedGovtSector);
      }
    }
  }, [client_name]);

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
    if (!org || !client_name) return;

    try {
      if (field === 'govt_sector') {
        // Save to localStorage for govt_sector
        const value = editValues[field] as string;
        localStorage.setItem(`govt_sector_${client_name}`, value);
        setGovtSector(value);
      } else {
        // Update via API for other fields
        const updateData = {
          clientName: client_name,
          body: {
            [field]: editValues[field]
          }
        };
        await updateOrg(updateData).unwrap();
      }
      
      setEditingField(null);
      setEditValues({});
    } catch (error) {
      console.error('Error updating organization:', error);
    }
  };

  // Helper function to extract organization data
  const getOrgData = (data: typeof orgData): ClientDataDto | null => {
    if (!data) return null;
    if ("managed_org" in data && data.managed_org) {
      return data.managed_org;
    }
    if ("client_name" in data && "organization_name" in data) {
      return data as ClientDataDto;
    }
    return null;
  };

  const org = getOrgData(orgData);

  if (orgLoading) {
    return <LoadingScreen />;
  }

  if (orgError || !org) {
    return (
      <ThreatProfilingLayout>
        <div className="p-6">
          <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-red-400 mb-2">Organization Not Found</h3>
            <p className="text-secondary-300 mb-4">
              The organization "{client_name}" could not be found or you don't have access to it.
            </p>
            <Button onClick={() => navigate('/home')} variant="primary">
              Back to Home
            </Button>
          </div>
        </div>
      </ThreatProfilingLayout>
    );
  }

  return (
    <ThreatProfilingLayout>
      <div className={`p-6 ${className}`}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">
                Threat Readiness Action Plan
              </h1>
              <p className="text-lg text-secondary-400 mt-2">By: Fortilligence</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-primary-600/20 to-primary-500/20 border border-primary-500/30 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">
              Organization: {org.organization_name}
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
                <p className="text-white">{org.organization_name}</p>
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
                    onClick={() => startEditing('sector', org.sector || '')}
                  >
                    {org.sector || 'Not specified'}
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
                    onClick={() => startEditing('countries_of_operation', org.countries_of_operation || [])}
                  >
                    {org.countries_of_operation && org.countries_of_operation.length > 0
                      ? org.countries_of_operation.map(country => 
                          WORLD_COUNTRIES.find(c => c.value === country)?.label || country
                        ).join(', ')
                      : 'Not specified'
                    }
                  </p>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              {/* About Us URL (previously Website) - Editable */}
              <div className="bg-secondary-900/50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-primary-400 mb-2">About Us URL</label>
                {editingField === 'website_url' ? (
                  <div className="space-y-3">
                    <InputField
                      label=""
                      type="url"
                      name="website_url"
                      value={(editValues.website_url as string) || ''}
                      onChange={(e) => setEditValues({ ...editValues, website_url: e.target.value })}
                      placeholder="Enter About Us URL"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleUpdate('website_url')}
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
                    onClick={() => startEditing('website_url', org.website_url || '')}
                  >
                    {org.website_url || 'Not specified'}
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
                    onClick={() => startEditing('additional_details', org.additional_details || '')}
                  >
                    {org.additional_details || 'No additional details provided.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Applications Section */}
        {org.apps && org.apps.length > 0 && (
          <div className="bg-secondary-800/50 rounded-xl border border-secondary-700/50 p-6 mb-8">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <svg className="w-6 h-6 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              Applications
            </h3>
            
            <div className="space-y-6">
              {org.apps.map((app, index) => (
                <div key={index} className="bg-secondary-900/50 rounded-lg p-4 border border-secondary-600/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-400 mb-1">Application Name</label>
                      <p className="text-white font-medium">{app.app_name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-400 mb-1">Application Profile</label>
                      <p className="text-white">{app.app_profile}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-blue-400 mb-1">Application Details</label>
                      <p className="text-secondary-300">{app.app_additional_details || 'No additional details'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-blue-400 mb-1">Application Link</label>
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
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-blue-400">7</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-1">Assessment Areas</h4>
              <p className="text-sm text-secondary-400">Complete threat profiling sections</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-amber-400">
                  {org.apps?.length || 0}
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

export default OrganizationDetailsHome;