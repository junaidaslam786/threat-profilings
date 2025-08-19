import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetOrgQuery } from '../../Redux/api/organizationsApi';
import Layout from '../../components/Common/Layout';
import Button from '../../components/Common/Button';
import type { ClientDataDto } from '../../Redux/slices/organizationsSlice';

interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  status: 'compliant' | 'partial' | 'non-compliant';
  score: number;
  lastAssessment: string;
  nextReview: string;
  requirements: {
    total: number;
    met: number;
    partial: number;
    failed: number;
  };
  controls: ComplianceControl[];
}

interface ComplianceControl {
  id: string;
  title: string;
  description: string;
  status: 'implemented' | 'partial' | 'not-implemented';
  evidence: string[];
  recommendations: string[];
}

const ComplianceReportsPage: React.FC = () => {
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

  const [selectedFramework, setSelectedFramework] = useState<string>('');

  // Mock compliance data
  const complianceFrameworks: ComplianceFramework[] = [
    {
      id: 'soc2',
      name: 'SOC 2 Type II',
      description: 'Service Organization Control 2 - Security, Availability, Processing Integrity, Confidentiality, and Privacy',
      status: 'compliant',
      score: 94,
      lastAssessment: '2024-01-10',
      nextReview: '2024-07-10',
      requirements: { total: 64, met: 60, partial: 3, failed: 1 },
      controls: [
        {
          id: 'CC6.1',
          title: 'Logical and Physical Access Controls',
          description: 'The entity implements logical and physical access controls to protect against threats from sources outside its system boundaries.',
          status: 'implemented',
          evidence: ['Access control policies', 'Multi-factor authentication logs', 'Physical security assessments'],
          recommendations: []
        },
        {
          id: 'CC7.1',
          title: 'System Operations',
          description: 'To meet its objectives, the entity uses detection and monitoring procedures to identify anomalies.',
          status: 'partial',
          evidence: ['SIEM implementation', 'Monitoring dashboards'],
          recommendations: ['Implement automated alerting', 'Enhance log correlation']
        }
      ]
    },
    {
      id: 'iso27001',
      name: 'ISO 27001',
      description: 'International standard for information security management systems',
      status: 'partial',
      score: 78,
      lastAssessment: '2023-12-15',
      nextReview: '2024-06-15',
      requirements: { total: 114, met: 89, partial: 18, failed: 7 },
      controls: [
        {
          id: 'A.9.1.1',
          title: 'Access Control Policy',
          description: 'An access control policy shall be established, documented and reviewed based on business and information security requirements.',
          status: 'implemented',
          evidence: ['Access control policy document', 'Policy review records'],
          recommendations: []
        },
        {
          id: 'A.12.6.1',
          title: 'Management of Technical Vulnerabilities',
          description: 'Information about technical vulnerabilities of information systems being used shall be obtained in a timely fashion.',
          status: 'not-implemented',
          evidence: [],
          recommendations: ['Implement vulnerability management program', 'Deploy vulnerability scanning tools']
        }
      ]
    },
    {
      id: 'gdpr',
      name: 'GDPR',
      description: 'General Data Protection Regulation - EU data protection and privacy regulation',
      status: 'compliant',
      score: 91,
      lastAssessment: '2024-01-05',
      nextReview: '2024-04-05',
      requirements: { total: 47, met: 43, partial: 3, failed: 1 },
      controls: [
        {
          id: 'Art.32',
          title: 'Security of Processing',
          description: 'Appropriate technical and organizational measures to ensure a level of security appropriate to the risk.',
          status: 'implemented',
          evidence: ['Encryption implementation', 'Access controls', 'Security policies'],
          recommendations: []
        },
        {
          id: 'Art.33',
          title: 'Notification of Personal Data Breach',
          description: 'Personal data breach notification to supervisory authority within 72 hours.',
          status: 'partial',
          evidence: ['Incident response procedures'],
          recommendations: ['Automate breach notification process', 'Improve incident detection']
        }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'implemented':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'partial':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'non-compliant':
      case 'not-implemented':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      default:
        return 'text-secondary-400 bg-secondary-500/20 border-secondary-500/30';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-yellow-400';
    return 'text-red-400';
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

  const selectedFrameworkData = complianceFrameworks.find(f => f.id === selectedFramework);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="bg-secondary-800/50 rounded-xl border border-secondary-700/30 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Compliance Reports</h1>
              <p className="text-secondary-400">{org.organization_name}</p>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate("/orgs")}
            >
              Back
            </Button>
          </div>

          {!selectedFramework ? (
            <div className="space-y-6">
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-green-600/20 to-green-700/20 rounded-xl p-6 border border-green-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Compliant Frameworks</h3>
                      <div className="text-3xl font-bold text-green-400">
                        {complianceFrameworks.filter(f => f.status === 'compliant').length}
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-700/20 rounded-xl p-6 border border-yellow-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Partial Compliance</h3>
                      <div className="text-3xl font-bold text-yellow-400">
                        {complianceFrameworks.filter(f => f.status === 'partial').length}
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-primary-600/20 to-primary-700/20 rounded-xl p-6 border border-primary-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Average Score</h3>
                      <div className="text-3xl font-bold text-primary-400">
                        {Math.round(complianceFrameworks.reduce((sum, f) => sum + f.score, 0) / complianceFrameworks.length)}%
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Frameworks List */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Compliance Frameworks</h2>
                {complianceFrameworks.map((framework) => (
                  <div key={framework.id} className="bg-secondary-700/30 rounded-xl p-6 border border-secondary-600/30">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-white">{framework.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(framework.status)}`}>
                            {framework.status.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>
                        <p className="text-secondary-300 mb-4">{framework.description}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${getScoreColor(framework.score)}`}>{framework.score}%</div>
                        <div className="text-sm text-secondary-400">Compliance Score</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-secondary-800/50 rounded-lg p-3">
                        <div className="text-lg font-bold text-green-400">{framework.requirements.met}</div>
                        <div className="text-sm text-secondary-400">Met</div>
                      </div>
                      <div className="bg-secondary-800/50 rounded-lg p-3">
                        <div className="text-lg font-bold text-yellow-400">{framework.requirements.partial}</div>
                        <div className="text-sm text-secondary-400">Partial</div>
                      </div>
                      <div className="bg-secondary-800/50 rounded-lg p-3">
                        <div className="text-lg font-bold text-red-400">{framework.requirements.failed}</div>
                        <div className="text-sm text-secondary-400">Failed</div>
                      </div>
                      <div className="bg-secondary-800/50 rounded-lg p-3">
                        <div className="text-lg font-bold text-white">{framework.requirements.total}</div>
                        <div className="text-sm text-secondary-400">Total</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-secondary-400">
                        Last Assessment: {new Date(framework.lastAssessment).toLocaleDateString()} | 
                        Next Review: {new Date(framework.nextReview).toLocaleDateString()}
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() => setSelectedFramework(framework.id)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            selectedFrameworkData && (
              <div className="space-y-8">
                {/* Framework Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedFrameworkData.name}</h2>
                    <p className="text-secondary-400">{selectedFrameworkData.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedFramework('')}
                  >
                    Back to Overview
                  </Button>
                </div>

                {/* Framework Summary */}
                <div className="bg-secondary-700/30 rounded-xl p-6 border border-secondary-600/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${getScoreColor(selectedFrameworkData.score)} mb-2`}>
                        {selectedFrameworkData.score}%
                      </div>
                      <div className="text-secondary-400">Overall Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400 mb-2">{selectedFrameworkData.requirements.met}</div>
                      <div className="text-secondary-400">Requirements Met</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400 mb-2">{selectedFrameworkData.requirements.partial}</div>
                      <div className="text-secondary-400">Partially Met</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-400 mb-2">{selectedFrameworkData.requirements.failed}</div>
                      <div className="text-secondary-400">Not Met</div>
                    </div>
                  </div>
                </div>

                {/* Controls Details */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white">Control Implementation Status</h3>
                  {selectedFrameworkData.controls.map((control) => (
                    <div key={control.id} className="bg-secondary-700/30 rounded-xl p-6 border border-secondary-600/30">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-semibold text-white">{control.id}: {control.title}</h4>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(control.status)}`}>
                              {control.status.replace('-', ' ').toUpperCase()}
                            </span>
                          </div>
                          <p className="text-secondary-300 mb-4">{control.description}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="text-sm font-medium text-secondary-300 mb-2">Evidence</h5>
                          {control.evidence.length > 0 ? (
                            <ul className="space-y-1">
                              {control.evidence.map((evidence, idx) => (
                                <li key={idx} className="text-sm text-secondary-400 flex items-start space-x-2">
                                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                                  <span>{evidence}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-secondary-500 italic">No evidence provided</p>
                          )}
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-secondary-300 mb-2">Recommendations</h5>
                          {control.recommendations.length > 0 ? (
                            <ul className="space-y-1">
                              {control.recommendations.map((rec, idx) => (
                                <li key={idx} className="text-sm text-secondary-400 flex items-start space-x-2">
                                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-green-400 italic">No recommendations - fully compliant</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            <Button variant="ghost" onClick={() => console.log('Schedule assessment')}>
              Schedule Assessment
            </Button>
            <Button onClick={() => console.log('Export compliance report')}>
              Export Report
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ComplianceReportsPage;