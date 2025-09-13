import React from 'react';
import ThreatProfilingLayout from '../../components/Common/ThreatProfilingLayout';

const IntroPage: React.FC = () => {
  return (
    <ThreatProfilingLayout>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Introduction</h1>
            <p className="text-lg text-secondary-400">Overview and introduction to threat profiling methodology</p>
          </div>

          {/* Introduction Content */}
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-primary-600/20 to-primary-500/20 border border-primary-500/30 rounded-xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-primary-600/30 rounded-full flex items-center justify-center mr-6">
                  <svg className="w-8 h-8 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-2">Welcome to Threat Profiling</h2>
                  <p className="text-primary-200">Comprehensive security assessment and threat analysis</p>
                </div>
              </div>
              <p className="text-secondary-300 leading-relaxed">
                This comprehensive threat profiling assessment will help identify potential security risks, 
                vulnerabilities, and defensive measures for your organization's digital assets and infrastructure. 
                Our methodology follows industry best practices and regulatory frameworks to ensure thorough coverage.
              </p>
            </div>

            {/* Methodology Overview */}
            <div className="bg-secondary-800/50 rounded-xl border border-secondary-700/50 p-8">
              <h3 className="text-xl font-semibold text-white mb-6">Assessment Methodology</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-secondary-900/50 p-6 rounded-lg">
                  <div className="w-12 h-12 bg-blue-600/30 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-3">Target Analysis</h4>
                  <p className="text-secondary-400 text-sm">
                    Comprehensive profiling of your organization's assets, applications, and infrastructure components.
                  </p>
                </div>

                <div className="bg-secondary-900/50 p-6 rounded-lg">
                  <div className="w-12 h-12 bg-amber-600/30 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-3">Threat Actor Profiling</h4>
                  <p className="text-secondary-400 text-sm">
                    Identification and analysis of potential adversaries who might target your organization.
                  </p>
                </div>

                <div className="bg-secondary-900/50 p-6 rounded-lg">
                  <div className="w-12 h-12 bg-red-600/30 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-3">TTP Analysis</h4>
                  <p className="text-secondary-400 text-sm">
                    Analysis of Tactics, Techniques, and Procedures that adversaries might employ.
                  </p>
                </div>

                <div className="bg-secondary-900/50 p-6 rounded-lg">
                  <div className="w-12 h-12 bg-green-600/30 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-3">Detection Strategies</h4>
                  <p className="text-secondary-400 text-sm">
                    Implementation of monitoring and detection capabilities to identify threats.
                  </p>
                </div>

                <div className="bg-secondary-900/50 p-6 rounded-lg">
                  <div className="w-12 h-12 bg-purple-600/30 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-3">ISM Compliance</h4>
                  <p className="text-secondary-400 text-sm">
                    Assessment against Information Security Manual requirements and guidelines.
                  </p>
                </div>

                <div className="bg-secondary-900/50 p-6 rounded-lg">
                  <div className="w-12 h-12 bg-teal-600/30 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-3">Essential Eight</h4>
                  <p className="text-secondary-400 text-sm">
                    Evaluation against the Essential Eight cybersecurity framework principles.
                  </p>
                </div>
              </div>
            </div>

            {/* Process Flow */}
            <div className="bg-secondary-800/50 rounded-xl border border-secondary-700/50 p-8">
              <h3 className="text-xl font-semibold text-white mb-6">Assessment Process</h3>
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {['Target', 'Intro', 'Threat Actor', 'Threats', 'Detection', 'ISM', 'E8'].map((step, index) => (
                  <div key={step} className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                      index === 1 ? 'bg-primary-600 text-white' : 'bg-secondary-700 text-secondary-400'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="text-center">
                      <div className={`font-medium mb-1 ${
                        index === 1 ? 'text-primary-300' : 'text-secondary-300'
                      }`}>{step}</div>
                      {index < 6 && (
                        <div className="hidden md:block w-8 h-0.5 bg-secondary-600 mx-auto mt-2"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Getting Started */}
            <div className="bg-secondary-800/50 rounded-xl border border-secondary-700/50 p-8">
              <h3 className="text-xl font-semibold text-white mb-6">Getting Started</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-semibold">1</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">Review Target Information</h4>
                    <p className="text-secondary-400">
                      Start by reviewing your organization details and applications in the Target section. 
                      Ensure all information is accurate and complete.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-secondary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-semibold">2</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">Navigate Through Sections</h4>
                    <p className="text-secondary-400">
                      Use the sidebar navigation to move through each assessment section systematically. 
                      Each section builds upon the previous one.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-secondary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-semibold">3</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">Review and Validate</h4>
                    <p className="text-secondary-400">
                      Complete all sections and review the comprehensive threat assessment report 
                      to ensure accuracy and completeness.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThreatProfilingLayout>
  );
};

export default IntroPage;