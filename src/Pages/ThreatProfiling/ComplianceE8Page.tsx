import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThreatProfilingLayout from "../../components/Common/ThreatProfilingLayout";
import LoadingScreen from "../../components/Common/LoadingScreen";
import Button from "../../components/Common/Button";
import { useGetProfilingResultsQuery } from "../../Redux/api/threatProfilingApi";

const ComplianceE8Page: React.FC = () => {
  const client_name = localStorage.getItem("selectedOrg") || "";
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: profilingResults,
    isLoading,
    error,
  } = useGetProfilingResultsQuery(client_name);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error && !profilingResults?.has_results) {
    return (
      <ThreatProfilingLayout>
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-amber-600/20 border border-amber-500/30 rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold text-amber-400 mb-2">
                No Essential 8 Data Available
              </h3>
              <p className="text-secondary-300 mb-4">
                Essential 8 compliance data is not available for this
                organization yet.
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

  const e8Mitigations = profilingResults?.results?.e8s || [];
  const filteredMitigations = e8Mitigations.filter(
    (mitigation) =>
      mitigation.mitigation_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      mitigation.mitigation_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMitigations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMitigations = filteredMitigations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "critical":
        return "text-red-400";
      case "high":
        return "text-orange-400";
      case "medium":
        return "text-yellow-400";
      case "low":
        return "text-green-400";
      default:
        return "text-secondary-400";
    }
  };

  const getMaturityColor = (level: string) => {
    switch (level) {
      case "maturity_3":
        return "text-green-400";
      case "maturity_2":
        return "text-yellow-400";
      case "maturity_1":
        return "text-red-400";
      default:
        return "text-secondary-400";
    }
  };

  return (
    <ThreatProfilingLayout>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent mb-2">
                  Essential 8 Compliance ({e8Mitigations.length})
                </h1>
                <p className="text-lg text-secondary-400">
                  Essential Eight mitigation strategies assessment
                </p>
              </div>
             <Button
                onClick={() => navigate("/")}
                variant="outline"
              >
                ← Back to Overview
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search mitigations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-secondary-800 border border-secondary-700 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div className="bg-secondary-800/50 rounded-xl border border-secondary-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-secondary-400 uppercase tracking-wider">
                      Mitigation
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-secondary-400 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-secondary-400 uppercase tracking-wider">
                      Maturity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-secondary-400 uppercase tracking-wider">
                      Gaps
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-700/50">
                  {paginatedMitigations.map((mitigation, index) => (
                    <tr
                      key={mitigation.mitigation_id || index}
                      className="hover:bg-secondary-700/30"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-medium">
                            {mitigation.mitigation_name}
                          </div>
                          <div className="text-sm text-secondary-400">
                            {mitigation.mitigation_id}
                          </div>
                          <div className="text-sm text-secondary-500 mt-1">
                            {mitigation.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`font-medium ${getPriorityColor(
                            mitigation.priority
                          )}`}
                        >
                          {mitigation.priority?.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`font-medium ${getMaturityColor(
                            mitigation.implementation_level
                          )}`}
                        >
                          {mitigation.implementation_level?.replace(
                            "maturity_",
                            "Level "
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {mitigation.gaps_identified
                            ?.slice(0, 2)
                            .map((gap, idx) => (
                              <div
                                key={idx}
                                className="text-sm text-secondary-300"
                              >
                                • {gap}
                              </div>
                            ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

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
        </div>
      </div>
    </ThreatProfilingLayout>
  );
};

export default ComplianceE8Page;
