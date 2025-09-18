import React from "react";
import { useNavigate } from "react-router-dom";
import ThreatProfilingLayout from "../../components/Common/ThreatProfilingLayout";
import LoadingScreen from "../../components/Common/LoadingScreen";
import Button from "../../components/Common/Button";
import { useGetProfilingResultsQuery } from "../../Redux/api/threatProfilingApi";

const IntroPage: React.FC = () => {
  const client_name = localStorage.getItem("selectedOrg") || "";
  const navigate = useNavigate();
  const {
    data: profilingResults,
    isLoading,
    error,
  } = useGetProfilingResultsQuery(client_name);

  const hasResults = profilingResults?.has_results || false;
  const executiveSummary = profilingResults?.results?.executive_summary || null;
  const metadata = profilingResults?.results?.metadata || null;
  const complianceStatus = profilingResults?.results?.compliance_status || null;
  const data = profilingResults;

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error && !hasResults) {
    return (
      <ThreatProfilingLayout>
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-amber-600/20 border border-amber-500/30 rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold text-amber-400 mb-2">
                No Threat Profiling Data Available
              </h3>
              <p className="text-secondary-300 mb-4">
                Threat profiling results are not available for this organization
                yet. Please run threat profiling first.
              </p>
              <Button onClick={() => navigate(`/`)} variant="primary">
                Back to Overview
              </Button>
            </div>
          </div>
        </div>
      </ThreatProfilingLayout>
    );
  }

  return (
    <ThreatProfilingLayout>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-4">
                  Threat Profiling Overview
                </h1>
                <p className="text-lg text-secondary-400">
                  {executiveSummary?.overview ||
                    "Comprehensive threat profiling analysis"}
                </p>
              </div>
              <Button onClick={() => navigate("/")} variant="outline">
                ← Back to Overview
              </Button>
            </div>
          </div>

          {/* Introduction Content */}
          <div className="space-y-8">
            {/* Executive Summary */}
            <div className="bg-gradient-to-r from-primary-600/20 to-primary-500/20 border border-primary-500/30 rounded-xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-primary-600/30 rounded-full flex items-center justify-center mr-6">
                  <svg
                    className="w-8 h-8 text-primary-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-2">
                    Executive Summary
                  </h2>
                  <p className="text-primary-200">
                    Risk Posture:{" "}
                    <span className="font-semibold capitalize">
                      {executiveSummary?.risk_posture || "Unknown"}
                    </span>
                  </p>
                </div>
              </div>
              <p className="text-secondary-300 leading-relaxed mb-6">
                {executiveSummary?.overview ||
                  "Comprehensive threat profiling analysis completed."}
              </p>

              {/* Key Findings */}
              {executiveSummary?.key_findings &&
                executiveSummary.key_findings.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Key Findings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {executiveSummary.key_findings.map((finding, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-secondary-300">{finding}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Analysis Metrics */}
            <div className="bg-secondary-800/50 rounded-xl border border-secondary-700/50 p-8">
              <h3 className="text-xl font-semibold text-white mb-6">
                Analysis Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-secondary-900/50 p-6 rounded-lg text-center">
                  <div className="w-12 h-12 bg-secondary-600/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-secondary-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-secondary-400 mb-2">
                    {data?.results?.tas?.length || 0}
                  </div>
                  <div className="text-sm text-secondary-400">
                    Threat Actors
                  </div>
                </div>

                <div className="bg-secondary-900/50 p-6 rounded-lg text-center">
                  <div className="w-12 h-12 bg-red-600/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-red-400 mb-2">
                    {data?.results?.ttps_applicable?.length || 0}
                  </div>
                  <div className="text-sm text-secondary-400">
                    Applicable TTPs
                  </div>
                </div>

                <div className="bg-secondary-900/50 p-6 rounded-lg text-center">
                  <div className="w-12 h-12 bg-green-600/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-green-400 mb-2">
                    {data?.results?.detections?.length || 0}
                  </div>
                  <div className="text-sm text-secondary-400">
                    Detection Rules
                  </div>
                </div>

                <div className="bg-secondary-900/50 p-6 rounded-lg text-center">
                  <div className="w-12 h-12 bg-purple-600/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-purple-400 mb-2">
                    {complianceStatus?.overall_security_score || 0}%
                  </div>
                  <div className="text-sm text-secondary-400">
                    Security Score
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance Status */}
            {complianceStatus && (
              <div className="bg-secondary-800/50 rounded-xl border border-secondary-700/50 p-8">
                <h3 className="text-xl font-semibold text-white mb-6">
                  Compliance Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-secondary-900/50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-white mb-3">
                      ISM Compliance
                    </h4>
                    <div className="text-3xl font-bold text-secondary-400 mb-2">
                      {complianceStatus.ism_compliance_percentage}%
                    </div>
                    <div className="w-full bg-secondary-700 rounded-full h-2">
                      <div
                        className="bg-secondary-400 h-2 rounded-full"
                        style={{
                          width: `${complianceStatus.ism_compliance_percentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-secondary-900/50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-white mb-3">
                      Essential 8 Maturity
                    </h4>
                    <div className="text-3xl font-bold text-amber-400 mb-2">
                      {complianceStatus.e8_maturity_level}
                    </div>
                    <div className="text-sm text-secondary-400">
                      Maturity Level
                    </div>
                  </div>

                  <div className="bg-secondary-900/50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-white mb-3">
                      Overall Score
                    </h4>
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {complianceStatus.overall_security_score}%
                    </div>
                    <div className="w-full bg-secondary-700 rounded-full h-2">
                      <div
                        className="bg-green-400 h-2 rounded-full"
                        style={{
                          width: `${complianceStatus.overall_security_score}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Analysis Metadata */}
            {metadata && (
              <div className="bg-secondary-800/50 rounded-xl border border-secondary-700/50 p-8">
                <h3 className="text-xl font-semibold text-white mb-6">
                  Analysis Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-secondary-900/50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-secondary-400 mb-2">
                      Analysis Duration
                    </h4>
                    <p className="text-lg font-semibold text-white">
                      {metadata.profiling_duration_seconds}s
                    </p>
                  </div>
                  <div className="bg-secondary-900/50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-secondary-400 mb-2">
                      Confidence Level
                    </h4>
                    <p className="text-lg font-semibold text-white capitalize">
                      {metadata.confidence_level}
                    </p>
                  </div>
                  <div className="bg-secondary-900/50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-secondary-400 mb-2">
                      Last Updated
                    </h4>
                    <p className="text-lg font-semibold text-white">
                      {new Date(metadata.last_updated).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-secondary-900/50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-secondary-400 mb-2">
                      Data Sources
                    </h4>
                    <p className="text-lg font-semibold text-white">
                      {metadata.data_sources_analyzed?.length || 0}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-secondary-700">
            <Button onClick={() => navigate("/")} variant="outline">
              ← Back to Overview
            </Button>
            <div className="text-center">
              <p className="text-sm text-secondary-400">
                Report ID: {data?.results?.report_id || "N/A"}
              </p>
            </div>
            <Button
              onClick={() => navigate(`/threat-profiling/threat-actor`)}
              variant="primary"
            >
              Threat Actors →
            </Button>
          </div>
        </div>
      </div>
    </ThreatProfilingLayout>
  );
};

export default IntroPage;
