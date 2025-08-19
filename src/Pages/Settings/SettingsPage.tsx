import React, { useState } from 'react';
import Navbar from '../../components/Common/Navbar';
import { useUser } from '../../hooks/useUser';

const SettingsPage: React.FC = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    security: true,
    marketing: false,
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'security', label: 'Security', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { id: 'notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { id: 'preferences', label: 'Preferences', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
      <Navbar />
      
      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent mb-3">
            Settings
          </h1>
          <p className="text-secondary-300 text-lg">
            Customize your experience and manage your preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
                        : 'text-secondary-300 hover:text-white hover:bg-secondary-700/50'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                    </svg>
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="lg:w-3/4">
            <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-8 border border-secondary-700/50">
              
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>
                  
                  <div className="flex items-center space-x-6 mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                      {(user?.user_info?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <button className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-500 hover:to-primary-600 transition-all duration-200 cursor-pointer">
                      Change Avatar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-2">Full Name</label>
                      <input
                        type="text"
                        defaultValue={user?.user_info?.name || 'John Doe'}
                        className="w-full px-4 py-3 bg-secondary-700/50 border border-secondary-600/50 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue={user?.user_info?.email || 'john@example.com'}
                        className="w-full px-4 py-3 bg-secondary-700/50 border border-secondary-600/50 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <button className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-500 hover:to-primary-600 transition-all duration-200 cursor-pointer">
                    Save Changes
                  </button>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>
                  
                  <div className="p-6 bg-secondary-700/30 rounded-lg border border-secondary-600/30">
                    <h3 className="text-lg font-semibold text-white mb-4">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-secondary-300">Add an extra layer of security to your account</p>
                        <p className="text-sm text-secondary-400 mt-1">Status: Enabled</p>
                      </div>
                      <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-all duration-200 cursor-pointer">
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-secondary-700/30 rounded-lg border border-secondary-600/30">
                        <div>
                          <h3 className="text-white font-medium capitalize">{key} Notifications</h3>
                          <p className="text-sm text-secondary-400">
                            {key === 'email' && 'Receive notifications via email'}
                            {key === 'push' && 'Receive push notifications on your devices'}
                            {key === 'security' && 'Get alerts about security events'}
                            {key === 'marketing' && 'Receive updates about new features and offers'}
                          </p>
                        </div>
                        <button
                          onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                            value ? 'bg-primary-600' : 'bg-secondary-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Application Preferences</h2>
                  
                  <div className="p-6 bg-secondary-700/30 rounded-lg border border-secondary-600/30">
                    <h3 className="text-lg font-semibold text-white mb-4">Appearance</h3>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-2">Theme</label>
                      <select className="w-full px-4 py-3 bg-secondary-700/50 border border-secondary-600/50 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors cursor-pointer">
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                  </div>

                  <button className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-500 hover:to-primary-600 transition-all duration-200 cursor-pointer">
                    Save Preferences
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;