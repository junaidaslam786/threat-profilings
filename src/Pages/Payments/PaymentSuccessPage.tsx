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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Processing Payment</h2>
          <p className="text-gray-300">Please wait while we confirm your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className={`bg-gray-800 rounded-lg p-8 text-center border ${
          paymentResult?.success ? 'border-green-500' : 'border-red-500'
        }`}>
          {/* Success Icon */}
          {paymentResult?.success ? (
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}

          <h2 className={`text-2xl font-bold mb-4 ${
            paymentResult?.success ? 'text-green-400' : 'text-red-400'
          }`}>
            {paymentResult?.success ? 'Payment Successful!' : 'Payment Failed'}
          </h2>

          <p className="text-gray-300 mb-6">
            {paymentResult?.message}
          </p>

          {paymentResult?.success && paymentResult.details && (
            <div className="bg-gray-700 rounded-lg p-4 mb-6 text-left">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">Payment Details</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Payment ID:</span>
                  <span className="font-mono">{paymentResult.details.payment_id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span>${paymentResult.details.total_amount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="capitalize text-green-400">{paymentResult.details.payment_status}</span>
                </div>
                {paymentResult.details.tier && (
                  <div className="flex justify-between">
                    <span>Tier:</span>
                    <span className="font-semibold">{paymentResult.details.tier}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={() => navigate('/dashboard')}
              className="w-full"
            >
              Go to Dashboard
            </Button>
            
            {paymentResult?.success && (
              <Button
                variant="outline"
                onClick={() => navigate('/invoices')}
                className="w-full"
              >
                View Invoice
              </Button>
            )}

            {!paymentResult?.success && (
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="w-full"
              >
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
