import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThreatProfilingLayout from "../../components/Common/ThreatProfilingLayout";
import LoadingScreen from "../../components/Common/LoadingScreen";
import Button from "../../components/Common/Button";
import { useGetProfilingResultsQuery } from "../../Redux/api/threatProfilingApi";

const ThreatsPage: React.FC = () => {
  const client_name = localStorage.getItem("selectedOrg") || "";
  const navigate = useNavigate();
  const [selectedThreats, setSelectedThreats] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: profilingResults,
    isLoading,
    error,
  } = useGetProfilingResultsQuery(client_name);

  const hasResults = profilingResults?.has_results || false;
  const threats = profilingResults?.results?.ttps_applicable || [];

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
                No Threat Data Available
              </h3>
              <p className="text-secondary-300 mb-4">
                Threat profiling results are not available for this organization
                yet. Please run threat profiling first.
              </p>
              <Button
                onClick={() => navigate(`/`)}
                variant="primary"
              >
                Back to Overview
              </Button>
            </div>
          </div>
        </div>
      </ThreatProfilingLayout>
    );
  }

  // Filter and paginate threats
  const filteredThreats = threats.filter(
    (threat) =>
      threat.technique_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      threat.technique_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      threat.tactic?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredThreats.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedThreats = filteredThreats.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleThreatToggle = (threatId: string) => {
    setSelectedThreats((prev) =>
      prev.includes(threatId)
        ? prev.filter((id) => id !== threatId)
        : [...prev, threatId]
    );
  };

  const getApplicabilityColor = (score: number) => {
    if (score >= 0.8) return "text-red-400";
    if (score >= 0.6) return "text-amber-400";
    if (score >= 0.4) return "text-yellow-400";
    return "text-green-400";
  };

  const getTacticColor = (tactic: string) => {
    const colors: { [key: string]: string } = {
      "Initial Access": "bg-red-600/20 text-red-300",
      Execution: "bg-orange-600/20 text-orange-300",
      Persistence: "bg-yellow-600/20 text-yellow-300",
      "Privilege Escalation": "bg-amber-600/20 text-amber-300",
      "Defense Evasion": "bg-green-600/20 text-green-300",
      "Credential Access": "bg-teal-600/20 text-teal-300",
      Discovery: "bg-secondary-600/20 text-secondary-300",
      "Lateral Movement": "bg-indigo-600/20 text-indigo-300",
      Collection: "bg-purple-600/20 text-purple-300",
      "Command and Control": "bg-pink-600/20 text-pink-300",
      Exfiltration: "bg-rose-600/20 text-rose-300",
      Impact: "bg-red-800/20 text-red-300",
    };
    return colors[tactic] || "bg-secondary-600/20 text-secondary-300";
  };

  return (
    <ThreatProfilingLayout>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-red-300 bg-clip-text text-transparent mb-2">
                  Applicable Threats & TTPs ({threats.length})
                </h1>
                <p className="text-lg text-secondary-400">
                  MITRE ATT&CK techniques applicable to your organization
                </p>
              </div>
             <Button
                onClick={() => navigate("/")}
                variant="outline"
              >
                ← Back to Overview
              </Button>
            </div>

            <div className="bg-gradient-to-r from-red-600/20 to-red-500/20 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-300">
                <svg
                  className="w-5 h-5 inline mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                These techniques have been identified as applicable to your
                organization based on threat actor analysis and organizational
                profile.
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg
                  className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search techniques, tactics, or IDs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-secondary-800 border border-secondary-700 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>
            <div className="text-sm text-secondary-400 flex items-center">
              Showing {startIndex + 1}-
              {Math.min(startIndex + itemsPerPage, filteredThreats.length)} of{" "}
              {filteredThreats.length} threats
            </div>
          </div>

          {/* Threats Table */}
          <div className="bg-secondary-800/50 rounded-xl border border-secondary-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-secondary-400 uppercase tracking-wider">
                      Select
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-secondary-400 uppercase tracking-wider">
                      Technique
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-secondary-400 uppercase tracking-wider">
                      Tactic
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-secondary-400 uppercase tracking-wider">
                      Applicability
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-secondary-400 uppercase tracking-wider">
                      Detection Methods
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-700/50">
                  {paginatedThreats.map((threat, index) => (
                    <tr
                      key={threat.technique_id || index}
                      className={`hover:bg-secondary-700/30 transition-colors ${
                        selectedThreats.includes(threat.technique_id)
                          ? "bg-primary-600/10"
                          : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            handleThreatToggle(threat.technique_id)
                          }
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            selectedThreats.includes(threat.technique_id)
                              ? "bg-primary-600 border-primary-600"
                              : "border-secondary-500 hover:border-secondary-400"
                          }`}
                        >
                          {selectedThreats.includes(threat.technique_id) && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-medium">
                            {threat.technique_name}
                          </div>
                          <div className="text-sm text-secondary-400">
                            {threat.technique_id}
                          </div>
                          <div className="text-sm text-secondary-500 mt-1">
                            {threat.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getTacticColor(
                            threat.tactic
                          )}`}
                        >
                          {threat.tactic}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`font-semibold ${getApplicabilityColor(
                              threat.applicability_score
                            )}`}
                          >
                            {Math.round(threat.applicability_score * 100)}%
                          </span>
                          <div className="w-16 bg-secondary-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                threat.applicability_score >= 0.8
                                  ? "bg-red-400"
                                  : threat.applicability_score >= 0.6
                                  ? "bg-amber-400"
                                  : threat.applicability_score >= 0.4
                                  ? "bg-yellow-400"
                                  : "bg-green-400"
                              }`}
                              style={{
                                width: `${threat.applicability_score * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {threat.detection_methods &&
                          threat.detection_methods.length > 0 ? (
                            threat.detection_methods
                              .slice(0, 2)
                              .map((method, idx) => (
                                <div
                                  key={idx}
                                  className="text-sm text-secondary-300"
                                >
                                  • {method}
                                </div>
                              ))
                          ) : (
                            <div className="text-sm text-secondary-500">
                              No detection methods specified
                            </div>
                          )}
                          {threat.detection_methods &&
                            threat.detection_methods.length > 2 && (
                              <div className="text-xs text-secondary-500">
                                +{threat.detection_methods.length - 2} more
                              </div>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-secondary-400">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  variant="outline"
                  className="px-3 py-1 text-sm"
                >
                  Previous
                </Button>
                <Button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  variant="outline"
                  className="px-3 py-1 text-sm"
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Selection Summary */}
          {selectedThreats.length > 0 && (
            <div className="mt-8 bg-secondary-800/50 rounded-xl border border-secondary-700/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Selected Threats ({selectedThreats.length})
              </h3>
              <p className="text-secondary-400 text-sm">
                These selected threats will be prioritized for detection and
                mitigation strategies.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-secondary-700">
            <Button
              onClick={() => navigate(`/threat-profiling/threat-actor`)}
              variant="outline"
            >
              ← Threat Actors
            </Button>
            <div className="text-center">
              <p className="text-sm text-secondary-400">
                {selectedThreats.length} of {threats.length} threats selected
              </p>
            </div>
            <Button
              onClick={() => navigate(`/threat-profiling/detection`)}
              variant="primary"
            >
              Detection Rules →
            </Button>
          </div>
        </div>
      </div>
    </ThreatProfilingLayout>
  );
};

export default ThreatsPage;
