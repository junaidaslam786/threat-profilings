import React from 'react';
import Button from '../Common/Button';

interface PaymentDashboardHeaderProps {
  userName?: string;
  userEmail?: string;
  onMakePayment: () => void;
  onBackToDashboard: () => void;
}

const PaymentDashboardHeader: React.FC<PaymentDashboardHeaderProps> = ({
  userName,
  userEmail,
  onMakePayment,
  onBackToDashboard
}) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Payment Dashboard
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Welcome, {userName || userEmail}
          </p>
        </div>
        <div className="flex space-x-4">
          <Button onClick={onMakePayment}>
            💳 Make Payment
          </Button>
          <Button onClick={onBackToDashboard}>
            ← Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDashboardHeader;
