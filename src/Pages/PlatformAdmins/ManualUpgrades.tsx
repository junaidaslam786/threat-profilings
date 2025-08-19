import React, { useState } from 'react';
import Button from '../../components/Common/Button';
import Modal from '../../components/Common/Modal';
import InputField from '../../components/Common/InputField';

interface UpgradeRequest {
  id: string;
  clientName: string;
  organizationName: string;
  currentTier: string;
  requestedTier: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestDate: string;
  processedDate?: string;
  processedBy?: string;
  notes?: string;
  priceAdjustment?: number;
}

const ManualUpgrades: React.FC = () => {
  const [upgradeRequests, setUpgradeRequests] = useState<UpgradeRequest[]>([
    {
      id: '1',
      clientName: 'john_doe_acme',
      organizationName: 'Acme Corporation',
      currentTier: 'Basic',
      requestedTier: 'Professional',
      reason: 'Need additional threat profiling features',
      status: 'pending',
      requestDate: '2024-02-15'
    },
    {
      id: '2',
      clientName: 'security_solutions_inc',
      organizationName: 'Security Solutions Inc',
      currentTier: 'Professional',
      requestedTier: 'Enterprise',
      reason: 'Expanding team, need unlimited scans',
      status: 'approved',
      requestDate: '2024-02-10',
      processedDate: '2024-02-12',
      processedBy: 'admin@platform.com',
      notes: 'Approved for immediate upgrade'
    },
    {
      id: '3',
      clientName: 'startup_security',
      organizationName: 'Startup Security LLC',
      currentTier: 'Basic',
      requestedTier: 'Enterprise',
      reason: 'Special enterprise requirements',
      status: 'rejected',
      requestDate: '2024-02-05',
      processedDate: '2024-02-08',
      processedBy: 'admin@platform.com',
      notes: 'Suggested Professional tier instead'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<UpgradeRequest | null>(null);
  const [processingNotes, setProcessingNotes] = useState('');
  const [priceAdjustment, setPriceAdjustment] = useState(0);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRequest, setNewRequest] = useState({
    clientName: '',
    organizationName: '',
    currentTier: '',
    requestedTier: '',
    reason: ''
  });

  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'completed'>('all');

  const filteredRequests = upgradeRequests.filter(request => 
    filter === 'all' || request.status === filter
  );

  const handleProcessRequest = (id: string, status: 'approved' | 'rejected') => {
    const updatedRequests = upgradeRequests.map(request =>
      request.id === id
        ? {
            ...request,
            status,
            processedDate: new Date().toISOString().split('T')[0],
            processedBy: 'current-admin@platform.com', // In real app, get from auth context
            notes: processingNotes,
            priceAdjustment: status === 'approved' ? priceAdjustment : undefined
          }
        : request
    );
    setUpgradeRequests(updatedRequests);
    setShowModal(false);
    setSelectedRequest(null);
    setProcessingNotes('');
    setPriceAdjustment(0);
  };

  const handleCreateRequest = () => {
    const request: UpgradeRequest = {
      id: Date.now().toString(),
      clientName: newRequest.clientName,
      organizationName: newRequest.organizationName,
      currentTier: newRequest.currentTier,
      requestedTier: newRequest.requestedTier,
      reason: newRequest.reason,
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0]
    };
    setUpgradeRequests([...upgradeRequests, request]);
    setNewRequest({ clientName: '', organizationName: '', currentTier: '', requestedTier: '', reason: '' });
    setShowCreateModal(false);
  };

  const getStatusColor = (status: UpgradeRequest['status']) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusCounts = () => {
    return {
      all: upgradeRequests.length,
      pending: upgradeRequests.filter(r => r.status === 'pending').length,
      approved: upgradeRequests.filter(r => r.status === 'approved').length,
      rejected: upgradeRequests.filter(r => r.status === 'rejected').length,
      completed: upgradeRequests.filter(r => r.status === 'completed').length
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Manual Upgrade Requests</h1>
            <p className="text-gray-400">Process subscription tier upgrade requests from clients</p>
          </div>
          <Button
            onClick={() => {
              setNewRequest({ clientName: '', organizationName: '', currentTier: '', requestedTier: '', reason: '' });
              setShowCreateModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Create Request
          </Button>
        </div>

        {/* Status Filter Tabs */}
        <div className="mb-6">
          <div className="inline-flex space-x-2 bg-gray-800 p-1 rounded-lg">
            {(['all', 'pending', 'approved', 'rejected', 'completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg border border-yellow-700">
            <h3 className="text-sm font-medium text-gray-400">Pending Requests</h3>
            <p className="text-2xl font-bold text-yellow-400">{statusCounts.pending}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-green-700">
            <h3 className="text-sm font-medium text-gray-400">Approved</h3>
            <p className="text-2xl font-bold text-green-400">{statusCounts.approved}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-red-700">
            <h3 className="text-sm font-medium text-gray-400">Rejected</h3>
            <p className="text-2xl font-bold text-red-400">{statusCounts.rejected}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-blue-700">
            <h3 className="text-sm font-medium text-gray-400">Completed</h3>
            <p className="text-2xl font-bold text-blue-400">{statusCounts.completed}</p>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Client/Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Current → Requested
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Request Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">{request.organizationName}</div>
                        <div className="text-sm text-gray-400">{request.clientName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        <span className="bg-gray-600 px-2 py-1 rounded text-xs">{request.currentTier}</span>
                        <span className="mx-2 text-gray-500">→</span>
                        <span className="bg-blue-600 px-2 py-1 rounded text-xs">{request.requestedTier}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-300 max-w-xs truncate" title={request.reason}>
                        {request.reason}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(request.requestDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setProcessingNotes('');
                              setPriceAdjustment(0);
                              setShowModal(true);
                            }}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            Process
                          </button>
                        </>
                      )}
                      <button className="text-gray-400 hover:text-gray-300">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Process Request Modal */}
        <Modal
          show={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedRequest(null);
            setProcessingNotes('');
            setPriceAdjustment(0);
          }}
          size="lg"
        >
          {selectedRequest && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white mb-4">
                Process Upgrade Request
              </h3>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2">Request Details</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-400">Organization:</span> <span className="text-white">{selectedRequest.organizationName}</span></div>
                  <div><span className="text-gray-400">Client:</span> <span className="text-white">{selectedRequest.clientName}</span></div>
                  <div><span className="text-gray-400">Upgrade:</span> <span className="text-white">{selectedRequest.currentTier} → {selectedRequest.requestedTier}</span></div>
                  <div><span className="text-gray-400">Reason:</span> <span className="text-white">{selectedRequest.reason}</span></div>
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="notes" className="block text-gray-300 text-sm font-bold mb-2">
                  Processing Notes
                </label>
                <textarea
                  id="notes"
                  value={processingNotes}
                  onChange={(e) => setProcessingNotes(e.target.value)}
                  placeholder="Add notes about this decision..."
                  rows={3}
                  className="shadow appearance-none border rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-300 ease-in-out border-gray-600 bg-gray-700 text-white"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="priceAdjustment" className="block text-gray-300 text-sm font-bold mb-2">
                  Price Adjustment (if approved)
                </label>
                <input
                  id="priceAdjustment"
                  type="number"
                  value={priceAdjustment.toString()}
                  onChange={(e) => setPriceAdjustment(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  step="0.01"
                  className="shadow appearance-none border rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-300 ease-in-out border-gray-600 bg-gray-700 text-white"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  onClick={() => handleProcessRequest(selectedRequest.id, 'rejected')}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Reject Request
                </Button>
                <Button
                  onClick={() => handleProcessRequest(selectedRequest.id, 'approved')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Approve Request
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Create Request Modal */}
        <Modal
          show={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setNewRequest({ clientName: '', organizationName: '', currentTier: '', requestedTier: '', reason: '' });
          }}
          size="lg"
        >
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">
              Create Upgrade Request
            </h3>
            
            <InputField
              label="Client Name"
              type="text"
              name="clientName"
              value={newRequest.clientName}
              onChange={(e) => setNewRequest({ ...newRequest, clientName: e.target.value })}
              placeholder="Enter client name (e.g., john_doe_acme)"
              required
            />
            
            <InputField
              label="Organization Name"
              type="text"
              name="organizationName"
              value={newRequest.organizationName}
              onChange={(e) => setNewRequest({ ...newRequest, organizationName: e.target.value })}
              placeholder="Enter organization name"
              required
            />
            
            <InputField
              label="Current Tier"
              type="text"
              name="currentTier"
              value={newRequest.currentTier}
              onChange={(e) => setNewRequest({ ...newRequest, currentTier: e.target.value })}
              placeholder="e.g., Basic, Professional"
              required
            />
            
            <InputField
              label="Requested Tier"
              type="text"
              name="requestedTier"
              value={newRequest.requestedTier}
              onChange={(e) => setNewRequest({ ...newRequest, requestedTier: e.target.value })}
              placeholder="e.g., Professional, Enterprise"
              required
            />
            
            <div className="mb-4">
              <label htmlFor="reason" className="block text-gray-300 text-sm font-bold mb-2">
                Reason for Upgrade
              </label>
              <textarea
                id="reason"
                value={newRequest.reason}
                onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
                placeholder="Explain why this upgrade is needed..."
                rows={3}
                required
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-300 ease-in-out border-gray-600 bg-gray-700 text-white"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewRequest({ clientName: '', organizationName: '', currentTier: '', requestedTier: '', reason: '' });
                }}
                className="bg-gray-600 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateRequest}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!newRequest.clientName || !newRequest.organizationName || !newRequest.currentTier || !newRequest.requestedTier || !newRequest.reason}
              >
                Create Request
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ManualUpgrades;
