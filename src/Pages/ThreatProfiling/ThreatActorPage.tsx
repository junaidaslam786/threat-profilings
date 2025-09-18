import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThreatProfilingLayout from "../../components/Common/ThreatProfilingLayout";
import LoadingScreen from "../../components/Common/LoadingScreen";
import Button from "../../components/Common/Button";
import { useGetProfilingResultsQuery } from "../../Redux/api/threatProfilingApi";

const ThreatActorPage: React.FC = () => {
  const client_name = localStorage.getItem("selectedOrg") || "";
  const navigate = useNavigate();
  const [selectedActors, setSelectedActors] = useState<string[]>([]);

  const {
    data: profilingResults,
    isLoading,
    error,
  } = useGetProfilingResultsQuery(client_name);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !profilingResults?.has_results) {
    return (
      <ThreatProfilingLayout>
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-amber-600/20 border border-amber-500/30 rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold text-amber-400 mb-2">
                No Threat Actor Data Available
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

  const threatActors = profilingResults?.results?.tas || [];

  const handleActorToggle = (actorId: string) => {
    setSelectedActors((prev) =>
      prev.includes(actorId)
        ? prev.filter((id) => id !== actorId)
        : [...prev, actorId]
    );
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 80) return "text-red-400";
    if (score >= 60) return "text-amber-400";
    if (score >= 40) return "text-yellow-400";
    return "text-green-400";
  };

  const getSophisticationColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "expert":
        return "text-red-400";
      case "high":
        return "text-amber-400";
      case "medium":
        return "text-yellow-400";
      case "low":
        return "text-green-400";
      default:
        return "text-secondary-400";
    }
  };

  return (
    <ThreatProfilingLayout>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent mb-2">
                  Threat Actors ({threatActors.length})
                </h1>
                <p className="text-lg text-secondary-400">
                  Relevant threat actors identified for your organization
                </p>
              </div>
             <Button
                onClick={() => navigate("/")}
                variant="outline"
              >
                ← Back to Overview
              </Button>
            </div>

            <div className="bg-gradient-to-r from-amber-600/20 to-amber-500/20 border border-amber-500/30 rounded-lg p-4">
              <p className="text-amber-300">
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
                These threat actors have been identified as potentially relevant
                to your organization based on your industry, geography, and
                digital footprint.
              </p>
            </div>
          </div>

          {/* Threat Actors Grid */}
          <div className="space-y-6">
            {threatActors.map((actor, index) => (
              <div
                key={actor.id || index}
                className={`bg-secondary-800/50 rounded-xl border ${
                  selectedActors.includes(actor.id)
                    ? "border-amber-500/50 shadow-lg shadow-amber-500/10"
                    : "border-secondary-700/50"
                } p-6 transition-all duration-300`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-amber-400"
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
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">
                          {actor.name}
                        </h3>
                        <span className="px-3 py-1 bg-secondary-700 text-secondary-300 text-sm rounded-full">
                          ID: {actor.id}
                        </span>
                        <span className="px-3 py-1 bg-secondary-600/20 text-secondary-400 text-sm rounded-full">
                          {actor.type?.replace("_", " ").toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="text-secondary-400">
                            Relevance Score:
                          </span>
                          <span
                            className={`font-semibold ${getRelevanceColor(
                              actor.relevance_score
                            )}`}
                          >
                            {actor.relevance_score}%
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-secondary-400">
                            Sophistication:
                          </span>
                          <span
                            className={`font-semibold ${getSophisticationColor(
                              actor.sophistication
                            )}`}
                          >
                            {actor.sophistication?.charAt(0).toUpperCase() +
                              actor.sophistication?.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleActorToggle(actor.id)}
                    variant={
                      selectedActors.includes(actor.id) ? "primary" : "outline"
                    }
                    className="px-4 py-2"
                  >
                    {selectedActors.includes(actor.id) ? "Selected" : "Select"}
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Motivations */}
                  <div className="bg-secondary-900/50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-amber-400 mb-3 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      Motivation
                    </h4>
                    <div className="space-y-2">
                      {actor.motivation && actor.motivation.length > 0 ? (
                        actor.motivation.map((motivation, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-3 py-1 bg-amber-600/20 text-amber-300 text-sm rounded-full mr-2 mb-2"
                          >
                            {motivation}
                          </span>
                        ))
                      ) : (
                        <p className="text-secondary-400 text-sm">
                          No specific motivations identified
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Capabilities */}
                  <div className="bg-secondary-900/50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-red-400 mb-3 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
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
                      Capabilities
                    </h4>
                    <div className="space-y-2">
                      {actor.capabilities && actor.capabilities.length > 0 ? (
                        actor.capabilities.map((capability, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-3 py-1 bg-red-600/20 text-red-300 text-sm rounded-full mr-2 mb-2"
                          >
                            {capability}
                          </span>
                        ))
                      ) : (
                        <p className="text-secondary-400 text-sm">
                          No specific capabilities identified
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Techniques */}
                  <div className="bg-secondary-900/50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-secondary-400 mb-3 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                        />
                      </svg>
                      Techniques
                    </h4>
                    <div className="space-y-2">
                      {actor.techniques && actor.techniques.length > 0 ? (
                        <div className="space-y-1">
                          {actor.techniques
                            .slice(0, 3)
                            .map((technique, idx) => (
                              <div
                                key={idx}
                                className="text-secondary-300 text-sm"
                              >
                                • {technique}
                              </div>
                            ))}
                          {actor.techniques.length > 3 && (
                            <div className="text-secondary-400 text-sm">
                              +{actor.techniques.length - 3} more techniques
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-secondary-400 text-sm">
                          No specific techniques identified
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-secondary-700">
            <Button
              onClick={() => navigate(`/threat-profiling/intro`)}
              variant="outline"
            >
              ← Introduction
            </Button>
            <div className="text-center">
              <p className="text-sm text-secondary-400">
                {selectedActors.length} of {threatActors.length} threat actors
                selected
              </p>
            </div>
            <Button
              onClick={() => navigate(`/threat-profiling/threats`)}
              variant="primary"
            >
              Threats & TTPs →
            </Button>
          </div>
        </div>
      </div>
    </ThreatProfilingLayout>
  );
};

export default ThreatActorPage;
