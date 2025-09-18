import React from 'react';

interface PaymentStatus {
  payment_status: string;
  subscription_level: number;
  can_run_profiling: boolean;
}

interface PaymentStatusCardProps {
  paymentStatus: PaymentStatus | null;
  isLoading: boolean;
  error: unknown;
}

const PaymentStatusCard: React.FC<PaymentStatusCardProps> = ({
  paymentStatus,
  isLoading,
  error
}) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary-500"></div>
          <span className="ml-3">Loading status...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error loading payment status</p>
          <p className="text-sm">{String(error)}</p>
        </div>
      );
    }

    if (!paymentStatus) {
      return (
        <div className="text-gray-500 text-center py-8">
          No payment status found for this client
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
          <span className="font-medium">Payment Status:</span>
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

        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
          <span className="font-medium">Subscription Level:</span>
          <span className="px-3 py-1 bg-secondary-100 text-secondary-800 rounded-full text-sm font-medium">
            Tier {paymentStatus.subscription_level}
          </span>
        </div>

        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
          <span className="font-medium">Can Run Profiling:</span>
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
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <span className="text-2xl mr-2">📊</span>
        Current Payment Status
      </h2>
      {renderContent()}
    </div>
  );
};

export default PaymentStatusCard;
