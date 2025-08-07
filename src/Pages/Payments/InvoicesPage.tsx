import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetProfileQuery } from "../../Redux/api/userApi";
import { useGetInvoicesQuery } from "../../Redux/api/paymentsApi";
import { Button } from "../../components/Common/Button";
import LoadingSpinner from "../../components/Common/LoadingScreen";
import ErrorMessage from "../../components/Common/ErrorMessage";

const InvoicesPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Get user profile to use as client name
  const { data: userProfile, isLoading: profileLoading } = useGetProfileQuery();
  const clientName = userProfile?.name || userProfile?.email || '';

  const {
    data: invoices,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetInvoicesQuery(clientName, { 
    skip: !clientName // Skip query if no client name
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment Invoices</h1>
              <p className="text-lg text-gray-600 mt-2">
                Invoice history for {userProfile?.name || userProfile?.email}
              </p>
            </div>
            <div className="flex space-x-4">
              <Button onClick={() => navigate('/payments')}>
                💳 Make Payment
              </Button>
              <Button onClick={() => navigate('/payment-dashboard')}>
                📊 Payment Dashboard
              </Button>
              <Button onClick={() => navigate('/dashboard')}>
                ← Back to Dashboard
              </Button>
            </div>
          </div>
        </div>

        {!invoices || invoices.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
            <p className="text-gray-600 mb-4">You haven't made any payments yet.</p>
            <Button onClick={() => navigate('/payments')}>
              Make Your First Payment
            </Button>
          </div>
        ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Invoice ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Original Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Discount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tax
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total Paid
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Partner Code
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.payment_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {invoice.payment_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(invoice.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${invoice.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${invoice.discount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${invoice.tax_amount.toFixed(2)} ({invoice.tax_type})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    ${invoice.total_amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.partner_code || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        invoice.payment_status === "succeeded"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {invoice.payment_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </div>
  );
};

export default InvoicesPage;
