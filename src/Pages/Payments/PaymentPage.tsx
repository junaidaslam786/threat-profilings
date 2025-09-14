import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useGetProfileQuery } from "../../Redux/api/userApi";
import {
  useHandlePaymentSuccessMutation,
  useCreateCheckoutSessionMutation,
} from "../../Redux/api/paymentsApi";
import { useGetTiersQuery } from "../../Redux/api/tiersApi";
import { Button } from "../../components/Common/Button";
import LoadingScreen from "../../components/Common/LoadingScreen";
import Navbar from "../../components/Common/Navbar";
import type { TierConfigDto } from "../../Redux/slices/tiersSlice";

export const PaymentPage: React.FC = () => {
  const location = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<TierConfigDto | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentProcessed, setPaymentProcessed] = useState(false);

  // API hooks
  const { data: userProfile, isLoading: profileLoading } = useGetProfileQuery();
  const { data: tiers, isLoading: tiersLoading } = useGetTiersQuery();
  const [handlePaymentSuccess, { isLoading: paymentLoading }] =
    useHandlePaymentSuccessMutation();
  const [createCheckoutSession, { isLoading: checkoutLoading }] =
    useCreateCheckoutSessionMutation();

  // Extract session_id from URL and store in localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const sessionIdFromUrl = urlParams.get("session_id");

    if (sessionIdFromUrl) {
      localStorage.setItem("payment_session_id", sessionIdFromUrl);
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

  const handleSelectPlan = (plan: TierConfigDto) => {
    setSelectedPlan(plan);
  };

  const getFeaturesList = (tier: TierConfigDto): string[] => {
    const features = [];
    if (tier.max_apps > 0) features.push(`${tier.max_apps} applications`);
    if (tier.max_edits > 0) features.push(`${tier.max_edits} edits/month`);
    if (tier.run_quota > 0) features.push(`${tier.run_quota} runs/month`);
    if (tier.features?.compliance_reports) features.push("Compliance reports");
    if (tier.features?.api_access) features.push("API access");
    if (tier.features?.priority_support) features.push("Priority support");
    if (tier.features?.sso_integration) features.push("SSO integration");
    if (tier.features?.data_export) features.push("Data export");
    return features;
  };

  const handleProceedToPayment = async () => {
    if (!selectedPlan || !userProfile) return;

    try {
      const checkoutData = {
        amount: selectedPlan.price_onetime_registration,
        client_name: userProfile.user_info.client_name,
        tier: selectedPlan.sub_level,
        payment_type: "onetime" as const,
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

  if (profileLoading || tiersLoading) {
    return <LoadingScreen />;
  }

  if (isProcessingPayment || paymentLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent mb-3">
            Choose Your Plan
          </h1>
          <p className="text-secondary-300 text-lg mb-6">
            Select the perfect subscription plan for your security needs
          </p>
          {userProfile && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-700/50 rounded-full border border-secondary-600/50 mb-6">
              <svg
                className="w-5 h-5 text-primary-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="text-secondary-200">
                Welcome,{" "}
                {userProfile.user_info.name || userProfile.user_info.email}
              </span>
            </div>
          )}
          {paymentProcessed && (
            <div className="p-4 bg-green-500/20 border border-green-400/30 rounded-xl mb-6">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-green-300 font-medium">
                  Payment processed successfully! You can now select a new plan
                  or manage your subscription.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Subscription Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {tiers
            ?.filter(
              (tier) => tier.is_active === true || tier.sub_level === "L0"
            )
            .map((tier) => {
              const isPopular = tier.sub_level === "L1";
              const isSelected = selectedPlan?.sub_level === tier.sub_level;
              const currentSubscription =
                userProfile?.subscriptions?.[0]?.subscription_level;
              const isCurrentTier = tier.sub_level === currentSubscription;
              const features = getFeaturesList(tier);
              const discountPercent = tier.features?.discount_percent || 0;

              return (
                <div
                  key={tier.sub_level}
                  className={`group relative bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl border transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/10 ${
                    isCurrentTier
                      ? "border-green-500 shadow-2xl shadow-green-500/10 opacity-75 cursor-not-allowed"
                      : isSelected
                      ? "border-primary-500 shadow-2xl shadow-primary-500/10 scale-105 cursor-pointer"
                      : "border-secondary-700/50 hover:border-primary-500/50 cursor-pointer"
                  } ${isPopular ? "ring-2 ring-primary-400" : ""}`}
                  onClick={() => !isCurrentTier && handleSelectPlan(tier)}
                >
                  {/* Current Tier Badge */}
                  {isCurrentTier && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        ✓ Current Plan
                      </span>
                    </div>
                  )}

                  {/* Popular Badge */}
                  {isPopular && !isCurrentTier && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <span className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        🔥 Most Popular
                      </span>
                    </div>
                  )}

                  {/* Discount Badge */}
                  {discountPercent > 0 && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                        -{discountPercent}%
                      </span>
                    </div>
                  )}

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
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
                      </div>
                    </div>
                  )}

                  <div className="p-6 flex flex-col h-full">
                    {/* Plan Header */}
                    <div className="text-center mb-6">
                      <div
                        className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isSelected
                            ? "bg-gradient-to-br from-primary-500 to-primary-600"
                            : "bg-gradient-to-br from-secondary-600 to-secondary-700 group-hover:from-primary-500/20 group-hover:to-primary-600/20"
                        }`}
                      >
                        <span className="text-xl font-bold text-white">
                          {tier.sub_level}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary-300 transition-colors">
                        {tier.name}
                      </h3>
                      <div className="mb-4">
                        <span className="text-3xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent">
                          ${tier.price_onetime_registration.toFixed(2)}
                        </span>
                        <span className="text-secondary-400 ml-1"> one-time</span>
                      </div>
                      {tier.description && (
                        <p className="text-secondary-300 text-sm leading-relaxed">
                          {tier.description}
                        </p>
                      )}
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 mb-6 flex-grow">
                      {features.slice(0, 6).map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center gap-3"
                        >
                          <div className="w-5 h-5 bg-gradient-to-r from-green-400 to-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <span className="text-secondary-200 text-sm">
                            {feature}
                          </span>
                        </div>
                      ))}
                      {features.length > 6 && (
                        <div className="text-center">
                          <span className="text-primary-400 text-sm font-medium">
                            +{features.length - 6} more features
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Select Button */}
                    <button
                      disabled={isCurrentTier}
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 mt-auto ${
                        isCurrentTier
                          ? "bg-green-500/20 text-green-300 border border-green-400/30 cursor-not-allowed"
                          : isSelected
                          ? "bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg"
                          : "bg-secondary-700/50 text-secondary-300 border border-secondary-600/50 hover:bg-secondary-600/50 hover:border-primary-500/50"
                      }`}
                    >
                      {isCurrentTier
                        ? "✓ Current Plan"
                        : isSelected
                        ? "✓ Selected"
                        : "Select Plan"}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Payment Section */}
        {selectedPlan && (
          <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 mb-8 border border-secondary-700/50">
            <h2 className="text-2xl font-bold text-primary-300 mb-6">
              Payment Summary
            </h2>

            <div className="bg-primary-500/10 rounded-lg p-4 mb-6 border border-primary-400/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {selectedPlan.sub_level}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {selectedPlan.name} Plan
                  </h3>
                  {selectedPlan.description && (
                    <p className="text-primary-200">
                      {selectedPlan.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary-300">One-time Payment</span>
                <div className="text-right">
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent">
                    ${selectedPlan.price_onetime_registration.toFixed(2)}
                  </span>
                  <span className="text-secondary-400 ml-1"> one-time</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleProceedToPayment}
                disabled={checkoutLoading}
                className="flex-1 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
              >
                {checkoutLoading
                  ? "Creating Session..."
                  : `Pay $${selectedPlan.price_onetime_registration.toFixed(2)}`}
              </Button>

              <Button
                onClick={() => setSelectedPlan(null)}
                className="flex-1 bg-secondary-700/50 hover:bg-secondary-600/50 text-white border border-secondary-600/50 hover:border-secondary-500/50 font-semibold py-3 px-6 rounded-lg transition-all duration-200"
              >
                Change Plan
              </Button>
            </div>
          </div>
        )}

        {/* Additional Information */}
        <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50 mb-8">
          <h3 className="text-xl font-semibold text-primary-300 mb-4">
            Payment Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-white mb-2">Secure Payment</h4>
              <ul className="space-y-2 text-sm text-secondary-300">
                <li>• Stripe-powered secure processing</li>
                <li>• 256-bit SSL encryption</li>
                <li>• PCI DSS compliant</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Billing Details</h4>
              <ul className="space-y-2 text-sm text-secondary-300">
                <li>• Monthly billing cycle</li>
                <li>• Cancel anytime</li>
                <li>• 30-day money-back guarantee</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
