import React from 'react';
import ThreatProfilingLayout from '../../components/Common/ThreatProfilingLayout';

const TargetPage: React.FC = () => {
  return (
    <ThreatProfilingLayout>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Target</h1>
            <p className="text-lg text-secondary-400">Organization and application target details for threat assessment</p>
          </div>

          {/* Target Content */}
          <div className="bg-secondary-800/50 rounded-xl border border-secondary-700/50 p-8">
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-primary-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-4">Target Information</h2>
              <p className="text-secondary-400 mb-8 max-w-2xl mx-auto">
                This section contains detailed information about your organization and applications that are being assessed for threats and vulnerabilities.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="bg-secondary-900/50 p-6 rounded-lg text-left">
                  <h3 className="text-lg font-semibold text-white mb-3">Organization Profile</h3>
                  <ul className="space-y-2 text-secondary-300">
                    <li>• Organization structure and details</li>
                    <li>• Operational context and scope</li>
                    <li>• Industry sector classification</li>
                    <li>• Regulatory compliance requirements</li>
                  </ul>
                </div>
                
                <div className="bg-secondary-900/50 p-6 rounded-lg text-left">
                  <h3 className="text-lg font-semibold text-white mb-3">Application Assets</h3>
                  <ul className="space-y-2 text-secondary-300">
                    <li>• Web applications and services</li>
                    <li>• Network infrastructure components</li>
                    <li>• Data repositories and databases</li>
                    <li>• Third-party integrations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThreatProfilingLayout>
  );
};

export default TargetPage;