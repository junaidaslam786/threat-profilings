import React from "react";
import Modal from "../Common/Modal";
import { useGetProfilingResultsQuery } from "../../Redux/api/threatProfilingApi";

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
}

const ResultsModal: React.FC<ResultsModalProps> = React.memo(({
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

  // Type-safe accessors for the results data
  const hasResults = results?.has_results || false;
  const resultsData = results?.results as Record<string, unknown>; // Using Record for better typing

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
            {hasResults ? (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">Results Available</h4>
                  <p className="text-gray-400">
                    Threat profiling analysis completed successfully.
                    Detailed results processing and display is in development.
                  </p>
                  <div className="mt-4 text-sm text-gray-500">
                    Raw data: {JSON.stringify(resultsData, null, 2).slice(0, 200)}...
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">No Results Available</h4>
                <p className="text-gray-400">
                  The threat profiling analysis is complete, but no detailed results are available yet.
                  This could mean the analysis is still being processed or no threats were identified.
                </p>
              </div>
            )}
          </>
        )}
        </div>
      </div>
    </Modal>
  );
});

ResultsModal.displayName = 'ResultsModal';

export default ResultsModal;