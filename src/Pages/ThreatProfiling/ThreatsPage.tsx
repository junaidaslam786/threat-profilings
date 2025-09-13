import React, { useState } from 'react';
import ThreatProfilingLayout from '../../components/Common/ThreatProfilingLayout';

const ThreatsPage: React.FC = () => {
  const [selectedThreats, setSelectedThreats] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const threatCategories = [
    { id: 'all', name: 'All Threats', count: 24 },
    { id: 'network', name: 'Network', count: 6 },
    { id: 'application', name: 'Application', count: 5 },
    { id: 'data', name: 'Data', count: 4 },
    { id: 'endpoint', name: 'Endpoint', count: 4 },
    { id: 'cloud', name: 'Cloud', count: 3 },
    { id: 'physical', name: 'Physical', count: 2 }
  ];

  const threats = [
    // Network Threats
    {
      id: 'ddos',
      name: 'Distributed Denial of Service (DDoS)',
      category: 'network',
      severity: 'High',
      likelihood: 'Medium',
      description: 'Overwhelming network resources to disrupt service availability',
      mitreId: 'T1498',
      impact: ['Service disruption', 'Revenue loss', 'Customer impact'],
      techniques: ['Volumetric attacks', 'Protocol attacks', 'Application layer attacks']
    },
    {
      id: 'network-intrusion',
      name: 'Network Intrusion',
      category: 'network',
      severity: 'Critical',
      likelihood: 'Medium',
      description: 'Unauthorized access to internal network systems',
      mitreId: 'T1190',
      impact: ['Data breach', 'Lateral movement', 'System compromise'],
      techniques: ['Port scanning', 'Vulnerability exploitation', 'Network sniffing']
    },
    {
      id: 'man-in-middle',
      name: 'Man-in-the-Middle Attacks',
      category: 'network',
      severity: 'High',
      likelihood: 'Low',
      description: 'Intercepting communications between two parties',
      mitreId: 'T1557',
      impact: ['Data interception', 'Credential theft', 'Traffic manipulation'],
      techniques: ['ARP spoofing', 'DNS spoofing', 'SSL stripping']
    },
    {
      id: 'network-reconnaissance',
      name: 'Network Reconnaissance',
      category: 'network',
      severity: 'Medium',
      likelihood: 'High',
      description: 'Information gathering about network infrastructure',
      mitreId: 'T1046',
      impact: ['Information disclosure', 'Attack preparation', 'Vulnerability identification'],
      techniques: ['Network scanning', 'Service enumeration', 'Banner grabbing']
    },
    {
      id: 'wifi-attacks',
      name: 'Wireless Network Attacks',
      category: 'network',
      severity: 'Medium',
      likelihood: 'Medium',
      description: 'Attacks targeting wireless network infrastructure',
      mitreId: 'T1021',
      impact: ['Unauthorized access', 'Traffic interception', 'Network infiltration'],
      techniques: ['WPA cracking', 'Evil twin attacks', 'Deauthentication attacks']
    },
    {
      id: 'vpn-attacks',
      name: 'VPN Exploitation',
      category: 'network',
      severity: 'High',
      likelihood: 'Low',
      description: 'Exploiting vulnerabilities in VPN infrastructure',
      mitreId: 'T1133',
      impact: ['Remote access', 'Network bypass', 'Credential compromise'],
      techniques: ['VPN vulnerability exploitation', 'Certificate attacks', 'Protocol weaknesses']
    },

    // Application Threats
    {
      id: 'sql-injection',
      name: 'SQL Injection',
      category: 'application',
      severity: 'Critical',
      likelihood: 'Medium',
      description: 'Injecting malicious SQL code into application databases',
      mitreId: 'T1190',
      impact: ['Data breach', 'Database compromise', 'Unauthorized access'],
      techniques: ['Union-based injection', 'Blind SQL injection', 'Time-based injection']
    },
    {
      id: 'xss',
      name: 'Cross-Site Scripting (XSS)',
      category: 'application',
      severity: 'Medium',
      likelihood: 'High',
      description: 'Injecting malicious scripts into web applications',
      mitreId: 'T1189',
      impact: ['Session hijacking', 'Data theft', 'Malware delivery'],
      techniques: ['Reflected XSS', 'Stored XSS', 'DOM-based XSS']
    },
    {
      id: 'csrf',
      name: 'Cross-Site Request Forgery (CSRF)',
      category: 'application',
      severity: 'Medium',
      likelihood: 'Medium',
      description: 'Forcing users to execute unwanted actions',
      mitreId: 'T1189',
      impact: ['Unauthorized actions', 'Data modification', 'Account compromise'],
      techniques: ['State changing requests', 'Social engineering', 'Hidden forms']
    },
    {
      id: 'rce',
      name: 'Remote Code Execution',
      category: 'application',
      severity: 'Critical',
      likelihood: 'Low',
      description: 'Executing arbitrary code on remote systems',
      mitreId: 'T1190',
      impact: ['System compromise', 'Data breach', 'Service disruption'],
      techniques: ['Code injection', 'Deserialization attacks', 'File upload vulnerabilities']
    },
    {
      id: 'api-abuse',
      name: 'API Security Vulnerabilities',
      category: 'application',
      severity: 'High',
      likelihood: 'Medium',
      description: 'Exploiting weaknesses in API implementations',
      mitreId: 'T1190',
      impact: ['Data exposure', 'Unauthorized access', 'Service abuse'],
      techniques: ['Authentication bypass', 'Rate limiting abuse', 'Data exposure']
    },

    // Data Threats
    {
      id: 'data-exfiltration',
      name: 'Data Exfiltration',
      category: 'data',
      severity: 'Critical',
      likelihood: 'Medium',
      description: 'Unauthorized transfer of sensitive data',
      mitreId: 'T1041',
      impact: ['Data breach', 'Compliance violation', 'Intellectual property theft'],
      techniques: ['Database dumps', 'File transfers', 'Email exfiltration']
    },
    {
      id: 'ransomware',
      name: 'Ransomware',
      category: 'data',
      severity: 'Critical',
      likelihood: 'High',
      description: 'Encrypting data and demanding ransom for decryption',
      mitreId: 'T1486',
      impact: ['Data unavailability', 'Financial loss', 'Operational disruption'],
      techniques: ['File encryption', 'System locking', 'Payment demands']
    },
    {
      id: 'data-corruption',
      name: 'Data Integrity Attacks',
      category: 'data',
      severity: 'High',
      likelihood: 'Low',
      description: 'Modifying or corrupting critical data',
      mitreId: 'T1565',
      impact: ['Data corruption', 'Business disruption', 'Decision making errors'],
      techniques: ['Database manipulation', 'File modification', 'Backup corruption']
    },
    {
      id: 'insider-data-theft',
      name: 'Insider Data Theft',
      category: 'data',
      severity: 'High',
      likelihood: 'Medium',
      description: 'Authorized users stealing sensitive information',
      mitreId: 'T1005',
      impact: ['Data breach', 'Competitive disadvantage', 'Regulatory penalties'],
      techniques: ['Privilege abuse', 'Data copying', 'External sharing']
    },

    // Endpoint Threats
    {
      id: 'malware',
      name: 'Malware Infection',
      category: 'endpoint',
      severity: 'High',
      likelihood: 'High',
      description: 'Malicious software compromising endpoint devices',
      mitreId: 'T1204',
      impact: ['System compromise', 'Data theft', 'Network propagation'],
      techniques: ['Email attachments', 'Drive-by downloads', 'USB infections']
    },
    {
      id: 'privilege-escalation',
      name: 'Privilege Escalation',
      category: 'endpoint',
      severity: 'High',
      likelihood: 'Medium',
      description: 'Gaining higher-level permissions than authorized',
      mitreId: 'T1068',
      impact: ['Administrative access', 'System control', 'Security bypass'],
      techniques: ['Kernel exploits', 'Service misconfigurations', 'Token manipulation']
    },
    {
      id: 'credential-theft',
      name: 'Credential Harvesting',
      category: 'endpoint',
      severity: 'High',
      likelihood: 'High',
      description: 'Stealing user credentials from endpoints',
      mitreId: 'T1003',
      impact: ['Account compromise', 'Lateral movement', 'Data access'],
      techniques: ['Keylogging', 'Memory dumping', 'Credential files']
    },
    {
      id: 'endpoint-persistence',
      name: 'Persistence Mechanisms',
      category: 'endpoint',
      severity: 'Medium',
      likelihood: 'Medium',
      description: 'Maintaining access to compromised endpoints',
      mitreId: 'T1053',
      impact: ['Continued access', 'Stealth operations', 'Long-term compromise'],
      techniques: ['Scheduled tasks', 'Registry modifications', 'Service creation']
    },

    // Cloud Threats
    {
      id: 'cloud-misconfiguration',
      name: 'Cloud Misconfigurations',
      category: 'cloud',
      severity: 'High',
      likelihood: 'High',
      description: 'Insecure cloud service configurations',
      mitreId: 'T1078',
      impact: ['Data exposure', 'Unauthorized access', 'Service compromise'],
      techniques: ['Open storage buckets', 'Weak access controls', 'Default credentials']
    },
    {
      id: 'account-hijacking',
      name: 'Cloud Account Hijacking',
      category: 'cloud',
      severity: 'Critical',
      likelihood: 'Medium',
      description: 'Unauthorized access to cloud service accounts',
      mitreId: 'T1078',
      impact: ['Service control', 'Data access', 'Resource abuse'],
      techniques: ['Credential stuffing', 'Social engineering', 'API key theft']
    },
    {
      id: 'shared-responsibility',
      name: 'Shared Responsibility Gaps',
      category: 'cloud',
      severity: 'Medium',
      likelihood: 'Medium',
      description: 'Misunderstanding cloud security responsibilities',
      mitreId: 'T1078',
      impact: ['Security gaps', 'Compliance issues', 'Unprotected assets'],
      techniques: ['Assumption of provider security', 'Incomplete configurations', 'Missing monitoring']
    },

    // Physical Threats
    {
      id: 'physical-access',
      name: 'Unauthorized Physical Access',
      category: 'physical',
      severity: 'High',
      likelihood: 'Low',
      description: 'Gaining physical access to restricted areas',
      mitreId: 'T1200',
      impact: ['Direct system access', 'Data theft', 'Infrastructure damage'],
      techniques: ['Tailgating', 'Lock picking', 'Social engineering']
    },
    {
      id: 'device-theft',
      name: 'Device Theft',
      category: 'physical',
      severity: 'Medium',
      likelihood: 'Medium',
      description: 'Theft of laptops, mobile devices, or hardware',
      mitreId: 'T1200',
      impact: ['Data exposure', 'Credential access', 'Hardware loss'],
      techniques: ['Opportunistic theft', 'Targeted theft', 'Social engineering']
    }
  ];

  const handleThreatSelection = (threatId: string) => {
    setSelectedThreats(prev => 
      prev.includes(threatId) 
        ? prev.filter(id => id !== threatId)
        : [...prev, threatId]
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-600/20 text-red-300 border-red-500/50';
      case 'High': return 'bg-orange-600/20 text-orange-300 border-orange-500/50';
      case 'Medium': return 'bg-yellow-600/20 text-yellow-300 border-yellow-500/50';
      case 'Low': return 'bg-green-600/20 text-green-300 border-green-500/50';
      default: return 'bg-secondary-600/20 text-secondary-300 border-secondary-500/50';
    }
  };

  const getLikelihoodColor = (likelihood: string) => {
    switch (likelihood) {
      case 'High': return 'text-red-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-green-400';
      default: return 'text-secondary-400';
    }
  };

  const filteredThreats = activeCategory === 'all' 
    ? threats 
    : threats.filter(threat => threat.category === activeCategory);

  return (
    <ThreatProfilingLayout>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Threat Analysis</h1>
            <p className="text-lg text-secondary-400">
              Identify and assess potential threats based on your organization's profile and threat actors
            </p>
          </div>

          {/* Overview */}
          <div className="bg-gradient-to-r from-red-600/20 to-red-500/20 border border-red-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-600/30 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">Threat Identification</h2>
            </div>
            <p className="text-red-200">
              Review and select the threats that are most relevant to your organization. 
              Each threat includes MITRE ATT&CK mappings, impact assessments, and common attack techniques.
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {threatCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                    activeCategory === category.id
                      ? 'bg-primary-600/20 text-primary-300 border-primary-500/50'
                      : 'bg-secondary-800/50 text-secondary-300 border-secondary-700/50 hover:border-secondary-600/50'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>

          {/* Threats Grid */}
          <div className="space-y-4">
            {filteredThreats.map((threat) => (
              <div 
                key={threat.id}
                className={`bg-secondary-800/50 rounded-xl border p-6 cursor-pointer transition-all duration-200 ${
                  selectedThreats.includes(threat.id)
                    ? 'border-primary-500/50 bg-primary-600/10'
                    : 'border-secondary-700/50 hover:border-secondary-600/50'
                }`}
                onClick={() => handleThreatSelection(threat.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                      selectedThreats.includes(threat.id)
                        ? 'bg-primary-600 border-primary-600'
                        : 'border-secondary-500'
                    }`}>
                      {selectedThreats.includes(threat.id) && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">{threat.name}</h4>
                      <p className="text-secondary-400 text-sm">{threat.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(threat.severity)}`}>
                      {threat.severity}
                    </span>
                    <span className="text-xs text-secondary-500">MITRE: {threat.mitreId}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <h5 className="text-sm font-medium text-white mb-3">Impact</h5>
                    <div className="space-y-2">
                      {threat.impact.map((impact, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                          <span className="text-sm text-secondary-300">{impact}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-white mb-3">Attack Techniques</h5>
                    <div className="space-y-2">
                      {threat.techniques.map((technique, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                          <span className="text-sm text-secondary-300">{technique}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-white mb-3">Assessment</h5>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-secondary-400">Likelihood:</span>
                        <span className={`text-sm font-medium ${getLikelihoodColor(threat.likelihood)}`}>
                          {threat.likelihood}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-secondary-400">Category:</span>
                        <span className="text-sm text-secondary-300 capitalize">{threat.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selection Summary */}
          {selectedThreats.length > 0 && (
            <div className="mt-8 bg-secondary-800/50 rounded-xl border border-secondary-700/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Selected Threats ({selectedThreats.length})
              </h3>
              <div className="flex flex-wrap gap-3 mb-4">
                {selectedThreats.map((threatId) => {
                  const threat = threats.find(t => t.id === threatId);
                  return threat ? (
                    <span 
                      key={threatId}
                      className="px-4 py-2 bg-red-600/20 text-red-300 rounded-lg border border-red-500/30 flex items-center space-x-2"
                    >
                      <span>{threat.name}</span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleThreatSelection(threatId);
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
              <p className="text-secondary-400 text-sm">
                These selected threats will be used to develop targeted detection strategies and security controls.
              </p>
            </div>
          )}
        </div>
      </div>
    </ThreatProfilingLayout>
  );
};

export default ThreatsPage;