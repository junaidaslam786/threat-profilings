import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Common/Navbar";
import LoadingScreen from "../../components/Common/LoadingScreen";
import Modal from "../../components/Common/Modal";
import { toast } from "react-hot-toast";

// Mock partner data structure
interface Partner {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'active' | 'pending' | 'suspended';
  tier: 'basic' | 'premium' | 'enterprise';
  joinedAt: string;
  lastActivity: string;
  revenue: number;
}

const PartnerManagement: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading] = useState(false);
  const [error] = useState(null);

  // Mock partners data
  const [partners] = useState<Partner[]>([
    {
      id: "1",
      name: "John Smith",
      email: "john@techcorp.com",
      company: "TechCorp Solutions",
      status: "active",
      tier: "enterprise",
      joinedAt: "2024-01-15",
      lastActivity: "2024-01-20",
      revenue: 15000
    },
    {
      id: "2", 
      name: "Sarah Johnson",
      email: "sarah@innovate.io",
      company: "Innovate Labs",
      status: "active",
      tier: "premium",
      joinedAt: "2024-01-10",
      lastActivity: "2024-01-19",
      revenue: 8500
    },
    {
      id: "3",
      name: "Mike Chen",
      email: "mike@startup.com",
      company: "StartupX",
      status: "pending",
      tier: "basic",
      joinedAt: "2024-01-18",
      lastActivity: "2024-01-18",
      revenue: 2000
    }
  ]);

  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [partnerToSuspend, setPartnerToSuspend] = useState<Partner | null>(null);
  const [suspendReason, setSuspendReason] = useState("");

  const [showActivateModal, setShowActivateModal] = useState(false);
  const [partnerToActivate, setPartnerToActivate] = useState<Partner | null>(null);

  const handleSuspendClick = (partner: Partner) => {
    setPartnerToSuspend(partner);
    setShowSuspendModal(true);
  };

  const handleActivateClick = (partner: Partner) => {
    setPartnerToActivate(partner);
    setShowActivateModal(true);
  };

  const confirmSuspendPartner = async () => {
    if (partnerToSuspend) {
      try {
        // Mock API call
        toast.success(`Successfully suspended partner ${partnerToSuspend.name}`);
        setShowSuspendModal(false);
        setPartnerToSuspend(null);
        setSuspendReason("");
      } catch (err) {
        toast.error("Failed to suspend partner.");
      }
    }
  };

  const confirmActivatePartner = async () => {
    if (partnerToActivate) {
      try {
        // Mock API call
        toast.success(`Successfully activated partner ${partnerToActivate.name}`);
        setShowActivateModal(false);
        setPartnerToActivate(null);
      } catch (err) {
        toast.error("Failed to activate partner.");
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      case 'suspended':
        return 'bg-red-500/20 text-red-400 border border-red-500/30';
      default:
        return 'bg-secondary-500/20 text-secondary-400 border border-secondary-500/30';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'enterprise':
        return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
      case 'premium':
        return 'bg-primary-500/20 text-primary-400 border border-primary-500/30';
      case 'basic':
        return 'bg-secondary-500/20 text-secondary-400 border border-secondary-500/30';
      default:
        return 'bg-secondary-500/20 text-secondary-400 border border-secondary-500/30';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <LoadingScreen />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 p-8 rounded-xl border border-red-500/30 text-center max-w-md">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-400 mb-4">Error Loading Partners</h2>
            <p className="text-secondary-300 mb-6">Failed to load partner list.</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-500 hover:to-primary-600 transition-all duration-200 cursor-pointer"
              >
                Retry
              </button>
              <button
                onClick={() => navigate("/platform-admins")}
                className="px-6 py-3 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white rounded-lg hover:from-secondary-500 hover:to-secondary-600 transition-all duration-200 cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent mb-3">
              Partner Management
            </h1>
            <p className="text-secondary-300 text-lg">
              Manage business partners, their tiers, and partnership status
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-all duration-200 cursor-pointer flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
            <button
              onClick={() => navigate("/platform-admins")}
              className="px-6 py-3 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white rounded-lg hover:from-secondary-500 hover:to-secondary-600 transition-all duration-200 cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-8 border border-secondary-700/50">
          {partners.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-secondary-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-secondary-400 text-lg">No partners found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-secondary-700/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-300 uppercase tracking-wider">
                      Partner
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-300 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-300 uppercase tracking-wider">
                      Tier
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-300 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-300 uppercase tracking-wider">
                      Last Activity
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {partners.map((partner: Partner, index) => (
                    <tr key={partner.id} className={`border-b border-secondary-700/30 hover:bg-secondary-700/20 transition-colors ${index % 2 === 0 ? 'bg-secondary-800/30' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                            {partner.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-white font-medium">{partner.name}</div>
                            <div className="text-secondary-400 text-sm">{partner.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {partner.company}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTierColor(partner.tier)}`}>
                          {partner.tier.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(partner.status)}`}>
                          {partner.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        ${partner.revenue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-secondary-300">
                        {new Date(partner.lastActivity).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {partner.status === 'active' ? (
                            <button
                              onClick={() => handleSuspendClick(partner)}
                              className="px-3 py-1 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-200 cursor-pointer text-sm"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivateClick(partner)}
                              className="px-3 py-1 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-all duration-200 cursor-pointer text-sm"
                            >
                              Activate
                            </button>
                          )}
                          <button
                            onClick={() => navigate(`/partners/${partner.id}`)}
                            className="px-3 py-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-500 hover:to-primary-600 transition-all duration-200 cursor-pointer text-sm"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Suspend Partner Modal */}
        <Modal show={showSuspendModal} onClose={() => setShowSuspendModal(false)}>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-orange-400 mb-4">Suspend Partner</h2>
            <p className="mb-6 text-secondary-300">
              Are you sure you want to suspend partner{" "}
              <span className="font-semibold text-primary-400">
                {partnerToSuspend?.name}
              </span>
              ?
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-secondary-300 mb-2">Reason for Suspension</label>
              <textarea
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                placeholder="e.g., Policy violation, contract breach"
                rows={3}
                className="w-full px-4 py-3 bg-secondary-700/50 border border-secondary-600/50 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors"
                required
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowSuspendModal(false)}
                className="px-6 py-3 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white rounded-lg hover:from-secondary-500 hover:to-secondary-600 transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmSuspendPartner}
                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-200 cursor-pointer"
              >
                Suspend Partner
              </button>
            </div>
          </div>
        </Modal>

        {/* Activate Partner Modal */}
        <Modal show={showActivateModal} onClose={() => setShowActivateModal(false)}>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-green-400 mb-4">Activate Partner</h2>
            <p className="mb-6 text-secondary-300">
              Are you sure you want to activate partner{" "}
              <span className="font-semibold text-primary-400">
                {partnerToActivate?.name}
              </span>
              ?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowActivateModal(false)}
                className="px-6 py-3 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white rounded-lg hover:from-secondary-500 hover:to-secondary-600 transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmActivatePartner}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-all duration-200 cursor-pointer"
              >
                Activate Partner
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default PartnerManagement;