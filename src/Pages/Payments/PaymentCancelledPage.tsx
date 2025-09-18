import { useNavigate } from "react-router-dom";
import Button from "../../components/Common/Button";

export default function PaymentCancelledPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 rounded-lg p-8 text-center border border-yellow-500">
          {/* Warning Icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-yellow-400 mb-4">
            Payment Cancelled
          </h2>

          <p className="text-gray-300 mb-6">
            Your payment was cancelled. Don't worry, no charges were made to your account.
          </p>

          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-secondary-300 mb-2">What's Next?</h3>
            <ul className="text-sm text-gray-300 text-left space-y-2">
              <li>• You can try the payment again</li>
              <li>• Your cart/session has been preserved</li>
              <li>• Contact support if you need assistance</li>
              <li>• No charges were applied to your account</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => navigate(-1)}
              className="w-full"
            >
              Try Payment Again
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="w-full"
            >
              Go to Dashboard
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate('/support')}
              className="w-full"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
