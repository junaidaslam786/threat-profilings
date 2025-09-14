import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetOrgQuery } from '../../Redux/api/organizationsApi';
import Layout from '../../components/Common/Layout';
import Button from '../../components/Common/Button';
import type { ClientDataDto } from '../../Redux/slices/organizationsSlice';

const OrganizationSettingsPage: React.FC = () => {
  const { client_name } = useParams<{ client_name: string }>();
  const navigate = useNavigate();
  const { data: orgData, isLoading } = useGetOrgQuery(client_name!, { skip: !client_name });

  const getOrgData = (data: typeof orgData): ClientDataDto | null => {
    if (!data) return null;
    if ("managed_org" in data && data.managed_org) return data.managed_org;
    if ("client_name" in data && "organization_name" in data) return data as ClientDataDto;
    return null;
  };

  const org = getOrgData(orgData);

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      push: true,
      securityAlerts: true,
      reportGeneration: true,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      ipWhitelist: '',
      apiAccess: true,
    },
    privacy: {
      dataRetention: 365,
      shareAnalytics: false,
      allowThirdParty: false,
    },
  });

  const handleSave = () => {
    console.log('Saving settings:', settings);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </Layout>
    );
  }

  if (!org) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-white mb-4">Organization Not Found</h2>
          <Button onClick={() => navigate('/orgs')}>Back to Organizations</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-secondary-800/50 rounded-xl border border-secondary-700/30 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Organization Settings</h1>
              <p className="text-secondary-400">{org.organization_name}</p>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate("/orgs")}
            >
              Back
            </Button>
          </div>

          <div className="space-y-8">
            {/* Notifications Settings */}
            <div className="bg-secondary-700/30 rounded-xl p-6 border border-secondary-600/30">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h8v-2H4v2zM4 11h10V9H4v2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Notification Preferences</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <label key={key} className="flex items-center space-x-3 p-3 bg-secondary-800/50 rounded-lg">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, [key]: e.target.checked }
                      })}
                      className="w-4 h-4 text-primary-500 bg-secondary-700 border-secondary-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-white capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-secondary-700/30 rounded-xl p-6 border border-secondary-600/30">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Security Settings</h3>
              </div>
              <div className="space-y-4">
                <label className="flex items-center space-x-3 p-3 bg-secondary-800/50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={settings.security.twoFactorAuth}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, twoFactorAuth: e.target.checked }
                    })}
                    className="w-4 h-4 text-primary-500 bg-secondary-700 border-secondary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-white">Enable Two-Factor Authentication</span>
                </label>
                <div className="p-3 bg-secondary-800/50 rounded-lg">
                  <label className="block text-white mb-2">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
                    })}
                    className="w-full p-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white"
                  />
                </div>
                <div className="p-3 bg-secondary-800/50 rounded-lg">
                  <label className="block text-white mb-2">IP Whitelist (comma-separated)</label>
                  <input
                    type="text"
                    value={settings.security.ipWhitelist}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, ipWhitelist: e.target.value }
                    })}
                    placeholder="192.168.1.1, 10.0.0.1"
                    className="w-full p-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white"
                  />
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-secondary-700/30 rounded-xl p-6 border border-secondary-600/30">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Privacy Settings</h3>
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-secondary-800/50 rounded-lg">
                  <label className="block text-white mb-2">Data Retention Period (days)</label>
                  <input
                    type="number"
                    value={settings.privacy.dataRetention}
                    onChange={(e) => setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, dataRetention: parseInt(e.target.value) }
                    })}
                    className="w-full p-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white"
                  />
                </div>
                <label className="flex items-center space-x-3 p-3 bg-secondary-800/50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={settings.privacy.shareAnalytics}
                    onChange={(e) => setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, shareAnalytics: e.target.checked }
                    })}
                    className="w-4 h-4 text-primary-500 bg-secondary-700 border-secondary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-white">Share Anonymous Analytics</span>
                </label>
                <label className="flex items-center space-x-3 p-3 bg-secondary-800/50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={settings.privacy.allowThirdParty}
                    onChange={(e) => setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, allowThirdParty: e.target.checked }
                    })}
                    className="w-4 h-4 text-primary-500 bg-secondary-700 border-secondary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-white">Allow Third-Party Integrations</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="ghost" onClick={() => navigate("/orgs")}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrganizationSettingsPage;