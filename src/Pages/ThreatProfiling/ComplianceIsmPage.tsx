import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ThreatProfilingLayout from '../../components/Common/ThreatProfilingLayout';
import LoadingScreen from '../../components/Common/LoadingScreen';
import Button from '../../components/Common/Button';
import { useGetProfilingResultsQuery } from '../../Redux/api/threatProfilingApi';

const ComplianceIsmPage: React.FC = () => {
  const { client_name } = useParams<{ client_name: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: profilingResults, isLoading, error } = useGetProfilingResultsQuery(client_name || 'tunki_com');

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error && !profilingResults?.has_results) {
    return (
      <ThreatProfilingLayout>
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-amber-600/20 border border-amber-500/30 rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold text-amber-400 mb-2">No ISM Data Available</h3>
              <p className="text-secondary-300 mb-4">
                ISM compliance data is not available for this organization yet.
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

  const ismControls = profilingResults?.results?.isms || [];
  const filteredControls = ismControls.filter(control =>
    control.control_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    control.control_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredControls.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedControls = filteredControls.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented': return 'text-green-400';
      case 'partially_implemented': return 'text-yellow-400';
      case 'not_implemented': return 'text-red-400';
      default: return 'text-secondary-400';
    }
  };

  return (
    <ThreatProfilingLayout>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary-400 to-secondary-300 bg-clip-text text-transparent mb-2">
                  ISM Compliance ({ismControls.length})
                </h1>
                <p className="text-lg text-secondary-400">
                  Information Security Manual compliance assessment
                </p>
              </div>
              <Button 
                onClick={() => navigate(`/threat-profiling/${client_name}`)} 
                variant="outline"
              >
                ← Back to Overview
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search controls..."
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
                    <th className="px-6 py-4 text-left text-xs font-medium text-secondary-400 uppercase tracking-wider">Control</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-secondary-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-secondary-400 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-secondary-400 uppercase tracking-wider">Recommendations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-700/50">
                  {paginatedControls.map((control, index) => (
                    <tr key={control.control_id || index} className="hover:bg-secondary-700/30">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-medium">{control.control_name}</div>
                          <div className="text-sm text-secondary-400">{control.control_id}</div>
                          <div className="text-sm text-secondary-500 mt-1">{control.control_description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-medium ${getStatusColor(control.implementation_status)}`}>
                          {control.implementation_status?.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-lg font-bold text-white">{Math.round(control.compliance_score * 100)}%</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {control.recommendations?.slice(0, 2).map((rec, idx) => (
                            <div key={idx} className="text-sm text-secondary-300">• {rec}</div>
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
        </div>
      </div>
    </ThreatProfilingLayout>
  );
};

export default ComplianceIsmPage;