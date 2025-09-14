import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Common/Button';

export const PaymentTestPage: React.FC = () => {
  const navigate = useNavigate();

  const testSuccessUrl = () => {
    // Simulate the Stripe success redirect
    const testSessionId = 'cs_test_b10rvThzqEuFQGTbficJAQR4mEWcLIYNgucQ8nbHt9z96DBoFlDxrgk5mA';
    navigate(`/payment/success?session_id=${testSessionId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Payment Integration Test
          </h1>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              This page is for testing the payment flow integration.
            </p>
            
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h3 className="font-semibold text-gray-900">Test Scenarios:</h3>
              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                <li>✓ Session ID extraction from URL</li>
                <li>✓ LocalStorage for session management</li>
                <li>✓ Backend API integration for payment success</li>
                <li>✓ User profile fetching and display</li>
                <li>✓ Subscription plan selection and pricing</li>
              </ul>
            </div>

            <div className="flex space-x-4">
              <Button onClick={testSuccessUrl}>
                Test Success URL Flow
              </Button>
              
              <Button onClick={() => navigate('/payments')}>
                Go to Payment Page
              </Button>
              
              <Button onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTestPage;
