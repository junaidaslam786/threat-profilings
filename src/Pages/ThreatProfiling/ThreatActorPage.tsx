import React, { useState } from 'react';
import ThreatProfilingLayout from '../../components/Common/ThreatProfilingLayout';

const ThreatActorPage: React.FC = () => {
  const [selectedActors, setSelectedActors] = useState<string[]>([]);

  const threatActorTypes = [
    {
      id: 'nation-state',
      name: 'Nation State Actors',
      description: 'Government-sponsored groups with advanced capabilities',
      characteristics: ['Well-funded', 'Persistent', 'Advanced tools', 'Long-term objectives'],
      examples: ['APT groups', 'State intelligence agencies'],
      riskLevel: 'Critical'
    },
    {
      id: 'organized-crime',
      name: 'Organized Crime Groups',
      description: 'Criminal organizations focused on financial gain',
      characteristics: ['Profit-motivated', 'Sophisticated operations', 'Ransomware specialists'],
      examples: ['Ransomware groups', 'Financial fraud syndicates'],
      riskLevel: 'High'
    },
    {
      id: 'hacktivists',
      name: 'Hacktivists',
      description: 'Ideologically motivated groups targeting organizations',
      characteristics: ['Political/social motivation', 'Public disruption', 'Media attention'],
      examples: ['Anonymous', 'Environmental groups'],
      riskLevel: 'Medium'
    },
    {
      id: 'insider-threats',
      name: 'Insider Threats',
      description: 'Current or former employees with authorized access',
      characteristics: ['Privileged access', 'Knowledge of systems', 'Harder to detect'],
      examples: ['Disgruntled employees', 'Compromised accounts'],
      riskLevel: 'High'
    },
    {
      id: 'script-kiddies',
      name: 'Script Kiddies',
      description: 'Individuals with limited skills using existing tools',
      characteristics: ['Low skill level', 'Opportunistic', 'Automated tools'],
      examples: ['Amateur hackers', 'Tool users'],
      riskLevel: 'Low'
    },
    {
      id: 'terrorists',
      name: 'Terrorist Groups',
      description: 'Groups seeking to cause fear and disruption',
      characteristics: ['Ideological motivation', 'Destructive intent', 'Publicity seeking'],
      examples: ['Cyber-jihad groups', 'Extremist organizations'],
      riskLevel: 'Medium'
    }
  ];

  const handleActorSelection = (actorId: string) => {
    setSelectedActors(prev => 
      prev.includes(actorId) 
        ? prev.filter(id => id !== actorId)
        : [...prev, actorId]
    );
  };

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Critical': return 'bg-red-600/20 text-red-300 border-red-500/50';
      case 'High': return 'bg-orange-600/20 text-orange-300 border-orange-500/50';
      case 'Medium': return 'bg-yellow-600/20 text-yellow-300 border-yellow-500/50';
      case 'Low': return 'bg-green-600/20 text-green-300 border-green-500/50';
      default: return 'bg-secondary-600/20 text-secondary-300 border-secondary-500/50';
    }
  };

  return (
    <ThreatProfilingLayout>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Threat Actor Profiling</h1>
            <p className="text-lg text-secondary-400">
              Identify and analyze potential adversaries who might target your organization
            </p>
          </div>

          {/* Overview */}
          <div className="bg-gradient-to-r from-amber-600/20 to-amber-500/20 border border-amber-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-amber-600/30 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">Threat Actor Assessment</h2>
            </div>
            <p className="text-amber-200">
              Understanding who might target your organization is crucial for effective threat modeling. 
              Select the threat actor types that are most relevant to your organization's risk profile.
            </p>
          </div>

          {/* Threat Actor Types */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-6">Threat Actor Categories</h3>
            
            <div className="grid gap-6">
              {threatActorTypes.map((actor) => (
                <div 
                  key={actor.id}
                  className={`bg-secondary-800/50 rounded-xl border p-6 cursor-pointer transition-all duration-200 ${
                    selectedActors.includes(actor.id)
                      ? 'border-primary-500/50 bg-primary-600/10'
                      : 'border-secondary-700/50 hover:border-secondary-600/50'
                  }`}
                  onClick={() => handleActorSelection(actor.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                        selectedActors.includes(actor.id)
                          ? 'bg-primary-600 border-primary-600'
                          : 'border-secondary-500'
                      }`}>
                        {selectedActors.includes(actor.id) && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">{actor.name}</h4>
                        <p className="text-secondary-400">{actor.description}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskBadgeColor(actor.riskLevel)}`}>
                      {actor.riskLevel} Risk
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-sm font-medium text-white mb-3">Key Characteristics</h5>
                      <div className="space-y-2">
                        {actor.characteristics.map((characteristic, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-primary-400 rounded-full"></div>
                            <span className="text-sm text-secondary-300">{characteristic}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-white mb-3">Examples</h5>
                      <div className="space-y-2">
                        {actor.examples.map((example, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                            <span className="text-sm text-secondary-300">{example}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selection Summary */}
          {selectedActors.length > 0 && (
            <div className="mt-8 bg-secondary-800/50 rounded-xl border border-secondary-700/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Selected Threat Actors</h3>
              <div className="flex flex-wrap gap-3">
                {selectedActors.map((actorId) => {
                  const actor = threatActorTypes.find(a => a.id === actorId);
                  return actor ? (
                    <span 
                      key={actorId}
                      className="px-4 py-2 bg-primary-600/20 text-primary-300 rounded-lg border border-primary-500/30 flex items-center space-x-2"
                    >
                      <span>{actor.name}</span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleActorSelection(actorId);
                        }}
                        className="text-primary-400 hover:text-primary-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
              <p className="text-secondary-400 text-sm mt-4">
                These selected threat actors will be used to inform the threat analysis and detection strategy recommendations.
              </p>
            </div>
          )}

          {/* Additional Considerations */}
          <div className="mt-8 bg-secondary-800/50 rounded-xl border border-secondary-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Additional Considerations</h3>
            <div className="space-y-4 text-secondary-300">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-medium text-white">Industry Targeting</h4>
                  <p className="text-sm">Consider threat actors that specifically target your industry sector</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-600/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-medium text-white">Geographic Factors</h4>
                  <p className="text-sm">Regional threat actors may be more relevant based on your location</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-600/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-medium text-white">Asset Value</h4>
                  <p className="text-sm">High-value assets may attract more sophisticated threat actors</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThreatProfilingLayout>
  );
};

export default ThreatActorPage;