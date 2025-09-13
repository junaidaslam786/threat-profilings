import React from 'react';
import ThreatProfilingLayout from '../../components/Common/ThreatProfilingLayout';

const ComplianceE8Page: React.FC = () => {
  return (
    <ThreatProfilingLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent mb-4">
            Compliance: Essential Eight (E8)
          </h1>
          <p className="text-lg text-secondary-400">
            Essential Eight cybersecurity framework compliance assessment and mitigation strategies.
          </p>
        </div>

        <div className="bg-secondary-800/50 rounded-xl border border-secondary-700/50 p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <svg className="w-6 h-6 text-primary-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Essential Eight Mitigation Strategies
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Application Control',
              'Patch Applications',
              'Configure Microsoft Office Macro Settings',
              'User Application Hardening',
              'Restrict Administrative Privileges',
              'Patch Operating Systems',
              'Multi-factor Authentication',
              'Regular Backups'
            ].map((strategy, index) => (
              <div key={index} className="bg-secondary-900/50 p-4 rounded-lg">
                <h3 className="font-semibold text-primary-400 mb-2">
                  {index + 1}. {strategy}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <span className="text-sm text-secondary-400">Assessment Pending</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-amber-600/20 border border-amber-500/30 rounded-lg">
            <h4 className="font-semibold text-amber-300 mb-2">Implementation Maturity</h4>
            <p className="text-secondary-300 text-sm">
              This assessment will evaluate your organization's maturity level (1-3) for each
              Essential Eight mitigation strategy and provide actionable recommendations for improvement.
            </p>
          </div>
        </div>
      </div>
    </ThreatProfilingLayout>
  );
};

export default ComplianceE8Page;