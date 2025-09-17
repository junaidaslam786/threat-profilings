import React from "react";
import Modal from "../Common/Modal";
import { useGetProfilingProgressQuery } from "../../Redux/api/threatProfilingApi";

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
              </div>
              
              {progress.status === 'completed' && (
                <div className="text-center">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    View Results
                  </button>
                </div>
              )}
              
              {progress.status === 'failed' && progress.error_message && (
                <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded">
                  <span className="font-medium">Error:</span> {progress.error_message}
                </div>
              )}
            </>
          )}
          
          <div className="text-center">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-secondary-600 hover:bg-secondary-500 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProgressModal;