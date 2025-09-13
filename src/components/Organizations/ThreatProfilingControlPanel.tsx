import React, { useState } from "react";
import Button from "../../components/Common/Button";
import Modal from "../../components/Common/Modal";
import { useUser } from "../../hooks/useUser";
import { isLEMaster, isOrgAdmin } from "../../utils/roleUtils";
import {
  useStartProfilingMutation,
  useGetProfilingProgressQuery,
  useGetProfilingResultsQuery,
  useCanRerunProfilingQuery,
  useGetProfilingHistoryQuery,
} from "../../Redux/api/threatProfilingApi";
import type { StartProfilingDto } from "../../Redux/api/threatProfilingApi";

interface ThreatProfilingControlPanelProps {
  clientName: string;
}

interface StartProfilingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StartProfilingDto) => void;
  isLoading?: boolean;
}

const StartProfilingModal: React.FC<StartProfilingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<StartProfilingDto>({
    client_name: "",
    reason: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal show={isOpen} onClose={onClose}>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Start Threat Profiling</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Reason (Optional)
          </label>
          <textarea
            className="w-full p-2 rounded bg-gray-700 border border-blue-900 text-white"
            rows={3}
            value={formData.reason || ""}
            onChange={(e) =>
              setFormData(prev => ({ ...prev, reason: e.target.value }))
            }
            placeholder="Describe the reason for starting this threat profiling analysis..."
          />
        </div>

        <div className="flex space-x-2 pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? "Starting..." : "Start Profiling"}
          </Button>
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
      </div>
    </Modal>
  );
};

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
}

const ProgressModal: React.FC<ProgressModalProps> = ({
  isOpen,
  onClose,
  clientName,
}) => {
  const { data: progress, isLoading, error } = useGetProfilingProgressQuery(
    clientName,
    {
      skip: !isOpen || !clientName,
      pollingInterval: 5000, // Poll every 5 seconds
    }
  );

  return (
    <Modal show={isOpen} onClose={onClose}>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Threat Profiling Progress</h3>
        <div className="space-y-4">
        {isLoading && <div className="text-center">Loading progress...</div>}
        
        {error && (
          <div className="text-red-400 text-center">
            Error loading progress: {String(error)}
          </div>
        )}
        
        {progress && (
          <>
            <div className="bg-gray-700 p-4 rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Status:</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  progress.status === 'completed' ? 'bg-green-600' :
                  progress.status === 'failed' ? 'bg-red-600' :
                  progress.status === 'in_progress' ? 'bg-blue-600' :
                  'bg-yellow-600'
                }`}>
                  {progress.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between text-sm text-gray-300 mb-1">
                  <span>Progress</span>
                  <span>{progress.progress}%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{width: progress.progress + '%'}}
                  />
                </div>
              </div>
              
              {progress.current_step && (
                <div className="text-sm text-gray-300">
                  <span className="font-medium">Current Step:</span> {progress.current_step}
                </div>
              )}
              
              {progress.estimated_completion && (
                <div className="text-sm text-gray-300">
                  <span className="font-medium">ETA:</span> {new Date(progress.estimated_completion).toLocaleString()}
                </div>
              )}
              
              {progress.error_message && (
                <div className="text-red-400 text-sm mt-2">
                  <span className="font-medium">Error:</span> {progress.error_message}
                </div>
              )}
            </div>
          </>
        )}
        
        <div className="flex justify-end pt-4">
          <Button onClick={onClose} variant="secondary">
            Close
          </Button>
        </div>
        </div>
      </div>
    </Modal>
  );
};

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
}

const ResultsModal: React.FC<ResultsModalProps> = ({
  isOpen,
  onClose,
  clientName,
}) => {
  const { data: results, isLoading, error } = useGetProfilingResultsQuery(
    clientName,
    {
      skip: !isOpen || !clientName,
    }
  );

  return (
    <Modal show={isOpen} onClose={onClose}>
      <div className="p-6 max-w-6xl mx-auto">
        <h3 className="text-xl font-semibold text-white mb-4">Threat Profiling Results</h3>
        <div className="space-y-4 max-h-[80vh] overflow-y-auto">
        {isLoading && <div className="text-center">Loading results...</div>}
        
        {error && (
          <div className="text-red-400 text-center">
            Error loading results: {String(error)}
          </div>
        )}
        
        {results && (
          <>
            {results.has_results ? (
              <div className="space-y-6">
                {/* Executive Summary */}
                {results.results?.executive_summary && (
                  <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-6 rounded-lg border border-blue-500/30">
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                      <svg className="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Executive Summary
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-lg font-semibold text-blue-300 mb-2">Overview</h5>
                        <p className="text-gray-300">{results.results.executive_summary.overview}</p>
                      </div>
                      <div>
                        <h5 className="text-lg font-semibold text-blue-300 mb-2">Risk Posture</h5>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          results.results.executive_summary.risk_posture === 'high' ? 'bg-red-600 text-white' :
                          results.results.executive_summary.risk_posture === 'medium' ? 'bg-yellow-600 text-white' :
                          'bg-green-600 text-white'
                        }`}>
                          {results.results.executive_summary.risk_posture.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h5 className="text-lg font-semibold text-blue-300 mb-2">Key Findings</h5>
                        <ul className="list-disc list-inside space-y-1 text-gray-300">
                          {results.results.executive_summary.key_findings.map((finding, index) => (
                            <li key={index}>{finding}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-lg font-semibold text-blue-300 mb-2">Recommendations</h5>
                        <ul className="list-disc list-inside space-y-1 text-gray-300">
                          {results.results.executive_summary.recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Compliance Status */}
                {results.results?.compliance_status && (
                  <div className="bg-gradient-to-r from-green-900/30 to-teal-900/30 p-6 rounded-lg border border-green-500/30">
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                      <svg className="w-6 h-6 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Compliance Status
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-800/50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-400">
                          {results.results.compliance_status.ism_compliance_percentage}%
                        </div>
                        <div className="text-gray-300">ISM Compliance</div>
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-400">
                          {results.results.compliance_status.overall_security_score}
                        </div>
                        <div className="text-gray-300">Security Score</div>
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-400">
                          {results.results.compliance_status.e8_maturity_level}
                        </div>
                        <div className="text-gray-300">E8 Maturity Level</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Threat Actors */}
                {results.results?.tas && results.results.tas.length > 0 && (
                  <div className="bg-gradient-to-r from-red-900/30 to-pink-900/30 p-6 rounded-lg border border-red-500/30">
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                      <svg className="w-6 h-6 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      Threat Actors ({results.results.tas.length})
                    </h4>
                    <div className="space-y-4">
                      {results.results.tas.map((ta, index) => (
                        <div key={index} className="bg-gray-800/50 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h5 className="text-lg font-semibold text-red-300">{ta.name}</h5>
                              <div className="text-sm text-gray-400">ID: {ta.id} | Type: {ta.type}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-400">Relevance Score</div>
                              <div className="text-lg font-bold text-red-400">{(ta.relevance_score * 100).toFixed(1)}%</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <div className="text-gray-400 mb-1">Sophistication</div>
                              <div className="text-white capitalize">{ta.sophistication}</div>
                            </div>
                            <div>
                              <div className="text-gray-400 mb-1">Motivation</div>
                              <div className="text-white">{ta.motivation.join(', ')}</div>
                            </div>
                            <div>
                              <div className="text-gray-400 mb-1">Capabilities</div>
                              <div className="text-white">{ta.capabilities.join(', ')}</div>
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="text-gray-400 mb-1">Techniques</div>
                            <div className="flex flex-wrap gap-1">
                              {ta.techniques.map((technique, idx) => (
                                <span key={idx} className="px-2 py-1 bg-red-600/30 text-red-300 rounded text-xs">
                                  {technique}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TTPs (Tactics, Techniques & Procedures) */}
                {results.results?.ttps_applicable && results.results.ttps_applicable.length > 0 && (
                  <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 p-6 rounded-lg border border-orange-500/30">
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                      <svg className="w-6 h-6 mr-2 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                      Applicable TTPs ({results.results.ttps_applicable.length})
                    </h4>
                    <div className="space-y-4">
                      {results.results.ttps_applicable.map((ttp, index) => (
                        <div key={index} className="bg-gray-800/50 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h5 className="text-lg font-semibold text-orange-300">{ttp.technique_name}</h5>
                              <div className="text-sm text-gray-400">ID: {ttp.technique_id} | Tactic: {ttp.tactic}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-400">Applicability</div>
                              <div className="text-lg font-bold text-orange-400">{(ttp.applicability_score * 100).toFixed(1)}%</div>
                            </div>
                          </div>
                          <p className="text-gray-300 mb-3">{ttp.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-gray-400 mb-1">Detection Methods</div>
                              <ul className="list-disc list-inside text-white space-y-1">
                                {ttp.detection_methods.map((method, idx) => (
                                  <li key={idx}>{method}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <div className="text-gray-400 mb-1">Mitigations</div>
                              <div className="flex flex-wrap gap-1">
                                {ttp.mitigations.map((mitigation, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-orange-600/30 text-orange-300 rounded text-xs">
                                    {mitigation}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Detection Rules */}
                {results.results?.detections && results.results.detections.length > 0 && (
                  <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 p-6 rounded-lg border border-purple-500/30">
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                      <svg className="w-6 h-6 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Detection Rules ({results.results.detections.length})
                    </h4>
                    <div className="space-y-4">
                      {results.results.detections.map((detection, index) => (
                        <div key={index} className="bg-gray-800/50 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h5 className="text-lg font-semibold text-purple-300">{detection.name}</h5>
                              <div className="text-sm text-gray-400">ID: {detection.detection_id}</div>
                            </div>
                            <div className="flex space-x-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                detection.confidence_level === 'high' ? 'bg-green-600 text-white' :
                                detection.confidence_level === 'medium' ? 'bg-yellow-600 text-white' :
                                'bg-red-600 text-white'
                              }`}>
                                {detection.confidence_level} confidence
                              </span>
                              <span className={`px-2 py-1 rounded text-xs ${
                                detection.false_positive_rate === 'low' ? 'bg-green-600 text-white' :
                                detection.false_positive_rate === 'medium' ? 'bg-yellow-600 text-white' :
                                'bg-red-600 text-white'
                              }`}>
                                {detection.false_positive_rate} FP rate
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-300 mb-3">{detection.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                            <div>
                              <div className="text-gray-400 mb-1">Data Sources</div>
                              <div className="text-white">{detection.data_sources.join(', ')}</div>
                            </div>
                            <div>
                              <div className="text-gray-400 mb-1">MITRE Techniques</div>
                              <div className="flex flex-wrap gap-1">
                                {detection.mitre_techniques.map((technique, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-purple-600/30 text-purple-300 rounded text-xs">
                                    {technique}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400 mb-1">Query ({detection.query_language})</div>
                            <div className="bg-gray-900 p-3 rounded font-mono text-sm text-green-400 overflow-x-auto">
                              {detection.query}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ISM Controls */}
                {results.results?.isms && results.results.isms.length > 0 && (
                  <div className="bg-gradient-to-r from-teal-900/30 to-cyan-900/30 p-6 rounded-lg border border-teal-500/30">
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                      <svg className="w-6 h-6 mr-2 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      ISM Controls ({results.results.isms.length})
                    </h4>
                    <div className="space-y-4">
                      {results.results.isms.map((ism, index) => (
                        <div key={index} className="bg-gray-800/50 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h5 className="text-lg font-semibold text-teal-300">{ism.control_name}</h5>
                              <div className="text-sm text-gray-400">ID: {ism.control_id}</div>
                            </div>
                            <div className="flex space-x-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                ism.implementation_status === 'implemented' ? 'bg-green-600 text-white' :
                                ism.implementation_status === 'partially_implemented' ? 'bg-yellow-600 text-white' :
                                'bg-red-600 text-white'
                              }`}>
                                {ism.implementation_status.replace('_', ' ')}
                              </span>
                              <span className="px-2 py-1 bg-teal-600 text-white rounded text-xs">
                                Score: {(ism.compliance_score * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-300 mb-3">{ism.control_description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-gray-400 mb-1">Implementation Guidance</div>
                              <div className="text-white">{ism.implementation_guidance}</div>
                            </div>
                            <div>
                              <div className="text-gray-400 mb-1">Recommendations</div>
                              <ul className="list-disc list-inside text-white space-y-1">
                                {ism.recommendations.map((rec, idx) => (
                                  <li key={idx}>{rec}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Essential 8 */}
                {results.results?.e8s && results.results.e8s.length > 0 && (
                  <div className="bg-gradient-to-r from-indigo-900/30 to-blue-900/30 p-6 rounded-lg border border-indigo-500/30">
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                      <svg className="w-6 h-6 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Essential 8 ({results.results.e8s.length})
                    </h4>
                    <div className="space-y-4">
                      {results.results.e8s.map((e8, index) => (
                        <div key={index} className="bg-gray-800/50 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h5 className="text-lg font-semibold text-indigo-300">{e8.mitigation_name}</h5>
                              <div className="text-sm text-gray-400">ID: {e8.mitigation_id}</div>
                            </div>
                            <div className="flex space-x-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                e8.priority === 'critical' ? 'bg-red-600 text-white' :
                                e8.priority === 'high' ? 'bg-orange-600 text-white' :
                                e8.priority === 'medium' ? 'bg-yellow-600 text-white' :
                                'bg-green-600 text-white'
                              }`}>
                                {e8.priority} priority
                              </span>
                              <span className="px-2 py-1 bg-indigo-600 text-white rounded text-xs">
                                {e8.implementation_level.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-300 mb-3">{e8.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                            <div>
                              <div className="text-gray-400 mb-1">Current Implementation</div>
                              <div className="text-white">{e8.current_implementation}</div>
                            </div>
                            <div>
                              <div className="text-gray-400 mb-1">Gaps Identified</div>
                              <ul className="list-disc list-inside text-white space-y-1">
                                {e8.gaps_identified.map((gap, idx) => (
                                  <li key={idx}>{gap}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400 mb-1">Recommendations</div>
                            <ul className="list-disc list-inside text-white space-y-1">
                              {e8.recommendations.map((rec, idx) => (
                                <li key={idx}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                {results.results?.metadata && (
                  <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 p-6 rounded-lg border border-gray-500/30">
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                      <svg className="w-6 h-6 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Report Metadata
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400 mb-1">Report ID</div>
                        <div className="text-white font-mono">{results.results.report_id}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1">Generated At</div>
                        <div className="text-white">{new Date(results.results.generated_at || '').toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1">Duration</div>
                        <div className="text-white">{results.results.metadata.profiling_duration_seconds}s</div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1">Confidence</div>
                        <div className="text-white capitalize">{results.results.metadata.confidence_level}</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-gray-400 mb-1">Data Sources Analyzed</div>
                      <div className="flex flex-wrap gap-1">
                        {results.results.metadata.data_sources_analyzed.map((source, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-600/30 text-gray-300 rounded text-xs">
                            {source}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="text-lg font-medium mb-2">No Results Available</div>
                <div>The threat profiling may still be in progress or no results were generated.</div>
              </div>
            )}
          </>
        )}
        
        <div className="flex justify-end pt-6 border-t border-gray-600">
          <Button onClick={onClose} variant="secondary">
            Close
          </Button>
        </div>
        </div>
      </div>
    </Modal>
  );
};

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
}

const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  clientName,
}) => {
  const { data: history, isLoading, error } = useGetProfilingHistoryQuery(
    clientName,
    {
      skip: !isOpen || !clientName,
    }
  );

  return (
    <Modal show={isOpen} onClose={onClose}>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Threat Profiling History</h3>
        <div className="space-y-4 max-h-96 overflow-y-auto">
        {isLoading && <div className="text-center">Loading history...</div>}
        
        {error && (
          <div className="text-red-400 text-center">
            Error loading history: {String(error)}
          </div>
        )}
        
        {history && (
          <>
            {history.history.length > 0 ? (
              <div className="space-y-3">
                {history.history.map((run) => (
                  <div key={run.run_id} className="bg-gray-700 p-4 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-300">
                        Run ID: {run.run_id}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        run.status === 'completed' ? 'bg-green-600' :
                        run.status === 'failed' ? 'bg-red-600' :
                        'bg-yellow-600'
                      }`}>
                        {run.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-400 space-y-1">
                      <div>Started: {new Date(run.started_at).toLocaleString()}</div>
                      {run.completed_at && (
                        <div>Completed: {new Date(run.completed_at).toLocaleString()}</div>
                      )}
                      <div>
                        Results Available: {run.results_available ? 'Yes' : 'No'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400">
                No profiling history found for this organization.
              </div>
            )}
          </>
        )}
        
        <div className="flex justify-end pt-4">
          <Button onClick={onClose} variant="secondary">
            Close
          </Button>
        </div>
        </div>
      </div>
    </Modal>
  );
};

const ThreatProfilingControlPanel: React.FC<ThreatProfilingControlPanelProps> = ({
  clientName,
}) => {
  const { user } = useUser();
  const [startProfilingModal, setStartProfilingModal] = useState(false);
  const [progressModal, setProgressModal] = useState(false);
  const [resultsModal, setResultsModal] = useState(false);
  const [historyModal, setHistoryModal] = useState(false);

  const [startProfiling, { isLoading: isStarting }] = useStartProfilingMutation();
  const { data: canRerun } = useCanRerunProfilingQuery(clientName);

  // Check if user has permission to access threat profiling controls
  const hasAccess = user && (isLEMaster(user) || isOrgAdmin(user));

  if (!hasAccess) {
    return null; // Don't render anything if user doesn't have access
  }

  // Determine if start profiling should be disabled
  // Allow starting if:
  // 1. Not currently starting
  // 2. AND (no canRerun data yet OR canRerun data says can_rerun is true OR there was an error checking canRerun)
  const isStartDisabled = isStarting || (canRerun && canRerun.can_rerun === false);
  
  // Get the reason why start is disabled (for user feedback)
  const getDisabledReason = () => {
    if (isStarting) return "Starting profiling...";
    if (canRerun && canRerun.can_rerun === false) {
      return canRerun.reason || "Profiling cannot be started at this time";
    }
    return null;
  };

  const handleStartProfiling = async (data: StartProfilingDto) => {
    try {
      await startProfiling({
        ...data,
        client_name: clientName,
      }).unwrap();
      setStartProfilingModal(false);
      // Show success message or redirect to progress
      alert("Threat profiling started successfully!");
    } catch (error) {
      console.error("Failed to start profiling:", error);
      alert("Failed to start threat profiling. Please try again.");
    }
  };

  // Check if user has permission to access threat profiling
  const hasPermission = user && (isLEMaster(user) || isOrgAdmin(user));

  // Don't render anything if user doesn't have permission
  if (!hasPermission) {
    return null;
  }

  return (
    <div className="bg-secondary-800/50 rounded-xl p-6 border border-secondary-700/30">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
          <svg
            className="w-4 h-4 text-indigo-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a4 4 0 01-4-4V5a4 4 0 014-4h10a4 4 0 014 4v14a4 4 0 01-4 4z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white">
          Threat Profiling
        </h3>
      </div>
      
      <div className="space-y-3">
        <button
          onClick={() => setStartProfilingModal(true)}
          disabled={isStartDisabled}
          className="w-full p-4 bg-gradient-to-r from-indigo-600/20 to-indigo-700/20 rounded-lg hover:from-indigo-500/30 hover:to-indigo-600/30 transition-all duration-200 border border-indigo-500/30 hover:border-indigo-400/50 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg
                className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                />
              </svg>
              <span className="text-white font-medium">
                {isStarting ? "Starting..." : "Start Profiling"}
              </span>
            </div>
            <svg
              className="w-4 h-4 text-secondary-400 group-hover:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </button>
        
        {/* Disabled reason message */}
        {isStartDisabled && (
          <div className="text-sm text-yellow-400 bg-yellow-900/20 border border-yellow-500/30 rounded-lg px-3 py-2 mt-2">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>{getDisabledReason()}</span>
            </div>
          </div>
        )}
        
        <button
          onClick={() => setProgressModal(true)}
          className="w-full p-4 bg-gradient-to-r from-yellow-600/20 to-yellow-700/20 rounded-lg hover:from-yellow-500/30 hover:to-yellow-600/30 transition-all duration-200 border border-yellow-500/30 hover:border-yellow-400/50 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg
                className="w-5 h-5 text-yellow-400 group-hover:text-yellow-300"
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
              <span className="text-white font-medium">View Progress</span>
            </div>
            <svg
              className="w-4 h-4 text-secondary-400 group-hover:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </button>
        
        <button
          onClick={() => setResultsModal(true)}
          className="w-full p-4 bg-gradient-to-r from-green-600/20 to-green-700/20 rounded-lg hover:from-green-500/30 hover:to-green-600/30 transition-all duration-200 border border-green-500/30 hover:border-green-400/50 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg
                className="w-5 h-5 text-green-400 group-hover:text-green-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-white font-medium">View Results</span>
            </div>
            <svg
              className="w-4 h-4 text-secondary-400 group-hover:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </button>
        
        <button
          onClick={() => setHistoryModal(true)}
          className="w-full p-4 bg-gradient-to-r from-purple-600/20 to-purple-700/20 rounded-lg hover:from-purple-500/30 hover:to-purple-600/30 transition-all duration-200 border border-purple-500/30 hover:border-purple-400/50 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg
                className="w-5 h-5 text-purple-400 group-hover:text-purple-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-white font-medium">View History</span>
            </div>
            <svg
              className="w-4 h-4 text-secondary-400 group-hover:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </button>
      </div>

      {canRerun && !canRerun.can_rerun && (
        <div className="mt-4 p-3 bg-yellow-900/50 border border-yellow-700/30 rounded-lg">
          <p className="text-yellow-300 text-sm">
            {canRerun.reason}
            {canRerun.next_allowed_run && (
              <span className="block mt-1">
                Next run allowed: {new Date(canRerun.next_allowed_run).toLocaleString()}
              </span>
            )}
            {canRerun.runs_remaining !== undefined && (
              <span className="block mt-1">
                Runs remaining: {canRerun.runs_remaining}
              </span>
            )}
          </p>
        </div>
      )}

      {/* Modals */}
      <StartProfilingModal
        isOpen={startProfilingModal}
        onClose={() => setStartProfilingModal(false)}
        onSubmit={handleStartProfiling}
        isLoading={isStarting}
      />

      <ProgressModal
        isOpen={progressModal}
        onClose={() => setProgressModal(false)}
        clientName={clientName}
      />

      <ResultsModal
        isOpen={resultsModal}
        onClose={() => setResultsModal(false)}
        clientName={clientName}
      />

      <HistoryModal
        isOpen={historyModal}
        onClose={() => setHistoryModal(false)}
        clientName={clientName}
      />
    </div>
  );
};

export default ThreatProfilingControlPanel;