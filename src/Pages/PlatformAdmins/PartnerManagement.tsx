import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Common/Navbar";
import LoadingScreen from "../../components/Common/LoadingScreen";
import Modal from "../../components/Common/Modal";
import { useGetPartnerAnalyticsQuery } from "../../Redux/api/platformAdminApi";
import type { PartnerPerformance } from "../../Redux/api/platformAdminApi";

const PartnerManagement: React.FC = () => {
  const navigate = useNavigate();

  const {
    data: partnerAnalytics,
    isLoading,
    error,
    refetch,
  } = useGetPartnerAnalyticsQuery();

  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<PartnerPerformance | null>(null);

  const handleViewPartner = (partner: PartnerPerformance) => {
    setSelectedPartner(partner);
    setShowPartnerModal(true);
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-semibold";
    switch (status?.toLowerCase()) {
      case "active":
        return `${baseClasses} bg-green-600 text-white`;
      case "pending":
        return `${baseClasses} bg-yellow-600 text-white`;
      case "suspended":
        return `${baseClasses} bg-red-600 text-white`;
      case "inactive":
        return `${baseClasses} bg-gray-600 text-white`;
      default:
        return `${baseClasses} bg-gray-600 text-white`;
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
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-400 mb-4">
              Error Loading Partner Data
            </h2>
            <p className="text-secondary-300 mb-6">
              Failed to load partner information.
            </p>
            <button
              onClick={() => refetch()}
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-500 hover:to-primary-600 transition-all duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const partners = partnerAnalytics?.partner_performance || [];

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
              Manage and monitor partner relationships and performance
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => refetch()}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-all duration-200 cursor-pointer flex items-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-primary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-secondary-400 text-sm">Total Partners</p>
                <p className="text-2xl font-bold text-primary-400">
                  {partnerAnalytics?.total_partners || partners.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-400"
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
              </div>
              <div>
                <p className="text-secondary-400 text-sm">Active Partners</p>
                <p className="text-2xl font-bold text-green-400">
                  {partnerAnalytics?.active_partners || 
                   partners.filter(p => p.status.toLowerCase() === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary-500/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-secondary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-secondary-400 text-sm">Total Referrals</p>
                <p className="text-2xl font-bold text-secondary-400">
                  {partnerAnalytics?.total_referrals || 
                   partners.reduce((sum, p) => sum + p.total_referrals, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <div>
                <p className="text-secondary-400 text-sm">Total Commission</p>
                <p className="text-2xl font-bold text-yellow-400">
                  $
                  {(partnerAnalytics?.total_commission_earned ||
                    partners.reduce((sum, p) => sum + p.total_commission_earned, 0)).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Partners Table */}
        <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl border border-secondary-700/50 overflow-hidden">
          <div className="bg-primary-500/10 px-6 py-4 border-b border-secondary-700/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-primary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-primary-300">
                Partner Performance ({partners.length} partners)
              </h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            {partners.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-secondary-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-secondary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-secondary-300 mb-2">
                  No partners found
                </h3>
                <p className="text-secondary-400">
                  Partner data will appear here when available.
                </p>
              </div>
            ) : (
              <table className="min-w-full">
                <thead className="bg-secondary-700/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                      Partner Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                      Commission
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-700/50">
                  {partners.map((partner) => (
                    <tr
                      key={partner.partner_code}
                      className="hover:bg-secondary-700/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-white">
                            {partner.partner_code}
                          </div>
                          <div className="text-sm text-secondary-300">
                            {partner.partner_email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(partner.status)}>
                          {partner.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-primary-300">
                            {partner.registered_users} users
                          </span>
                          <span className="text-xs text-secondary-300">
                            {partner.paying_users} paying
                          </span>
                          <span className="text-xs text-green-300">
                            {(partner.conversion_rate * 100).toFixed(1)}% conversion
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-yellow-300">
                        ${partner.total_commission_earned?.toFixed(2) || "0.00"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-300">
                        {new Date(partner.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleViewPartner(partner)}
                          className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded text-xs transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Partner Detail Modal */}
        <Modal
          show={showPartnerModal}
          onClose={() => setShowPartnerModal(false)}
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-primary-400 mb-4">
              Partner Details
            </h2>
            {selectedPartner && (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 mb-1">
                      Partner Code
                    </label>
                    <p className="text-white font-semibold">
                      {selectedPartner.partner_code}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 mb-1">
                      Email
                    </label>
                    <p className="text-secondary-300">
                      {selectedPartner.partner_email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 mb-1">
                      Status
                    </label>
                    <span className={getStatusBadge(selectedPartner.status)}>
                      {selectedPartner.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 mb-1">
                      Joined
                    </label>
                    <p className="text-white">
                      {new Date(selectedPartner.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Usage & Limits */}
                <div className="border-t border-secondary-700 pt-4">
                  <h3 className="text-lg font-semibold text-primary-300 mb-3">Usage & Limits</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-1">
                        Usage Count
                      </label>
                      <p className="text-white font-bold">{selectedPartner.usage_count}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-1">
                        Usage Limit
                      </label>
                      <p className="text-orange-300 font-bold">{selectedPartner.usage_limit}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-1">
                        Remaining Uses
                      </label>
                      <p className="text-green-300 font-bold">
                        {selectedPartner.usage_limit - selectedPartner.usage_count}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Financial Details */}
                <div className="border-t border-secondary-700 pt-4">
                  <h3 className="text-lg font-semibold text-primary-300 mb-3">Financial Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-1">
                        Discount Percent
                      </label>
                      <p className="text-green-300 font-bold">
                        {(selectedPartner.discount_percent * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-1">
                        Commission Percent
                      </label>
                      <p className="text-yellow-300 font-bold">
                        {(selectedPartner.commission_percent * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-1">
                        Total Revenue Generated
                      </label>
                      <p className="text-primary-300 font-bold">
                        ${selectedPartner.total_revenue_generated.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-1">
                        Total Commission Earned
                      </label>
                      <p className="text-yellow-300 font-bold">
                        ${selectedPartner.total_commission_earned.toFixed(2)}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-secondary-300 mb-1">
                        Total Discount Given
                      </label>
                      <p className="text-red-300 font-bold">
                        ${selectedPartner.total_discount_given.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* User Performance */}
                <div className="border-t border-secondary-700 pt-4">
                  <h3 className="text-lg font-semibold text-primary-300 mb-3">User Performance</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-1">
                        Registered Users
                      </label>
                      <p className="text-secondary-300 font-bold">{selectedPartner.registered_users}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-1">
                        Paying Users
                      </label>
                      <p className="text-green-300 font-bold">{selectedPartner.paying_users}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-1">
                        Conversion Rate
                      </label>
                      <p className="text-primary-300 font-bold">
                        {(selectedPartner.conversion_rate * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* User Breakdown */}
                <div className="border-t border-secondary-700 pt-4">
                  <h3 className="text-lg font-semibold text-primary-300 mb-3">User Breakdown</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-1">
                        Standard Users
                      </label>
                      <p className="text-white font-bold">{selectedPartner.user_breakdown.standard_users}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-1">
                        LE Users
                      </label>
                      <p className="text-purple-300 font-bold">{selectedPartner.user_breakdown.le_users}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-1">
                        Active Users
                      </label>
                      <p className="text-green-300 font-bold">{selectedPartner.user_breakdown.active_users}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-1">
                        Suspended Users
                      </label>
                      <p className="text-red-300 font-bold">{selectedPartner.user_breakdown.suspended_users}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Performance */}
                <div className="border-t border-secondary-700 pt-4">
                  <h3 className="text-lg font-semibold text-primary-300 mb-3">Payment Performance</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-1">
                        Total Payments
                      </label>
                      <p className="text-white font-bold">{selectedPartner.payment_breakdown.total_payments}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-1">
                        Successful Payments
                      </label>
                      <p className="text-green-300 font-bold">{selectedPartner.payment_breakdown.successful_payments}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-1">
                        Failed Payments
                      </label>
                      <p className="text-red-300 font-bold">{selectedPartner.payment_breakdown.failed_payments}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-1">
                        Average Payment
                      </label>
                      <p className="text-yellow-300 font-bold">
                        ${selectedPartner.payment_breakdown.average_payment_amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="border-t border-secondary-700 pt-4">
                  <h3 className="text-lg font-semibold text-primary-300 mb-3">Recent Activity</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-1">
                        Recent Registrations
                      </label>
                      <p className="text-secondary-300 font-bold">{selectedPartner.recent_registrations}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-1">
                        Recent Payments
                      </label>
                      <p className="text-green-300 font-bold">{selectedPartner.recent_payments}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowPartnerModal(false)}
                className="px-6 py-3 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white rounded-lg hover:from-secondary-500 hover:to-secondary-600 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default PartnerManagement;
