import React, { useState } from "react";
import Modal from "../Common/Modal";
import type { StartProfilingDto } from "../../Redux/api/threatProfilingApi";

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
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
              placeholder="Enter reason for starting threat profiling..."
            />
          </div>
          
          <div className="flex space-x-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-secondary-600 hover:bg-secondary-500 text-white rounded-lg transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Starting..." : "Start Profiling"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default StartProfilingModal;