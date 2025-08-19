import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetProfileQuery } from "../../Redux/api/userApi";
import {
  useGetPaymentStatusQuery,
  useGetInvoicesQuery,
} from "../../Redux/api/paymentsApi";
import { useGetTiersQuery } from "../../Redux/api/tiersApi";
import { useUser } from "../../hooks/useUser";
import { Button } from "../../components/Common/Button";
import Navbar from "../../components/Common/Navbar";

const PaymentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isPlatformAdmin } = useUser();

  // Get user profile first
  const { data: userProfile, isLoading: profileLoading } = useGetProfileQuery();
  const clientName = userProfile?.user_info.client_name || "";

  // Get available tiers
  const { data: tiers } = useGetTiersQuery();

  // Get payment data
  const {
    data: paymentStatus,
    isLoading: statusLoading,
    error: statusError,
  } = useGetPaymentStatusQuery(clientName, {
    skip: !clientName, // Skip if no client name
  });

  const {
    data: invoices,
    isLoading: invoicesLoading,
    error: invoicesError,
  } = useGetInvoicesQuery(clientName, {
    skip: !clientName,
  });

  // Platform admins don't need payment dashboard
  if (isPlatformAdmin) {
    return (
      <div className="min-h-screen bg-secondary-900">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-primary-600 text-white p-6 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-2">Platform Admin Access</h2>
            <p className="mb-4">
              As a platform administrator, you have full access to all features
              without payment requirements.
            </p>
            <Button
              onClick={() => navigate("/tiers")}
              className="bg-white text-primary-600 hover:bg-gray-100"
            >
              Manage Subscription Tiers
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-secondary-900">
        <Navbar />
        <div className="w-full min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-secondary-300">Loading user profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!clientName) {
    return (
      <div className="min-h-screen bg-secondary-900">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-danger-600 text-white px-4 py-3 rounded">
            Unable to load user profile. Please try refreshing the page.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-900">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary-300">
                Payment Center
              </h1>
              <p className="text-lg text-secondary-300 mt-2">
                Welcome,{" "}
                {userProfile?.user_info.name || userProfile?.user_info.email}
              </p>
            </div>
            <div className="flex space-x-4">
              <Button
                onClick={() => navigate("/payments")}
                className="bg-primary-600 hover:bg-primary-700"
              >
                💳 Subscribe Now
              </Button>
            </div>
          </div>
        </div>

        {/* Available Subscription Tiers */}
        {tiers && tiers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary-300 mb-6">
              Available Subscription Plans
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tiers.map((tier) => (
                <div
                  key={tier.sub_level}
                  className="bg-secondary-800 rounded-lg p-6 border border-primary-600 hover:border-primary-500 transition-colors"
                >
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-primary-300 mb-2">
                      {tier.name}
                    </h3>
                    <div className="text-3xl font-bold text-success-400 mb-4">
                      ${tier.price_monthly}
                      <span className="text-sm text-secondary-400">/month</span>
                    </div>
                    <p className="text-secondary-300 mb-4">
                      {tier.description}
                    </p>
                    <div className="space-y-2 mb-6">
                      <div className="text-sm text-secondary-400">
                        Max Apps:{" "}
                        <span className="text-white">{tier.max_apps}</span>
                      </div>
                      <div className="text-sm text-secondary-400">
                        Max Edits:{" "}
                        <span className="text-white">{tier.max_edits}</span>
                      </div>
                      <div className="text-sm text-secondary-400">
                        Run Quota:{" "}
                        <span className="text-white">{tier.run_quota}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() =>
                        navigate(`/payments?tier=${tier.sub_level}`)
                      }
                      className="w-full bg-primary-600 hover:bg-primary-700"
                    >
                      Select Plan
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Status Section */}
          <div className="bg-secondary-800 rounded-lg shadow-lg p-6 border border-secondary-700">
            <h2 className="text-xl font-bold text-primary-300 mb-4 flex items-center">
              <span className="text-2xl mr-2">📊</span>
              Current Subscription Status
            </h2>

            {statusLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                <span className="ml-3 text-secondary-300">
                  Loading status...
                </span>
              </div>
            ) : statusError ? (
              <div className="bg-danger-600 text-white px-4 py-3 rounded">
                <p>Error loading subscription status</p>
              </div>
            ) : paymentStatus ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-secondary-700 rounded">
                  <span className="font-medium text-secondary-300">
                    Payment Status:
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      paymentStatus.payment_status === "paid"
                        ? "bg-success-600 text-white"
                        : "bg-danger-600 text-white"
                    }`}
                  >
                    {paymentStatus.payment_status === "paid"
                      ? "✅ Active"
                      : "❌ Inactive"}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-secondary-700 rounded">
                  <span className="font-medium text-secondary-300">
                    Subscription Tier:
                  </span>
                  <span className="px-3 py-1 bg-primary-600 text-white rounded-full text-sm font-medium">
                    {tiers?.find(
                      (t) => t.sub_level === paymentStatus.subscription_level
                    )?.name || `Tier ${paymentStatus.subscription_level}`}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-secondary-700 rounded">
                  <span className="font-medium text-secondary-300">
                    Access Status:
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      paymentStatus.can_run_profiling
                        ? "bg-success-600 text-white"
                        : "bg-danger-600 text-white"
                    }`}
                  >
                    {paymentStatus.can_run_profiling
                      ? "✅ Full Access"
                      : "❌ Limited Access"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-secondary-400 text-center py-8">
                <div className="text-4xl mb-2">💳</div>
                <p>No active subscription found</p>
                <Button
                  onClick={() => navigate("/payments")}
                  className="mt-4 bg-primary-600 hover:bg-primary-700"
                >
                  Subscribe Now
                </Button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-secondary-800 rounded-lg shadow-lg p-6 border border-secondary-700">
            <h2 className="text-xl font-bold text-primary-300 mb-4 flex items-center">
              <span className="text-2xl mr-2">⚡</span>
              Quick Actions
            </h2>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/invoices")}
                className="w-full flex items-center justify-between p-4 bg-secondary-700 hover:bg-secondary-600 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📄</span>
                  <div className="text-left">
                    <div className="font-medium text-white">View Invoices</div>
                    <div className="text-sm text-secondary-400">
                      Payment history & receipts
                    </div>
                  </div>
                </div>
                <span className="text-secondary-400">›</span>
              </button>

              <button
                onClick={() => navigate("/tiers")}
                className="w-full flex items-center justify-between p-4 bg-secondary-700 hover:bg-secondary-600 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">⭐</span>
                  <div className="text-left">
                    <div className="font-medium text-white">Browse Plans</div>
                    <div className="text-sm text-secondary-400">
                      Compare subscription tiers
                    </div>
                  </div>
                </div>
                <span className="text-secondary-400">›</span>
              </button>

              <button
                onClick={() => window.location.reload()}
                className="w-full flex items-center justify-between p-4 bg-secondary-700 hover:bg-secondary-600 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🔄</span>
                  <div className="text-left">
                    <div className="font-medium text-white">Refresh Status</div>
                    <div className="text-sm text-secondary-400">
                      Update payment information
                    </div>
                  </div>
                </div>
                <span className="text-secondary-400">›</span>
              </button>
            </div>
          </div>
        </div>

        {/* Payment History Section */}
        <div className="mt-8 bg-secondary-800 rounded-lg shadow-lg p-6 border border-secondary-700">
          <h2 className="text-xl font-bold text-primary-300 mb-4 flex items-center">
            <span className="text-2xl mr-2">📜</span>
            Payment History
          </h2>

          {invoicesLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              <span className="ml-3 text-secondary-300">
                Loading payment history...
              </span>
            </div>
          ) : invoicesError ? (
            <div className="bg-danger-600 text-white px-4 py-3 rounded">
              <p>Error loading payment history</p>
            </div>
          ) : invoices && invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-secondary-700">
                <thead className="bg-secondary-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                      Payment ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                      Subscription Tier
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-secondary-800 divide-y divide-secondary-700">
                  {invoices.map((invoice) => (
                    <tr
                      key={invoice.payment_id}
                      className="hover:bg-secondary-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {invoice.payment_id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-success-400 font-semibold">
                        ${invoice.total_amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            invoice.payment_status === "succeeded"
                              ? "bg-success-600 text-white"
                              : invoice.payment_status === "pending"
                              ? "bg-warning-600 text-white"
                              : "bg-danger-600 text-white"
                          }`}
                        >
                          {invoice.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-300">
                        {new Date(invoice.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-300">
                        {tiers?.find((t) => t.sub_level === invoice.tier)
                          ?.name ||
                          invoice.tier ||
                          "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">💳</div>
              <h3 className="text-lg font-medium text-primary-300 mb-2">
                No payment history found
              </h3>
              <p className="text-secondary-400 mb-4">
                You haven't made any payments yet.
              </p>
              <Button
                onClick={() => navigate("/payments")}
                className="bg-primary-600 hover:bg-primary-700"
              >
                Subscribe Now
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentDashboard;
