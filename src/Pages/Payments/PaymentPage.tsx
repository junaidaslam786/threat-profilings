import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useGetProfileQuery } from "../../Redux/api/userApi";
import {
  useLazyHandlePaymentSuccessQuery,
  useCreateCheckoutSessionMutation,
} from "../../Redux/api/paymentsApi";
import { Button } from "../../components/Common/Button";
import LoadingScreen from "../../components/Common/LoadingScreen";

interface SubscriptionPlan {
  tier: string;
  name: string;
  price: number;
  description: string;
  features: string[];
}

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    tier: "L0",
    name: "Basic",
    price: 99.99,
    description: "Perfect for small teams getting started",
    features: [
      "Basic threat assessment",
      "Standard reporting",
      "Email support",
    ],
  },
  {
    tier: "L1",
    name: "Professional",
    price: 199.99,
    description: "For growing organizations",
    features: [
      "Advanced threat profiling",
      "Custom reports",
      "Priority support",
      "API access",
    ],
  },
  {
    tier: "L2",
    name: "Enterprise",
    price: 399.99,
    description: "For large enterprises",
    features: [
      "Full threat analysis",
      "White-label reports",
      "Dedicated support",
      "Custom integrations",
    ],
  },
  {
    tier: "L3",
    name: "Premium",
    price: 799.99,
    description: "Maximum security coverage",
    features: [
      "Complete security suite",
      "Real-time monitoring",
      "24/7 support",
      "Custom development",
    ],
  },
  {
    tier: "LE",
    name: "Large Enterprise",
    price: 1299.99,
    description: "Specialized for Large Enterprise agencies",
    features: [
      "All Premium features",
      "Large Enterprise tools",
      "Compliance reporting",
      "Specialized training",
    ],
  },
];

export const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null
  );
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentProcessed, setPaymentProcessed] = useState(false);

  // API hooks
  const { data: userProfile, isLoading: profileLoading } = useGetProfileQuery();
  const [handlePaymentSuccess, { isLoading: paymentLoading }] =
    useLazyHandlePaymentSuccessQuery();
  const [createCheckoutSession, { isLoading: checkoutLoading }] =
    useCreateCheckoutSessionMutation();

  // Extract session_id from URL and store in cookies
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const sessionIdFromUrl = urlParams.get("session_id");

    if (sessionIdFromUrl) {
      Cookies.set("payment_session_id", sessionIdFromUrl, { expires: 1 });
      setIsProcessingPayment(true);

      // Handle payment success automatically
      handlePaymentSuccess(sessionIdFromUrl)
        .unwrap()
        .then(
          (response: {
            success: boolean;
            message: string;
            session?: object;
          }) => {
            console.log("Payment success response:", response);
            setPaymentProcessed(true);
            setIsProcessingPayment(false);

            // Remove session_id from URL without refreshing
            const newUrl = window.location.pathname;
            window.history.replaceState({}, "", newUrl);
          }
        )
        .catch((error: unknown) => {
          console.error("Payment success handling failed:", error);
          setIsProcessingPayment(false);
        });
    }
  }, [location.search, handlePaymentSuccess]);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
  };

  const handleProceedToPayment = async () => {
    if (!selectedPlan || !userProfile) return;

    try {
      const checkoutData = {
        amount: selectedPlan.price,
        client_name: userProfile.user_info.client_name,
        tier: selectedPlan.tier,
        payment_type: "monthly" as const,
        partner_code: selectedPlan.tier === "LE" ? "LE2024" : "CYBER20",
      };

      const response = await createCheckoutSession(checkoutData).unwrap();

      if (response.checkout_url) {
        // Redirect to Stripe checkout
        window.location.href = response.checkout_url;
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error);
    }
  };

  if (profileLoading) {
    return <LoadingScreen />;
  }

  if (isProcessingPayment || paymentLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Subscription Plan
          </h1>
          {userProfile && (
            <p className="text-lg text-gray-600">
              Welcome,{" "}
              {userProfile.user_info.name || userProfile.user_info.email}
            </p>
          )}
          {paymentProcessed && (
            <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
              ✅ Payment processed successfully! You can now select a new plan
              or manage your subscription.
            </div>
          )}
        </div>

        {/* Subscription Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div
              key={plan.tier}
              className={`bg-white rounded-lg shadow-md border-2 transition-all duration-200 cursor-pointer ${
                selectedPlan?.tier === plan.tier
                  ? "border-blue-500 shadow-lg transform scale-105"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-lg"
              }`}
              onClick={() => handleSelectPlan(plan)}
            >
              <div className="p-6">
                {/* Plan Header */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    ${plan.price}
                  </div>
                  <div className="text-sm text-gray-500">per month</div>
                  <div className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full inline-block mt-2">
                    Tier {plan.tier}
                  </div>
                </div>

                {/* Plan Description */}
                <p className="text-gray-600 text-center mb-4 text-sm">
                  {plan.description}
                </p>

                {/* Features List */}
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <svg
                        className="w-4 h-4 text-green-500 mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Selection Indicator */}
                {selectedPlan?.tier === plan.tier && (
                  <div className="mt-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      ✓ Selected
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Payment Section */}
        {selectedPlan && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Payment Summary
            </h2>

            <div className="border-l-4 border-blue-500 pl-4 mb-6">
              <h3 className="font-semibold text-lg text-gray-900">
                {selectedPlan.name} Plan
              </h3>
              <p className="text-gray-600">{selectedPlan.description}</p>
              <div className="mt-2">
                <span className="text-2xl font-bold text-blue-600">
                  ${selectedPlan.price}
                </span>
                <span className="text-gray-500 ml-1">/month</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleProceedToPayment}
                disabled={checkoutLoading}
                className="flex-1"
              >
                {checkoutLoading
                  ? "Creating Checkout Session..."
                  : `Pay $${selectedPlan.price}`}
              </Button>

              <Button onClick={() => setSelectedPlan(null)} className="flex-1">
                Change Plan
              </Button>
            </div>
          </div>
        )}

        {/* Additional Information */}
        <div className="bg-gray-100 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            Payment Information
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Secure payment processing powered by Stripe</li>
            <li>• Monthly billing cycle</li>
            <li>• Cancel anytime</li>
            <li>• 30-day money-back guarantee</li>
            <li>• Instant access upon successful payment</li>
          </ul>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <Button onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
