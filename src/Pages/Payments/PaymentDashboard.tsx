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
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" data-testid="loading-spinner"></div>
          <p className="text-gray-600">Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (!clientName) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Unable to load user profile. Please try refreshing the page.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-2">📊</span>
              Current Subscription Status
            </h2>

            {statusLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3">Loading status...</span>
              </div>
            ) : statusError ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p>Error loading payment status</p>
                <p className="text-sm">{String(statusError)}</p>
              </div>
            ) : paymentStatus ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">Payment Status:</span>
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

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">Subscription Level:</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Tier {paymentStatus.subscription_level}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">Can Run Profiling:</span>
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
              <div className="text-gray-500 text-center py-8">
                No payment status found for this client
              </div>
            )}
          </div>

          {/* Payment Models Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-2">🏗️</span>
              Payment Models Available
            </h2>

            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-900">PaymentRecord</h3>
                <p className="text-sm text-gray-600">
                  Complete payment information with amounts, status, dates
                </p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                  useGetInvoicesQuery(clientName)
                </code>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-900">
                  PaymentStatusResponse
                </h3>
                <p className="text-sm text-gray-600">
                  Current payment status and subscription level
                </p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                  useGetPaymentStatusQuery(clientName)
                </code>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-900">
                  StripeCheckoutDto
                </h3>
                <p className="text-sm text-gray-600">
                  For creating new payments
                </p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                  useCreateCheckoutSessionMutation()
                </code>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-gray-900">Redux State</h3>
                <p className="text-sm text-gray-600">
                  Payment state management
                </p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                  useSelector(state =&gt; state.payments)
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">📜</span>
            Payment History
          </h2>

          {invoicesLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3">Loading payment history...</span>
            </div>
          ) : invoicesError ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>Error loading payment history</p>
            </div>
          ) : invoices && invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.payment_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice.payment_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(invoice.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.tier || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                        {invoice.payment_type || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">💳</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No payment history found
              </h3>
              <p className="text-gray-600 mb-4">
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

        {/* API Documentation Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">📚</span>
            Available API Endpoints
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">
                Frontend Hooks
              </h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <code className="bg-white px-2 py-1 rounded">
                    useGetPaymentStatusQuery()
                  </code>
                </li>
                <li>
                  <code className="bg-white px-2 py-1 rounded">
                    useGetInvoicesQuery()
                  </code>
                </li>
                <li>
                  <code className="bg-white px-2 py-1 rounded">
                    useCreateCheckoutSessionMutation()
                  </code>
                </li>
                <li>
                  <code className="bg-white px-2 py-1 rounded">
                    useLazyHandlePaymentSuccessQuery()
                  </code>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">
                Backend Endpoints
              </h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <code className="bg-white px-2 py-1 rounded">
                    GET /payments/status/{"{client_name}"}
                  </code>
                </li>
                <li>
                  <code className="bg-white px-2 py-1 rounded">
                    GET /payments/invoices/{"{client_name}"}
                  </code>
                </li>
                <li>
                  <code className="bg-white px-2 py-1 rounded">
                    POST /payments/create-checkout-session
                  </code>
                </li>
                <li>
                  <code className="bg-white px-2 py-1 rounded">
                    GET /payments/success?session_id=xxx
                  </code>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDashboard;
