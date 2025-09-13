import React from 'react';
import ThreatProfilingLayout from '../../components/Common/ThreatProfilingLayout';

interface OrganizationDetailsHomeProps {
  className?: string;
}

const OrganizationDetailsHome: React.FC<OrganizationDetailsHomeProps> = ({ className = '' }) => {
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
          <h2 className="text-xl font-semibold text-white mb-2">Organization: Transport for Flower State</h2>
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
            <div className="bg-secondary-900/50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-primary-400 mb-2">Organization Name</label>
              <p className="text-white">Transport for Flower State</p>
            </div>
            
            <div className="bg-secondary-900/50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-primary-400 mb-2">Country</label>
              <p className="text-white">Australia</p>
            </div>
            
            <div className="bg-secondary-900/50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-primary-400 mb-2">Operating Countries</label>
              <p className="text-white">Australia</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-secondary-900/50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-primary-400 mb-2">Government</label>
              <p className="text-white">Yes</p>
            </div>
            
            <div className="bg-secondary-900/50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-primary-400 mb-2">Industry Sector</label>
              <p className="text-white">Transport</p>
            </div>
            
            <div className="bg-secondary-900/50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-primary-400 mb-2">Additional Context</label>
              <p className="text-white text-sm leading-relaxed">
                Transport for Flower State (TFS) is a Government transport service and trade agency. The agency is a different entity of Transport for Flower State. 
                The TFS public transport includes: Light rail, metro, train, bus, ferry, light rail coach. The agency's function is to build transport infrastructure 
                and manage transport services, and provide Government permits for marine, vehicles and driving permits segments. The agency reports to the 
                Minister for Transport, Minister for Roads and the Minister for Regional Transport and Roads.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Section */}
      <div className="bg-secondary-800/50 rounded-xl border border-secondary-700/50 p-6 mb-8">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <svg className="w-6 h-6 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
          Applications
        </h3>
        
        <div className="space-y-6">
          {/* Application 1 */}
          <div className="bg-secondary-900/50 rounded-lg p-4 border border-secondary-600/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-400 mb-1">Application Name</label>
                <p className="text-white font-medium">EWS</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-400 mb-1">Application Profile</label>
                <p className="text-white">Web-app, internet facing, publically-accessible</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-blue-400 mb-1">Application Details</label>
                <p className="text-secondary-300">Wharf booking system allows Commercial Vessel Operators a right of book and access to Charter Wharves</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-blue-400 mb-1">Application Link</label>
                <p className="text-white">N/A</p>
              </div>
            </div>
          </div>
          
          {/* Application 2 */}
          <div className="bg-secondary-900/50 rounded-lg p-4 border border-secondary-600/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-400 mb-1">Application Name</label>
                <p className="text-white font-medium">BoatingStone</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-400 mb-1">Application Profile</label>
                <p className="text-white">Web-app, internet facing, publically-accessible, self and handle payment</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-blue-400 mb-1">Application Details</label>
                <p className="text-secondary-300">This is a website to sell boating and rental maps provided by TFS</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-blue-400 mb-1">Application Link</label>
                <p className="text-white">N/A</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-primary-600/20 to-primary-500/20 border border-primary-500/30 rounded-lg p-6 hover:from-primary-600/30 hover:to-primary-500/30 transition-all duration-200 cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary-600/30 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h4 className="text-lg font-semibold text-white mb-2">Introduction</h4>
          <p className="text-sm text-secondary-300">Get started with threat profiling overview</p>
        </div>

        <div className="bg-gradient-to-br from-amber-600/20 to-amber-500/20 border border-amber-500/30 rounded-lg p-6 hover:from-amber-600/30 hover:to-amber-500/30 transition-all duration-200 cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-600/30 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <h4 className="text-lg font-semibold text-white mb-2">Threat Actors</h4>
          <p className="text-sm text-secondary-300">Identify potential adversaries and risks</p>
        </div>

        <div className="bg-gradient-to-br from-red-600/20 to-red-500/20 border border-red-500/30 rounded-lg p-6 hover:from-red-600/30 hover:to-red-500/30 transition-all duration-200 cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-600/30 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <h4 className="text-lg font-semibold text-white mb-2">Threats & TTPs</h4>
          <p className="text-sm text-secondary-300">Analyze attack methods and procedures</p>
        </div>

        <div className="bg-gradient-to-br from-green-600/20 to-green-500/20 border border-green-500/30 rounded-lg p-6 hover:from-green-600/30 hover:to-green-500/30 transition-all duration-200 cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-600/30 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <h4 className="text-lg font-semibold text-white mb-2">Detection</h4>
          <p className="text-sm text-secondary-300">Implement monitoring and detection</p>
        </div>
      </div>

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
              <span className="text-2xl font-bold text-amber-400">2</span>
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