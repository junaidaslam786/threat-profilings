import React from 'react';
import ThreatProfilingLayout from '../../components/Common/ThreatProfilingLayout';

const ComplianceIsmPage: React.FC = () => {
  return (
    <ThreatProfilingLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent mb-4">
            Compliance: Information Security Manual (ISM)
          </h1>
          <p className="text-lg text-secondary-400">
            Information Security Manual compliance framework assessment and reporting.
          </p>
        </div>

        <div className="bg-secondary-800/50 rounded-xl border border-secondary-700/50 p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <svg className="w-6 h-6 text-primary-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            ISM Compliance Assessment
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-secondary-900/50 p-4 rounded-lg">
              <h3 className="font-semibold text-primary-400 mb-2">Governance</h3>
              <p className="text-secondary-300 text-sm">
                Assessment of governance frameworks and information security policies.
              </p>
            </div>
            
            <div className="bg-secondary-900/50 p-4 rounded-lg">
              <h3 className="font-semibold text-primary-400 mb-2">Physical Security</h3>
              <p className="text-secondary-300 text-sm">
                Evaluation of physical security controls and access management.
              </p>
            </div>
            
            <div className="bg-secondary-900/50 p-4 rounded-lg">
              <h3 className="font-semibold text-primary-400 mb-2">Personnel Security</h3>
              <p className="text-secondary-300 text-sm">
                Review of personnel security clearances and background checks.
              </p>
            </div>
            
            <div className="bg-secondary-900/50 p-4 rounded-lg">
              <h3 className="font-semibold text-primary-400 mb-2">Communications Security</h3>
              <p className="text-secondary-300 text-sm">
                Analysis of communication protection and encryption standards.
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-600/20 border border-blue-500/30 rounded-lg">
            <h4 className="font-semibold text-blue-300 mb-2">Compliance Status</h4>
            <p className="text-secondary-300 text-sm">
              This page will be expanded to include detailed ISM compliance requirements,
              assessment tools, and automated compliance reporting capabilities.
            </p>
          </div>
        </div>
      </div>
    </ThreatProfilingLayout>
  );
};

export default ComplianceIsmPage;