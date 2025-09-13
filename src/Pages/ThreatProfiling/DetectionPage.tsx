import React, { useState } from 'react';
import ThreatProfilingLayout from '../../components/Common/ThreatProfilingLayout';

const DetectionPage: React.FC = () => {
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const detectionCategories = [
    { id: 'all', name: 'All Strategies', count: 18 },
    { id: 'network', name: 'Network', count: 4 },
    { id: 'endpoint', name: 'Endpoint', count: 4 },
    { id: 'application', name: 'Application', count: 3 },
    { id: 'data', name: 'Data', count: 3 },
    { id: 'identity', name: 'Identity', count: 2 },
    { id: 'cloud', name: 'Cloud', count: 2 }
  ];

  const detectionStrategies = [
    // Network Detection
    {
      id: 'network-ids',
      name: 'Network Intrusion Detection System (NIDS)',
      category: 'network',
      maturity: 'Essential',
      complexity: 'Medium',
      description: 'Monitor network traffic for suspicious activities and known attack patterns',
      capabilities: ['Signature-based detection', 'Anomaly detection', 'Protocol analysis'],
      detects: ['Network intrusions', 'Malware communications', 'Data exfiltration'],
      implementation: ['Deploy network sensors', 'Configure detection rules', 'Integrate with SIEM'],
      mitreMapping: ['T1046', 'T1190', 'T1041']
    },
    {
      id: 'network-flow',
      name: 'Network Flow Analysis',
      category: 'network',
      maturity: 'Intermediate',
      complexity: 'Low',
      description: 'Analyze network flow data to identify communication patterns and anomalies',
      capabilities: ['Traffic pattern analysis', 'Baseline establishment', 'Anomaly detection'],
      detects: ['C2 communications', 'Data exfiltration', 'Lateral movement'],
      implementation: ['Enable flow logging', 'Establish baselines', 'Configure alerting'],
      mitreMapping: ['T1071', 'T1041', 'T1021']
    },
    {
      id: 'dns-monitoring',
      name: 'DNS Monitoring',
      category: 'network',
      maturity: 'Essential',
      complexity: 'Low',
      description: 'Monitor DNS queries and responses for malicious domains and tunneling',
      capabilities: ['Malicious domain detection', 'DNS tunneling detection', 'Reputation checking'],
      detects: ['C2 domains', 'DNS tunneling', 'Malware downloads'],
      implementation: ['Deploy DNS sensors', 'Integrate threat feeds', 'Configure alerts'],
      mitreMapping: ['T1071.004', 'T1568', 'T1572']
    },
    {
      id: 'proxy-analysis',
      name: 'Web Proxy Analysis',
      category: 'network',
      maturity: 'Intermediate',
      complexity: 'Medium',
      description: 'Analyze web traffic through proxy logs for malicious activities',
      capabilities: ['URL filtering', 'Content inspection', 'User behavior analysis'],
      detects: ['Malicious websites', 'Data exfiltration', 'Suspicious downloads'],
      implementation: ['Configure proxy logging', 'Implement content filtering', 'Analyze patterns'],
      mitreMapping: ['T1071.001', 'T1105', 'T1566']
    },

    // Endpoint Detection
    {
      id: 'edr',
      name: 'Endpoint Detection and Response (EDR)',
      category: 'endpoint',
      maturity: 'Essential',
      complexity: 'High',
      description: 'Comprehensive endpoint monitoring and response capabilities',
      capabilities: ['Process monitoring', 'File analysis', 'Memory inspection', 'Behavioral analysis'],
      detects: ['Malware execution', 'Privilege escalation', 'Persistence mechanisms'],
      implementation: ['Deploy EDR agents', 'Configure policies', 'Train analysts'],
      mitreMapping: ['T1055', 'T1068', 'T1053', 'T1547']
    },
    {
      id: 'host-ids',
      name: 'Host-based Intrusion Detection (HIDS)',
      category: 'endpoint',
      maturity: 'Intermediate',
      complexity: 'Medium',
      description: 'Monitor individual hosts for suspicious activities and file changes',
      capabilities: ['File integrity monitoring', 'Log analysis', 'Registry monitoring'],
      detects: ['File modifications', 'System changes', 'Configuration tampering'],
      implementation: ['Install HIDS agents', 'Configure monitoring rules', 'Set up alerting'],
      mitreMapping: ['T1547', 'T1112', 'T1574']
    },
    {
      id: 'antivirus',
      name: 'Next-Generation Antivirus',
      category: 'endpoint',
      maturity: 'Essential',
      complexity: 'Low',
      description: 'Advanced malware detection using multiple detection methods',
      capabilities: ['Signature detection', 'Heuristic analysis', 'Machine learning', 'Sandboxing'],
      detects: ['Known malware', 'Suspicious behaviors', 'Zero-day threats'],
      implementation: ['Deploy AV solutions', 'Configure real-time scanning', 'Update definitions'],
      mitreMapping: ['T1204', 'T1059', 'T1027']
    },
    {
      id: 'usb-monitoring',
      name: 'USB Device Monitoring',
      category: 'endpoint',
      maturity: 'Advanced',
      complexity: 'Low',
      description: 'Monitor and control USB device usage on endpoints',
      capabilities: ['Device whitelisting', 'Usage logging', 'Content scanning'],
      detects: ['Unauthorized devices', 'Data theft', 'Malware introduction'],
      implementation: ['Deploy monitoring tools', 'Configure policies', 'Establish procedures'],
      mitreMapping: ['T1091', 'T1052', 'T1200']
    },

    // Application Detection
    {
      id: 'waf',
      name: 'Web Application Firewall (WAF)',
      category: 'application',
      maturity: 'Essential',
      complexity: 'Medium',
      description: 'Protect web applications from common attacks and vulnerabilities',
      capabilities: ['SQL injection detection', 'XSS prevention', 'DDoS protection'],
      detects: ['Web application attacks', 'OWASP Top 10 threats', 'API abuse'],
      implementation: ['Deploy WAF solution', 'Configure rules', 'Tune false positives'],
      mitreMapping: ['T1190', 'T1189', 'T1059']
    },
    {
      id: 'app-logging',
      name: 'Application Security Logging',
      category: 'application',
      maturity: 'Intermediate',
      complexity: 'Medium',
      description: 'Comprehensive logging of application security events',
      capabilities: ['Authentication logging', 'Authorization tracking', 'Error monitoring'],
      detects: ['Failed login attempts', 'Privilege escalation', 'Application errors'],
      implementation: ['Implement logging standards', 'Configure log forwarding', 'Set up monitoring'],
      mitreMapping: ['T1078', 'T1110', 'T1190']
    },
    {
      id: 'api-monitoring',
      name: 'API Security Monitoring',
      category: 'application',
      maturity: 'Advanced',
      complexity: 'High',
      description: 'Monitor API usage patterns and detect abuse or attacks',
      capabilities: ['Rate limiting', 'Anomaly detection', 'Authentication monitoring'],
      detects: ['API abuse', 'Credential stuffing', 'Data scraping'],
      implementation: ['Deploy API gateway', 'Configure monitoring', 'Implement rate limiting'],
      mitreMapping: ['T1110', 'T1078', 'T1190']
    },

    // Data Detection
    {
      id: 'dlp',
      name: 'Data Loss Prevention (DLP)',
      category: 'data',
      maturity: 'Essential',
      complexity: 'High',
      description: 'Prevent unauthorized data access, use, and transmission',
      capabilities: ['Content inspection', 'Data classification', 'Policy enforcement'],
      detects: ['Data exfiltration', 'Unauthorized sharing', 'Policy violations'],
      implementation: ['Deploy DLP solution', 'Define data policies', 'Configure monitoring'],
      mitreMapping: ['T1041', 'T1052', 'T1567']
    },
    {
      id: 'database-monitoring',
      name: 'Database Activity Monitoring',
      category: 'data',
      maturity: 'Intermediate',
      complexity: 'Medium',
      description: 'Monitor database access and activities for suspicious behavior',
      capabilities: ['Query monitoring', 'Access logging', 'Privilege tracking'],
      detects: ['SQL injection', 'Unauthorized access', 'Data manipulation'],
      implementation: ['Deploy DB monitoring', 'Configure policies', 'Set up alerting'],
      mitreMapping: ['T1190', 'T1078', 'T1565']
    },
    {
      id: 'file-monitoring',
      name: 'File Activity Monitoring',
      category: 'data',
      maturity: 'Intermediate',
      complexity: 'Low',
      description: 'Monitor file system activities and access patterns',
      capabilities: ['File access logging', 'Change detection', 'Permission monitoring'],
      detects: ['Unauthorized file access', 'Data theft', 'Ransomware activity'],
      implementation: ['Enable file auditing', 'Configure monitoring tools', 'Set up alerts'],
      mitreMapping: ['T1005', 'T1486', 'T1083']
    },

    // Identity Detection
    {
      id: 'ueba',
      name: 'User and Entity Behavior Analytics (UEBA)',
      category: 'identity',
      maturity: 'Advanced',
      complexity: 'High',
      description: 'Analyze user and entity behaviors to detect anomalies',
      capabilities: ['Baseline establishment', 'Anomaly detection', 'Risk scoring'],
      detects: ['Insider threats', 'Compromised accounts', 'Privilege abuse'],
      implementation: ['Deploy UEBA solution', 'Establish baselines', 'Configure risk scoring'],
      mitreMapping: ['T1078', 'T1087', 'T1033']
    },
    {
      id: 'privileged-monitoring',
      name: 'Privileged Account Monitoring',
      category: 'identity',
      maturity: 'Essential',
      complexity: 'Medium',
      description: 'Monitor privileged account usage and activities',
      capabilities: ['Session recording', 'Command logging', 'Access tracking'],
      detects: ['Privilege abuse', 'Unauthorized admin access', 'Credential theft'],
      implementation: ['Deploy PAM solution', 'Configure monitoring', 'Establish policies'],
      mitreMapping: ['T1078.003', 'T1098', 'T1136']
    },

    // Cloud Detection
    {
      id: 'cloud-trail',
      name: 'Cloud Audit Trail Monitoring',
      category: 'cloud',
      maturity: 'Essential',
      complexity: 'Low',
      description: 'Monitor cloud service API calls and configuration changes',
      capabilities: ['API logging', 'Configuration monitoring', 'Access tracking'],
      detects: ['Unauthorized changes', 'Privilege escalation', 'Data access'],
      implementation: ['Enable cloud logging', 'Configure monitoring', 'Set up alerts'],
      mitreMapping: ['T1078.004', 'T1098', 'T1526']
    },
    {
      id: 'casb',
      name: 'Cloud Access Security Broker (CASB)',
      category: 'cloud',
      maturity: 'Intermediate',
      complexity: 'Medium',
      description: 'Monitor and control cloud application usage and data',
      capabilities: ['Application discovery', 'Data protection', 'Threat detection'],
      detects: ['Shadow IT', 'Data exfiltration', 'Compliance violations'],
      implementation: ['Deploy CASB solution', 'Configure policies', 'Monitor usage'],
      mitreMapping: ['T1567', 'T1078', 'T1526']
    }
  ];

  const handleStrategySelection = (strategyId: string) => {
    setSelectedStrategies(prev => 
      prev.includes(strategyId) 
        ? prev.filter(id => id !== strategyId)
        : [...prev, strategyId]
    );
  };

  const getMaturityColor = (maturity: string) => {
    switch (maturity) {
      case 'Essential': return 'bg-red-600/20 text-red-300 border-red-500/50';
      case 'Intermediate': return 'bg-yellow-600/20 text-yellow-300 border-yellow-500/50';
      case 'Advanced': return 'bg-green-600/20 text-green-300 border-green-500/50';
      default: return 'bg-secondary-600/20 text-secondary-300 border-secondary-500/50';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'High': return 'text-red-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-green-400';
      default: return 'text-secondary-400';
    }
  };

  const filteredStrategies = activeCategory === 'all' 
    ? detectionStrategies 
    : detectionStrategies.filter(strategy => strategy.category === activeCategory);

  return (
    <ThreatProfilingLayout>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Detection Strategies</h1>
            <p className="text-lg text-secondary-400">
              Develop comprehensive detection capabilities to identify and respond to threats
            </p>
          </div>

          {/* Overview */}
          <div className="bg-gradient-to-r from-green-600/20 to-green-500/20 border border-green-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-600/30 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">Detection Strategy Planning</h2>
            </div>
            <p className="text-green-200">
              Select detection strategies based on your threat profile and organizational maturity. 
              Each strategy includes implementation guidance and MITRE ATT&CK mappings.
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {detectionCategories.map((category) => (
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

          {/* Detection Strategies */}
          <div className="space-y-4">
            {filteredStrategies.map((strategy) => (
              <div 
                key={strategy.id}
                className={`bg-secondary-800/50 rounded-xl border p-6 cursor-pointer transition-all duration-200 ${
                  selectedStrategies.includes(strategy.id)
                    ? 'border-primary-500/50 bg-primary-600/10'
                    : 'border-secondary-700/50 hover:border-secondary-600/50'
                }`}
                onClick={() => handleStrategySelection(strategy.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                      selectedStrategies.includes(strategy.id)
                        ? 'bg-primary-600 border-primary-600'
                        : 'border-secondary-500'
                    }`}>
                      {selectedStrategies.includes(strategy.id) && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">{strategy.name}</h4>
                      <p className="text-secondary-400 text-sm">{strategy.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getMaturityColor(strategy.maturity)}`}>
                      {strategy.maturity}
                    </span>
                    <div className="text-right">
                      <div className="text-xs text-secondary-500">Complexity</div>
                      <div className={`text-sm font-medium ${getComplexityColor(strategy.complexity)}`}>
                        {strategy.complexity}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                  <div>
                    <h5 className="text-sm font-medium text-white mb-3">Capabilities</h5>
                    <div className="space-y-2">
                      {strategy.capabilities.map((capability, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          <span className="text-sm text-secondary-300">{capability}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-white mb-3">Detects</h5>
                    <div className="space-y-2">
                      {strategy.detects.map((detect, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                          <span className="text-sm text-secondary-300">{detect}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-white mb-3">Implementation</h5>
                    <div className="space-y-2">
                      {strategy.implementation.map((step, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                          <span className="text-sm text-secondary-300">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-white mb-3">MITRE Techniques</h5>
                    <div className="space-y-2">
                      {strategy.mitreMapping.map((technique, index) => (
                        <span key={index} className="inline-block px-2 py-1 bg-secondary-700/50 text-secondary-300 rounded text-xs mr-1 mb-1">
                          {technique}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selection Summary */}
          {selectedStrategies.length > 0 && (
            <div className="mt-8 bg-secondary-800/50 rounded-xl border border-secondary-700/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Selected Detection Strategies ({selectedStrategies.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4">
                  <h4 className="text-red-300 font-medium mb-2">Essential</h4>
                  <div className="text-2xl font-bold text-red-400">
                    {selectedStrategies.filter(id => 
                      detectionStrategies.find(s => s.id === id)?.maturity === 'Essential'
                    ).length}
                  </div>
                </div>
                <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
                  <h4 className="text-yellow-300 font-medium mb-2">Intermediate</h4>
                  <div className="text-2xl font-bold text-yellow-400">
                    {selectedStrategies.filter(id => 
                      detectionStrategies.find(s => s.id === id)?.maturity === 'Intermediate'
                    ).length}
                  </div>
                </div>
                <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-4">
                  <h4 className="text-green-300 font-medium mb-2">Advanced</h4>
                  <div className="text-2xl font-bold text-green-400">
                    {selectedStrategies.filter(id => 
                      detectionStrategies.find(s => s.id === id)?.maturity === 'Advanced'
                    ).length}
                  </div>
                </div>
              </div>
              <p className="text-secondary-400 text-sm">
                These selected detection strategies will form the foundation of your security monitoring and incident response capabilities.
              </p>
            </div>
          )}
        </div>
      </div>
    </ThreatProfilingLayout>
  );
};

export default DetectionPage;