import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useProcessPaymentMutation } from "../../Redux/api/paymentsApi";
import Button from "../../components/Common/Button";
import type { PaymentRecord } from "../../Redux/slices/paymentsSlice";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [processPayment] = useProcessPaymentMutation();
  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentResult, setPaymentResult] = useState<{
    success: boolean;
    message: string;
    details?: PaymentRecord;
  } | null>(null);

  const handlePaymentCompletion = useCallback(async (sessionId: string, clientName: string) => {
    try {
      setIsProcessing(true);
      
      // Process the payment with the session ID
      const result = await processPayment({
        payment_method_id: sessionId,
        amount: 0, // Will be determined by backend from session
        client_name: clientName,
      }).unwrap();

      setPaymentResult({
        success: true,
        message: "Payment processed successfully!",
        details: result
      });
    } catch (error: unknown) {
      console.error("Payment processing failed:", error);
      const errorMessage = error && typeof error === 'object' && 'data' in error && 
        error.data && typeof error.data === 'object' && 'message' in error.data && 
        typeof error.data.message === 'string' 
          ? error.data.message 
          : "Payment processing failed";
      
      setPaymentResult({
        success: false,
        message: errorMessage
      });
    } finally {
      setIsProcessing(false);
    }
  }, [processPayment]);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const clientName = searchParams.get("client_name") || "admin";
    
    if (sessionId) {
      handlePaymentCompletion(sessionId, clientName);
    } else {
      setPaymentResult({
        success: false,
        message: "No session ID found in URL parameters"
      });
      setIsProcessing(false);
    }
  }, [searchParams, handlePaymentCompletion]);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-secondary-600 border-t-primary-500 mx-auto mb-6"></div>
          <h2 className="text-3xl font-bold text-white mb-4">Processing Payment</h2>
          <p className="text-secondary-300 text-lg">Please wait while we confirm your payment...</p>
          <div className="mt-6 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <div className={`bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-8 text-center border-2 shadow-2xl ${
          paymentResult?.success ? 'border-green-500/50' : 'border-red-500/50'
        }`}>
          {/* Success Icon */}
          {paymentResult?.success ? (
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 mb-6 shadow-lg">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 mb-6 shadow-lg">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}

          <h1 className={`text-3xl font-bold mb-4 ${
            paymentResult?.success ? 'text-green-400' : 'text-red-400'
          }`}>
            {paymentResult?.success ? '🎉 Payment Successful!' : '❌ Payment Failed'}
          </h1>

          <p className="text-secondary-300 mb-8 text-lg">
            {paymentResult?.success 
              ? 'Thank you for your payment! Your account has been upgraded successfully.' 
              : paymentResult?.message || 'Something went wrong with your payment.'
            }
          </p>

          {paymentResult?.success && paymentResult.details && (
            <div className="bg-secondary-700/50 rounded-xl p-6 mb-8 text-left border border-secondary-600">
              <h3 className="text-xl font-semibold text-primary-300 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Payment Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-3 bg-secondary-800/50 rounded-lg">
                  <span className="text-secondary-300">Payment ID:</span>
                  <span className="font-mono text-white bg-secondary-700 px-2 py-1 rounded text-xs">{paymentResult.details.payment_id}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-secondary-800/50 rounded-lg">
                  <span className="text-secondary-300">Amount:</span>
                  <span className="font-bold text-green-400 text-lg">${paymentResult.details.total_amount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-secondary-800/50 rounded-lg">
                  <span className="text-secondary-300">Status:</span>
                  <span className="capitalize text-green-400 font-semibold flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {paymentResult.details.payment_status}
                  </span>
                </div>
                {paymentResult.details.tier && (
                  <div className="flex justify-between items-center p-3 bg-secondary-800/50 rounded-lg">
                    <span className="text-secondary-300">Tier:</span>
                    <span className="font-semibold text-primary-400 bg-primary-600/20 px-3 py-1 rounded-full">{paymentResult.details.tier}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <Button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg"
            >
              <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h2a2 2 0 012 2v0H8v0z" />
              </svg>
              Go to Dashboard
            </Button>
            
            {paymentResult?.success && (
              <Button
                onClick={() => navigate('/invoices')}
                className="w-full bg-secondary-700 hover:bg-secondary-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 border border-secondary-600"
              >
                <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Invoice
              </Button>
            )}

            {!paymentResult?.success && (
              <Button
                onClick={() => navigate(-1)}
                className="w-full bg-secondary-700 hover:bg-secondary-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 border border-secondary-600"
              >
                <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
