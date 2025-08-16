import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetProfileQuery } from "../../Redux/api/userApi";
import {
  useGetPaymentStatusQuery,
  useGetInvoicesQuery,
} from "../../Redux/api/paymentsApi";
import { Button } from "../../components/Common/Button";

const PaymentDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Get user profile first
  const { data: userProfile, isLoading: profileLoading } = useGetProfileQuery();
  const clientName = userProfile?.user_info.client_name || "";

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

  if (profileLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" data-testid="loading-spinner"></div>
          <p className="text-gray-300">Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (!clientName) {
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-800 border border-red-600 text-red-300 px-4 py-3 rounded">
            Unable to load user profile. Please try refreshing the page.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Payment Dashboard
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Welcome,{" "}
                {userProfile?.user_info.name || userProfile?.user_info.email}
              </p>
            </div>
            <div className="flex space-x-4">
              <Button onClick={() => navigate("/payments")}>
                💳 Make Payment
              </Button>
              <Button onClick={() => navigate("/dashboard")}>
                ← Back to Dashboard
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div
            onClick={() => navigate("/payments")}
            className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-lg shadow-md cursor-pointer transition-colors"
          >
            <div className="text-2xl mb-2">💳</div>
            <h3 className="font-semibold">New Payment</h3>
            <p className="text-sm opacity-90">Create subscription payment</p>
          </div>

          <div
            onClick={() => navigate("/invoices")}
            className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-lg shadow-md cursor-pointer transition-colors"
          >
            <div className="text-2xl mb-2">📄</div>
            <h3 className="font-semibold">View Invoices</h3>
            <p className="text-sm opacity-90">All payment history</p>
          </div>

          <div
            onClick={() => navigate("/payment-test")}
            className="bg-purple-500 hover:bg-purple-600 text-white p-6 rounded-lg shadow-md cursor-pointer transition-colors"
          >
            <div className="text-2xl mb-2">🧪</div>
            <h3 className="font-semibold">Test Payment</h3>
            <p className="text-sm opacity-90">Development testing</p>
          </div>

          <div
            onClick={() => window.location.reload()}
            className="bg-gray-500 hover:bg-gray-600 text-white p-6 rounded-lg shadow-md cursor-pointer transition-colors"
          >
            <div className="text-2xl mb-2">🔄</div>
            <h3 className="font-semibold">Refresh Data</h3>
            <p className="text-sm opacity-90">Reload payment info</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Status Section */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-blue-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="text-2xl mr-2">📊</span>
              Current Payment Status
            </h2>

            {statusLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-300">Loading status...</span>
              </div>
            ) : statusError ? (
              <div className="bg-red-800 border border-red-600 text-red-300 px-4 py-3 rounded">
                <p>Error loading payment status</p>
                <p className="text-sm">{String(statusError)}</p>
              </div>
            ) : paymentStatus ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                  <span className="font-medium text-gray-300">Payment Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      paymentStatus.payment_status === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {paymentStatus.payment_status === "paid"
                      ? "✅ Paid"
                      : "❌ Unpaid"}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                  <span className="font-medium text-gray-300">Subscription Level:</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Tier {paymentStatus.subscription_level}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                  <span className="font-medium text-gray-300">Can Run Profiling:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      paymentStatus.can_run_profiling
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {paymentStatus.can_run_profiling ? "✅ Yes" : "❌ No"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-center py-8">
                No payment status found for this client
              </div>
            )}
          </div>

          {/* Payment Models Info */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-blue-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="text-2xl mr-2">🏗️</span>
              Payment Models Available
            </h2>

            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-white">PaymentRecord</h3>
                <p className="text-sm text-gray-300">
                  Complete payment information with amounts, status, dates
                </p>
                <code className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                  useGetInvoicesQuery(clientName)
                </code>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-white">
                  PaymentStatusResponse
                </h3>
                <p className="text-sm text-gray-300">
                  Current payment status and subscription level
                </p>
                <code className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                  useGetPaymentStatusQuery(clientName)
                </code>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-white">
                  StripeCheckoutDto
                </h3>
                <p className="text-sm text-gray-300">
                  For creating new payments
                </p>
                <code className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                  useCreateCheckoutSessionMutation()
                </code>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-white">Redux State</h3>
                <p className="text-sm text-gray-300">
                  Payment state management
                </p>
                <code className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                  useSelector(state =&gt; state.payments)
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History Section */}
        <div className="mt-8 bg-gray-800 rounded-lg shadow-md p-6 border border-blue-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="text-2xl mr-2">📜</span>
            Payment History
          </h2>

          {invoicesLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-300">Loading payment history...</span>
            </div>
          ) : invoicesError ? (
            <div className="bg-red-800 border border-red-600 text-red-300 px-4 py-3 rounded">
              <p>Error loading payment history</p>
              <p className="text-sm">{String(invoicesError)}</p>
            </div>
          ) : invoices && invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-600">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Payment ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Tier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-600">
                  {invoices.map((invoice) => (
                    <tr key={invoice.payment_id} className="hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {invoice.payment_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        ${invoice.total_amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            invoice.payment_status === "succeeded"
                              ? "bg-green-100 text-green-800"
                              : invoice.payment_status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {invoice.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(invoice.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {invoice.tier || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">
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
              <h3 className="text-lg font-medium text-white mb-2">
                No payment history found
              </h3>
              <p className="text-gray-300 mb-4">
                You haven't made any payments yet.
              </p>
              <Button onClick={() => navigate("/payments")}>
                Make Your First Payment
              </Button>
            </div>
          )}
        </div>

        {/* API Documentation Section */}
        <div className="mt-8 bg-gray-800 rounded-lg shadow-md p-6 border border-blue-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="text-2xl mr-2">📚</span>
            Available API Endpoints
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold text-white mb-2">
                Frontend Hooks
              </h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <code className="bg-gray-600 text-gray-300 px-2 py-1 rounded">
                    useGetPaymentStatusQuery()
                  </code>
                </li>
                <li>
                  <code className="bg-gray-600 text-gray-300 px-2 py-1 rounded">
                    useGetInvoicesQuery()
                  </code>
                </li>
                <li>
                  <code className="bg-gray-600 text-gray-300 px-2 py-1 rounded">
                    useCreateCheckoutSessionMutation()
                  </code>
                </li>
                <li>
                  <code className="bg-gray-600 text-gray-300 px-2 py-1 rounded">
                    useLazyHandlePaymentSuccessQuery()
                  </code>
                </li>
              </ul>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold text-white mb-2">
                Backend Endpoints
              </h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <code className="bg-gray-600 text-gray-300 px-2 py-1 rounded">
                    GET /payments/status/{"{client_name}"}
                  </code>
                </li>
                <li>
                  <code className="bg-gray-600 text-gray-300 px-2 py-1 rounded">
                    GET /payments/invoices/{"{client_name}"}
                  </code>
                </li>
                <li>
                  <code className="bg-gray-600 text-gray-300 px-2 py-1 rounded">
                    POST /payments/create-checkout-session
                  </code>
                </li>
                <li>
                  <code className="bg-gray-600 text-gray-300 px-2 py-1 rounded">
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
