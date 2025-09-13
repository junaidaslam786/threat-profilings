// Example: Correct Payment Flow Implementation
// This file demonstrates the proper way to handle Stripe payments

import { useCreateCheckoutSessionMutation, useHandlePaymentSuccessMutation } from "../Redux/api/paymentsApi";
import type { StripeCheckoutDto } from "../Redux/slices/paymentsSlice";

// React Hook for handling Stripe checkout
export const useStripeCheckout = () => {
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();
  
  const handleStripeCheckout = async (paymentData: StripeCheckoutDto) => {
    try {
      const response = await createCheckoutSession(paymentData).unwrap();
      
      if (!response.checkout_url) {
        throw new Error('No checkout URL received');
      }

      // ✅ CORRECT: Redirect to Stripe Checkout - DO NOT call /payments/process
      window.location.href = response.checkout_url;
      
    } catch (error) {
      console.error('Checkout error:', error);
      // Handle error appropriately
    }
  };

  return { handleStripeCheckout };
};

// React Hook for handling payment return
export const usePaymentReturn = () => {
  const [handlePaymentSuccess] = useHandlePaymentSuccessMutation();
  
  const handlePaymentReturn = async (sessionId: string) => {
    try {
      // ✅ CORRECT: Use the success endpoint, not process
      const result = await handlePaymentSuccess(sessionId).unwrap();

      if (result.success) {
        // Payment was successful, redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        // Handle payment failure
        console.error('Payment not completed:', result.message);
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };

  return { handlePaymentReturn };
};

// ❌ WRONG - Don't do this:
/*
const processPayment = async (sessionId: string) => {
  const [processPayment] = useProcessPaymentMutation();
  
  // ❌ This is INCORRECT - passing session ID as payment_method_id
  await processPayment({
    payment_method_id: sessionId, // This is wrong!
    amount: 0,
    client_name: "some_client"
  });
};
*/

// Payment Flow Summary:
// 1. Frontend creates checkout session via POST /payments/create-checkout-session
// 2. Frontend redirects user to Stripe checkout URL
// 3. User completes payment on Stripe
// 4. Stripe redirects back to frontend success page with session_id
// 5. Frontend calls GET /payments/success?session_id=xxx to verify and process payment
// 6. Backend handles the payment completion and updates user status
