import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetOrgQuery } from "../../Redux/api/organizationsApi";
import Layout from "../../components/Common/Layout";
import Button from "../../components/Common/Button";
import type { ClientDataDto } from "../../Redux/slices/organizationsSlice";

interface AssessmentResult {
  category: string;
  score: number;
  status: "excellent" | "good" | "warning" | "critical";
  findings: string[];
  recommendations: string[];
}

const SecurityAssessmentPage: React.FC = () => {
  const { client_name } = useParams<{ client_name: string }>();
  const navigate = useNavigate();
  const { data: orgData, isLoading } = useGetOrgQuery(client_name!, {
    skip: !client_name,
  });

  const getOrgData = (data: typeof orgData): ClientDataDto | null => {
    if (!data) return null;
    if ("managed_org" in data && data.managed_org) return data.managed_org;
    if ("client_name" in data && "organization_name" in data)
      return data as ClientDataDto;
    return null;
  };

  const org = getOrgData(orgData);

  const [isRunning, setIsRunning] = useState(false);
  const [assessmentComplete, setAssessmentComplete] = useState(false);

  // Mock assessment results
  const assessmentResults: AssessmentResult[] = [
    {
      category: "Network Security",
      score: 85,
      status: "good",
      findings: [
        "Firewall properly configured",
        "Some open ports detected",
        "SSL certificates valid",
      ],
      recommendations: [
        "Close unnecessary ports",
        "Implement network segmentation",
        "Regular firewall rule review",
      ],
    },
    {
      category: "Access Control",
      score: 92,
      status: "excellent",
      findings: [
        "Strong password policies",
        "MFA enabled",
        "Regular access reviews",
      ],
      recommendations: [
        "Consider privileged access management",
        "Implement zero-trust architecture",
      ],
    },
    {
      category: "Data Protection",
      score: 78,
      status: "warning",
      findings: [
        "Data encrypted at rest",
        "Some unencrypted data in transit",
        "Backup procedures in place",
      ],
      recommendations: [
        "Encrypt all data in transit",
        "Implement data loss prevention",
        "Regular backup testing",
      ],
    },
    {
      category: "Incident Response",
      score: 65,
      status: "warning",
      findings: [
        "Basic incident response plan exists",
        "Limited automation",
        "Manual processes",
      ],
      recommendations: [
        "Automate incident response",
        "Conduct regular drills",
        "Improve documentation",
      ],
    },
    {
      category: "Compliance",
      score: 88,
      status: "good",
      findings: [
        "GDPR compliant",
        "Regular audits conducted",
        "Documentation up to date",
      ],
      recommendations: [
        "Implement continuous compliance monitoring",
        "Expand compliance framework",
      ],
    },
  ];

  const runAssessment = async () => {
    setIsRunning(true);
    // Simulate assessment running
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsRunning(false);
    setAssessmentComplete(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-400 bg-green-500/20 border-green-500/30";
      case "good":
        return "text-blue-400 bg-blue-500/20 border-blue-500/30";
      case "warning":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      case "critical":
        return "text-red-400 bg-red-500/20 border-red-500/30";
      default:
        return "text-secondary-400 bg-secondary-500/20 border-secondary-500/30";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 75) return "text-blue-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
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
          <h2 className="text-2xl font-bold text-white mb-4">
            Organization Not Found
          </h2>
          <Button onClick={() => navigate("/orgs")}>
            Back to Organizations
          </Button>
        </div>
      </Layout>
    );
  }

  const overallScore = Math.round(
    assessmentResults.reduce((sum, result) => sum + result.score, 0) /
      assessmentResults.length
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="bg-secondary-800/50 rounded-xl border border-secondary-700/30 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Security Assessment
              </h1>
              <p className="text-secondary-400">{org.organization_name}</p>
            </div>
            <Button variant="ghost" onClick={() => navigate("/orgs")}>
              Back
            </Button>
          </div>

          {!assessmentComplete && !isRunning && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Run Security Assessment
              </h2>
              <p className="text-secondary-400 mb-8 max-w-2xl mx-auto">
                Perform a comprehensive security assessment to identify
                vulnerabilities, compliance gaps, and security risks across your
                organization's infrastructure.
              </p>
              <Button onClick={runAssessment}>Start Assessment</Button>
            </div>
          )}

          {isRunning && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Running Security Assessment
              </h2>
              <p className="text-secondary-400">
                This may take a few minutes to complete...
              </p>
            </div>
          )}

          {assessmentComplete && (
            <div className="space-y-8">
              {/* Overall Score */}
              <div className="bg-gradient-to-r from-primary-600/20 to-primary-700/20 rounded-xl p-6 border border-primary-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Overall Security Score
                    </h3>
                    <p className="text-primary-300">
                      Based on comprehensive assessment across all categories
                    </p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-6xl font-bold ${getScoreColor(
                        overallScore
                      )}`}
                    >
                      {overallScore}
                    </div>
                    <div className="text-secondary-400">out of 100</div>
                  </div>
                </div>
              </div>

              {/* Assessment Results */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {assessmentResults.map((result, index) => (
                  <div
                    key={index}
                    className="bg-secondary-700/30 rounded-xl p-6 border border-secondary-600/30"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-semibold text-white">
                        {result.category}
                      </h4>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                            result.status
                          )}`}
                        >
                          {result.status.toUpperCase()}
                        </span>
                        <span
                          className={`text-2xl font-bold ${getScoreColor(
                            result.score
                          )}`}
                        >
                          {result.score}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h5 className="text-sm font-medium text-secondary-300 mb-2">
                          Key Findings
                        </h5>
                        <ul className="space-y-1">
                          {result.findings.map((finding, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-secondary-400 flex items-start space-x-2"
                            >
                              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span>{finding}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium text-secondary-300 mb-2">
                          Recommendations
                        </h5>
                        <ul className="space-y-1">
                          {result.recommendations.map((rec, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-secondary-400 flex items-start space-x-2"
                            >
                              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => setAssessmentComplete(false)}
                >
                  Run New Assessment
                </Button>
                <Button onClick={() => console.log("Export report")}>
                  Export Report
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SecurityAssessmentPage;
