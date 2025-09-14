import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ThreatProfilingLayout from '../../components/Common/ThreatProfilingLayout';
import LoadingScreen from '../../components/Common/LoadingScreen';
import Button from '../../components/Common/Button';
import { useGetProfilingResultsQuery } from '../../Redux/api/threatProfilingApi';

const DetectionPage: React.FC = () => {
  const { client_name } = useParams<{ client_name: string }>();
  const navigate = useNavigate();
  const [selectedDetections, setSelectedDetections] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: profilingResults, isLoading, error } = useGetProfilingResultsQuery(client_name || 'tunki_com');

  const hasResults = profilingResults?.has_results || false;
  const detections = profilingResults?.results?.detections || [];

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error && !hasResults) {
    return (
      <ThreatProfilingLayout>
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-amber-600/20 border border-amber-500/30 rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold text-amber-400 mb-2">No Detection Data Available</h3>
              <p className="text-secondary-300 mb-4">
                Threat profiling results are not available for this organization yet. Please run threat profiling first.
              </p>
              <Button onClick={() => navigate(`/threat-profiling/${client_name}`)} variant="primary">
                Back to Overview
              </Button>
            </div>
          </div>
        </div>
      </ThreatProfilingLayout>
    );
  }

  // Filter and paginate detections
  const filteredDetections = detections.filter(detection =>
    detection.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    detection.detection_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    detection.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDetections.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDetections = filteredDetections.slice(startIndex, startIndex + itemsPerPage);

  const handleDetectionToggle = (detectionId: string) => {
    setSelectedDetections(prev => 
      prev.includes(detectionId) 
        ? prev.filter(id => id !== detectionId)
        : [...prev, detectionId]
    );
  };

  const getConfidenceColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-red-400';
      default: return 'text-secondary-400';
    }
  };

  const getFalsePositiveColor = (rate: string) => {
    switch (rate.toLowerCase()) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-secondary-400';
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent mb-2">
                  Detection Rules ({detections.length})
                </h1>
                <p className="text-lg text-secondary-400">
                  Generated detection rules based on applicable threats
                </p>
              </div>
              <Button 
                onClick={() => navigate(`/threat-profiling/${client_name}`)} 
                variant="outline"
              >
                ← Back to Overview
              </Button>
            </div>
            
            <div className="bg-gradient-to-r from-green-600/20 to-green-500/20 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-300">
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                These detection rules have been generated based on the applicable threats and can be implemented in your security monitoring systems.
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search detection rules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-secondary-800 border border-secondary-700 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>
            <div className="text-sm text-secondary-400 flex items-center">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredDetections.length)} of {filteredDetections.length} rules
            </div>
          </div>

          {/* Detection Rules */}
          <div className="space-y-4">
            {paginatedDetections.map((detection, index) => (
              <div 
                key={detection.detection_id || index}
                className={`bg-secondary-800/50 rounded-xl border p-6 transition-all duration-200 ${
                  selectedDetections.includes(detection.detection_id)
                    ? 'border-primary-500/50 bg-primary-600/10'
                    : 'border-secondary-700/50 hover:border-secondary-600/50'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <button
                      onClick={() => handleDetectionToggle(detection.detection_id)}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center mt-1 ${
                        selectedDetections.includes(detection.detection_id)
                          ? 'bg-primary-600 border-primary-600'
                          : 'border-secondary-500 hover:border-secondary-400'
                      }`}
                    >
                      {selectedDetections.includes(detection.detection_id) && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-white">{detection.name}</h4>
                        <span className="px-3 py-1 bg-secondary-700 text-secondary-300 text-sm rounded-full">
                          {detection.detection_id}
                        </span>
                        <span className="px-3 py-1 bg-blue-600/20 text-blue-400 text-sm rounded-full">
                          {detection.query_language}
                        </span>
                      </div>
                      <p className="text-secondary-400 text-sm mb-4">{detection.description}</p>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Query */}
                        <div className="lg:col-span-2">
                          <h5 className="text-sm font-medium text-white mb-3">Detection Query</h5>
                          <div className="bg-secondary-900/50 rounded-lg p-4">
                            <code className="text-sm text-green-300 font-mono break-all">
                              {detection.query}
                            </code>
                          </div>
                        </div>
                        
                        {/* Metadata */}
                        <div className="space-y-4">
                          <div>
                            <h5 className="text-sm font-medium text-white mb-3">Detection Metrics</h5>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-secondary-400">Confidence:</span>
                                <span className={`text-sm font-medium ${getConfidenceColor(detection.confidence_level)}`}>
                                  {detection.confidence_level?.charAt(0).toUpperCase() + detection.confidence_level?.slice(1)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-secondary-400">False Positive Rate:</span>
                                <span className={`text-sm font-medium ${getFalsePositiveColor(detection.false_positive_rate)}`}>
                                  {detection.false_positive_rate?.charAt(0).toUpperCase() + detection.false_positive_rate?.slice(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* MITRE Techniques */}
                          {detection.mitre_techniques && detection.mitre_techniques.length > 0 && (
                            <div>
                              <h5 className="text-sm font-medium text-white mb-3">MITRE Techniques</h5>
                              <div className="space-y-1">
                                {detection.mitre_techniques.map((technique, idx) => (
                                  <span key={idx} className="inline-block px-2 py-1 bg-secondary-700/50 text-secondary-300 rounded text-xs mr-1 mb-1">
                                    {technique}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Data Sources */}
                          {detection.data_sources && detection.data_sources.length > 0 && (
                            <div>
                              <h5 className="text-sm font-medium text-white mb-3">Data Sources</h5>
                              <div className="space-y-1">
                                {detection.data_sources.map((source, idx) => (
                                  <div key={idx} className="text-sm text-secondary-300">
                                    • {source}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-secondary-400">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  className="px-3 py-1 text-sm"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
          {selectedDetections.length > 0 && (
            <div className="mt-8 bg-secondary-800/50 rounded-xl border border-secondary-700/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Selected Detection Rules ({selectedDetections.length})
              </h3>
              <p className="text-secondary-400 text-sm">
                These selected detection rules can be implemented in your SIEM or security monitoring platform.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-secondary-700">
            <Button 
              onClick={() => navigate(`/threat-profiling/threats`)}
              variant="outline"
            >
              ← Threats & TTPs
            </Button>
            <div className="text-center">
              <p className="text-sm text-secondary-400">
                {selectedDetections.length} of {detections.length} rules selected
              </p>
            </div>
            <Button 
              onClick={() => navigate(`/threat-profiling/compliance-ism`)}
              variant="primary"
            >
              ISM Compliance →
            </Button>
          </div>
        </div>
      </div>
    </ThreatProfilingLayout>
  );

};

export default DetectionPage;