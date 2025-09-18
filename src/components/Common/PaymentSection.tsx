import Button from "./Button";
import { useCreateCheckoutSessionMutation } from "../../Redux/api/paymentsApi";
import type { StripeCheckoutDto } from "../../Redux/slices/paymentsSlice";

interface PaymentData {
  amount: number;
  client_name: string;
  tier: string;
  payment_type: "registration" | "monthly" | "upgrade";
  partner_code?: string;
}

interface PaymentSectionProps {
  paymentData: PaymentData;
  title: string;
  description?: string;
  onPaymentSuccess?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function PaymentSection({
  paymentData,
  title,
  description,
  onPaymentSuccess,
  disabled = false,
  className = "",
}: PaymentSectionProps) {
  const [createCheckoutSession, { isLoading: isCreatingSession }] =
    useCreateCheckoutSessionMutation();

  const handlePayment = async () => {
    try {
      const checkoutData: StripeCheckoutDto = {
        ...paymentData,
      };

      const response = await createCheckoutSession(checkoutData).unwrap();
      
      // Redirect to Stripe checkout
      if (response.checkout_url) {
        window.location.href = response.checkout_url;
      }
      
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }
    } catch (error) {
      console.error("Payment failed:", error);
      // You might want to show an error message to the user
    }
  };

  return (
    <div className={`bg-gray-800 border border-secondary-900 rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-secondary-300 mb-4">{title}</h3>
      
      {description && (
        <p className="text-gray-300 mb-4">{description}</p>
      )}
      
      {/* Payment Details Display */}
      <div className="space-y-3 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-gray-400 text-sm">Amount:</span>
            <p className="text-white font-medium">${paymentData.amount.toFixed(2)}</p>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Client:</span>
            <p className="text-white font-medium">{paymentData.client_name}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-gray-400 text-sm">Tier:</span>
            <p className="text-white font-medium">{paymentData.tier}</p>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Payment Type:</span>
            <p className="text-white font-medium capitalize">{paymentData.payment_type}</p>
          </div>
        </div>
        
        {paymentData.partner_code && (
          <div>
            <span className="text-gray-400 text-sm">Partner Code:</span>
            <p className="text-white font-medium">{paymentData.partner_code}</p>
          </div>
        )}
      </div>

      <Button
        type="button"
        onClick={handlePayment}
        disabled={disabled || isCreatingSession}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600"
      >
        {isCreatingSession ? "Processing..." : "Pay Now"}
      </Button>
    </div>
  );
}
