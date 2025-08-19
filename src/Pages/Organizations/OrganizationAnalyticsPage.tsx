import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetOrgQuery } from '../../Redux/api/organizationsApi';
import Layout from '../../components/Common/Layout';
import Button from '../../components/Common/Button';
import type { ClientDataDto } from '../../Redux/slices/organizationsSlice';

const OrganizationAnalyticsPage: React.FC = () => {
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

  const [timeRange, setTimeRange] = useState('30d');

  // Mock analytics data
  const analyticsData = {
    securityScore: {
      current: 85,
      previous: 78,
      trend: 'up'
    },
    threatDetection: {
      total: 247,
      resolved: 198,
      active: 49,
      critical: 12
    },
    vulnerabilities: {
      total: 156,
      patched: 134,
      pending: 22,
      newThisMonth: 8
    },
    compliance: {
      score: 92,
      frameworks: ['SOC2', 'ISO27001', 'GDPR'],
      lastAudit: '2024-01-10'
    },
    incidents: [
      { date: '2024-01-15', type: 'Malware', severity: 'High', status: 'Resolved' },
      { date: '2024-01-14', type: 'Phishing', severity: 'Medium', status: 'Mitigated' },
      { date: '2024-01-12', type: 'DDoS', severity: 'Low', status: 'Resolved' },
      { date: '2024-01-10', type: 'Data Access', severity: 'Medium', status: 'Active' }
    ],
    riskTrends: [
      { month: 'Oct', score: 72 },
      { month: 'Nov', score: 78 },
      { month: 'Dec', score: 82 },
      { month: 'Jan', score: 85 }
    ]
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
      <div className="max-w-7xl mx-auto">
        <div className="bg-secondary-800/50 rounded-xl border border-secondary-700/30 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
              <p className="text-secondary-400">{org.organization_name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-secondary-700 border border-secondary-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <Button
                variant="ghost"
                onClick={() => navigate("/orgs")}
              >
                Back
              </Button>
            </div>
          </div>

          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-primary-600/20 to-primary-700/20 rounded-xl p-6 border border-primary-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Security Score</h3>
                    <div className="text-3xl font-bold text-primary-400">{analyticsData.securityScore.current}</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      <span className="text-sm text-green-400">+{analyticsData.securityScore.current - analyticsData.securityScore.previous} from last month</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-600/20 to-red-700/20 rounded-xl p-6 border border-red-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Active Threats</h3>
                    <div className="text-3xl font-bold text-red-400">{analyticsData.threatDetection.active}</div>
                    <div className="text-sm text-red-300 mt-2">{analyticsData.threatDetection.critical} critical</div>
                  </div>
                  <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-700/20 rounded-xl p-6 border border-yellow-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Vulnerabilities</h3>
                    <div className="text-3xl font-bold text-yellow-400">{analyticsData.vulnerabilities.pending}</div>
                    <div className="text-sm text-yellow-300 mt-2">{analyticsData.vulnerabilities.newThisMonth} new this month</div>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-600/20 to-green-700/20 rounded-xl p-6 border border-green-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Compliance</h3>
                    <div className="text-3xl font-bold text-green-400">{analyticsData.compliance.score}%</div>
                    <div className="text-sm text-green-300 mt-2">{analyticsData.compliance.frameworks.length} frameworks</div>
                  </div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Risk Trend Chart */}
              <div className="bg-secondary-700/30 rounded-xl p-6 border border-secondary-600/30">
                <h3 className="text-xl font-semibold text-white mb-6">Security Score Trend</h3>
                <div className="h-64 flex items-end justify-between space-x-4">
                  {analyticsData.riskTrends.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg"
                        style={{ height: `${(data.score / 100) * 200}px` }}
                      ></div>
                      <div className="text-sm text-secondary-400 mt-2">{data.month}</div>
                      <div className="text-sm font-medium text-white">{data.score}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Threat Distribution */}
              <div className="bg-secondary-700/30 rounded-xl p-6 border border-secondary-600/30">
                <h3 className="text-xl font-semibold text-white mb-6">Threat Detection Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-secondary-300">Total Detected</span>
                    <span className="text-white font-semibold">{analyticsData.threatDetection.total}</span>
                  </div>
                  <div className="w-full bg-secondary-800 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full"
                      style={{ width: `${(analyticsData.threatDetection.resolved / analyticsData.threatDetection.total) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">Resolved: {analyticsData.threatDetection.resolved}</span>
                    <span className="text-red-400">Active: {analyticsData.threatDetection.active}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-secondary-300">Vulnerabilities Patched</span>
                    <span className="text-white font-semibold">{analyticsData.vulnerabilities.patched}/{analyticsData.vulnerabilities.total}</span>
                  </div>
                  <div className="w-full bg-secondary-800 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full"
                      style={{ width: `${(analyticsData.vulnerabilities.patched / analyticsData.vulnerabilities.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Incidents */}
            <div className="bg-secondary-700/30 rounded-xl p-6 border border-secondary-600/30">
              <h3 className="text-xl font-semibold text-white mb-6">Recent Security Incidents</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-secondary-600">
                      <th className="text-left py-3 px-4 text-secondary-300 font-medium">Date</th>
                      <th className="text-left py-3 px-4 text-secondary-300 font-medium">Type</th>
                      <th className="text-left py-3 px-4 text-secondary-300 font-medium">Severity</th>
                      <th className="text-left py-3 px-4 text-secondary-300 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.incidents.map((incident, index) => (
                      <tr key={index} className="border-b border-secondary-700/50">
                        <td className="py-3 px-4 text-white">{new Date(incident.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-secondary-300">{incident.type}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            incident.severity === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            incident.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                            'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}>
                            {incident.severity}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            incident.status === 'Resolved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                            incident.status === 'Mitigated' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                            'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {incident.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Compliance Status */}
            <div className="bg-secondary-700/30 rounded-xl p-6 border border-secondary-600/30">
              <h3 className="text-xl font-semibold text-white mb-6">Compliance Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {analyticsData.compliance.frameworks.map((framework, index) => (
                  <div key={index} className="bg-secondary-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-white">{framework}</h4>
                      <span className="text-green-400 text-sm">Compliant</span>
                    </div>
                    <div className="w-full bg-secondary-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                    <div className="text-sm text-secondary-400 mt-2">92% compliance</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-sm text-secondary-400">
                Last audit: {new Date(analyticsData.compliance.lastAudit).toLocaleDateString()}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <Button variant="ghost" onClick={() => console.log('Schedule report')}>
                Schedule Report
              </Button>
              <Button onClick={() => console.log('Export analytics')}>
                Export Data
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrganizationAnalyticsPage;