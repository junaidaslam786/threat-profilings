import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetOrgQuery } from '../../Redux/api/organizationsApi';
import Layout from '../../components/Common/Layout';
import Button from '../../components/Common/Button';
import type { ClientDataDto } from '../../Redux/slices/organizationsSlice';

interface ThreatReport {
  id: string;
  title: string;
  type: 'malware' | 'phishing' | 'ddos' | 'data_breach' | 'insider_threat';
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'mitigated' | 'resolved';
  detectedAt: string;
  description: string;
  indicators: string[];
  mitigation: string[];
  affectedSystems: string[];
}

const ThreatReportsPage: React.FC = () => {
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

  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Mock threat reports data
  const threatReports: ThreatReport[] = [
    {
      id: 'THR-2024-001',
      title: 'Advanced Persistent Threat Detected',
      type: 'malware',
      severity: 'critical',
      status: 'active',
      detectedAt: '2024-01-15T10:30:00Z',
      description: 'Sophisticated malware campaign targeting financial data with advanced evasion techniques.',
      indicators: ['192.168.1.100', 'malicious-domain.com', 'SHA256: abc123...'],
      mitigation: ['Isolate affected systems', 'Update antivirus signatures', 'Monitor network traffic'],
      affectedSystems: ['Web Server 01', 'Database Server', 'User Workstations (15)']
    },
    {
      id: 'THR-2024-002',
      title: 'Phishing Campaign Targeting Employees',
      type: 'phishing',
      severity: 'high',
      status: 'mitigated',
      detectedAt: '2024-01-14T14:20:00Z',
      description: 'Large-scale phishing campaign impersonating company executives to steal credentials.',
      indicators: ['fake-company-domain.com', 'suspicious-email@attacker.com'],
      mitigation: ['Email filtering rules updated', 'User awareness training conducted', 'MFA enforcement'],
      affectedSystems: ['Email System', 'User Accounts (8)']
    },
    {
      id: 'THR-2024-003',
      title: 'DDoS Attack on Web Services',
      type: 'ddos',
      severity: 'medium',
      status: 'resolved',
      detectedAt: '2024-01-13T09:15:00Z',
      description: 'Distributed denial of service attack causing temporary service disruption.',
      indicators: ['Multiple IP ranges', 'Traffic spike: 10x normal', 'UDP flood pattern'],
      mitigation: ['DDoS protection activated', 'Traffic filtering implemented', 'Load balancing adjusted'],
      affectedSystems: ['Web Application', 'API Gateway']
    },
    {
      id: 'THR-2024-004',
      title: 'Suspicious Data Access Pattern',
      type: 'insider_threat',
      severity: 'medium',
      status: 'active',
      detectedAt: '2024-01-12T16:45:00Z',
      description: 'Unusual data access patterns detected from internal user account.',
      indicators: ['User ID: emp_12345', 'After-hours access', 'Bulk data downloads'],
      mitigation: ['User account monitoring', 'Access review initiated', 'HR investigation'],
      affectedSystems: ['Customer Database', 'File Server']
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'malware': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'phishing': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'ddos': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      case 'data_breach': return 'text-pink-400 bg-pink-500/20 border-pink-500/30';
      case 'insider_threat': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      default: return 'text-secondary-400 bg-secondary-500/20 border-secondary-500/30';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      default: return 'text-secondary-400 bg-secondary-500/20 border-secondary-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'mitigated': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'resolved': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-secondary-400 bg-secondary-500/20 border-secondary-500/30';
    }
  };

  const filteredReports = threatReports.filter(report => {
    const typeMatch = selectedType === 'all' || report.type === selectedType;
    const statusMatch = selectedStatus === 'all' || report.status === selectedStatus;
    return typeMatch && statusMatch;
  });

  const threatCounts = {
    active: threatReports.filter(r => r.status === 'active').length,
    mitigated: threatReports.filter(r => r.status === 'mitigated').length,
    resolved: threatReports.filter(r => r.status === 'resolved').length,
    total: threatReports.length,
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
      <div className="max-w-6xl mx-auto">
        <div className="bg-secondary-800/50 rounded-xl border border-secondary-700/30 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Threat Reports</h1>
              <p className="text-secondary-400">{org.organization_name}</p>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate("/orgs")}
            >
              Back
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-xl border border-secondary-600/30 bg-secondary-700/30">
              <div className="text-2xl font-bold text-white">{threatCounts.total}</div>
              <div className="text-sm text-secondary-400">Total Threats</div>
            </div>
            <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/20">
              <div className="text-2xl font-bold text-red-400">{threatCounts.active}</div>
              <div className="text-sm text-red-300">Active</div>
            </div>
            <div className="p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/20">
              <div className="text-2xl font-bold text-yellow-400">{threatCounts.mitigated}</div>
              <div className="text-sm text-yellow-300">Mitigated</div>
            </div>
            <div className="p-4 rounded-xl border border-green-500/30 bg-green-500/20">
              <div className="text-2xl font-bold text-green-400">{threatCounts.resolved}</div>
              <div className="text-sm text-green-300">Resolved</div>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="flex items-center space-x-2">
              <span className="text-white font-medium">Type:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-secondary-700 border border-secondary-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="all">All Types</option>
                <option value="malware">Malware</option>
                <option value="phishing">Phishing</option>
                <option value="ddos">DDoS</option>
                <option value="data_breach">Data Breach</option>
                <option value="insider_threat">Insider Threat</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-white font-medium">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-secondary-700 border border-secondary-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="mitigated">Mitigated</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Threat Reports List */}
          <div className="space-y-6">
            {filteredReports.map((report) => (
              <div key={report.id} className="bg-secondary-700/30 rounded-xl p-6 border border-secondary-600/30">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">{report.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(report.type)}`}>
                        {report.type.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(report.severity)}`}>
                        {report.severity.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(report.status)}`}>
                        {report.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-secondary-400 mb-3">
                      <span>{report.id}</span>
                      <span>•</span>
                      <span>Detected: {new Date(report.detectedAt).toLocaleString()}</span>
                    </div>
                    <p className="text-secondary-300 mb-4">{report.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-secondary-300 mb-2">Threat Indicators</h4>
                    <ul className="space-y-1">
                      {report.indicators.map((indicator, idx) => (
                        <li key={idx} className="text-sm text-secondary-400 font-mono bg-secondary-800/50 px-2 py-1 rounded">
                          {indicator}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-secondary-300 mb-2">Mitigation Actions</h4>
                    <ul className="space-y-1">
                      {report.mitigation.map((action, idx) => (
                        <li key={idx} className="text-sm text-secondary-400 flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-secondary-300 mb-2">Affected Systems</h4>
                    <ul className="space-y-1">
                      {report.affectedSystems.map((system, idx) => (
                        <li key={idx} className="text-sm text-secondary-400 flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span>{system}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-secondary-600/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No Threat Reports Found</h3>
              <p className="text-secondary-400">No threats match the selected filters.</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            <Button variant="ghost" onClick={() => console.log('Generate report')}>
              Generate Report
            </Button>
            <Button onClick={() => console.log('Export threats')}>
              Export Data
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ThreatReportsPage;