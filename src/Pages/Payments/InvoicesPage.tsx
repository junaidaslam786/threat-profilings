import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetProfileQuery } from "../../Redux/api/userApi";
import { useGetInvoicesQuery } from "../../Redux/api/paymentsApi";
import { Button } from "../../components/Common/Button";
import LoadingSpinner from "../../components/Common/LoadingScreen";
import ErrorMessage from "../../components/Common/ErrorMessage";
import Navbar from "../../components/Common/Navbar";

const InvoicesPage: React.FC = () => {
  const navigate = useNavigate();

  // Get user profile to use as client name
  const { data: userProfile, isLoading: profileLoading } = useGetProfileQuery();
  const clientName = userProfile?.user_info.client_name || "";

  const {
    data: invoices,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetInvoicesQuery(clientName, {
    skip: !clientName, // Skip query if no client name
  });

  if (profileLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!clientName) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorMessage
            message="Unable to load user profile. Please try refreshing the page."
            onClose={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    const errorMessage =
      error && "data" in error && typeof error.data === "string"
        ? error.data
        : "Failed to load invoices.";
    return (
      <div className="container mx-auto p-4">
        <ErrorMessage message={errorMessage} onClose={() => refetch()} />
        <button
          onClick={() => refetch()}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent mb-3">
            Payment Invoices
          </h1>
          <p className="text-secondary-300 text-lg mb-6">
            Complete invoice history and payment records
          </p>
          {userProfile && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-700/50 rounded-full border border-secondary-600/50 mb-6">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-secondary-200 font-medium">
                {userProfile.user_info.name || userProfile.user_info.email}
              </span>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={() => navigate("/payments")}
              className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              💳 Make Payment
            </Button>
            <Button 
              onClick={() => navigate("/payment-dashboard")}
              className="bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              📊 Payment Dashboard
            </Button>
          </div>
        </div>

        {!invoices || invoices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No invoices found
            </h3>
            <p className="text-secondary-300 mb-6">
              You haven't made any payments yet.
            </p>
            <Button 
              onClick={() => navigate("/payments")}
              className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              Make Your First Payment
            </Button>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl border border-secondary-700/50 overflow-hidden">
            {/* Table Header */}
            <div className="bg-primary-500/10 px-6 py-4 border-b border-secondary-700/50">
              <h2 className="text-xl font-bold text-primary-300">
                Invoice History ({invoices.length} records)
              </h2>
            </div>

            {/* Desktop Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-secondary-700/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                      Invoice ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                      Discount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                      Tax
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                      Partner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-700/50">
                  {invoices.map((invoice) => (
                    <tr key={invoice.payment_id} className="hover:bg-secondary-700/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {invoice.payment_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-300">
                        {new Date(invoice.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-300">
                        ${invoice.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-300">
                        ${invoice.discount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-300">
                        ${invoice.tax_amount.toFixed(2)} ({invoice.tax_type})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary-300">
                        ${invoice.total_amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-300">
                        {invoice.partner_code || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            invoice.payment_status === "succeeded"
                              ? "bg-green-500/20 text-green-300 border border-green-400/30"
                              : invoice.payment_status === "pending"
                              ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30"
                              : "bg-red-500/20 text-red-300 border border-red-400/30"
                          }`}
                        >
                          {invoice.payment_status === "succeeded" ? "✓ Paid" : 
                           invoice.payment_status === "pending" ? "⏳ Pending" : 
                           "✗ Failed"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>


          </div>
        )}
      </div>
    </div>
  );
};

export default InvoicesPage;
