import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetProfileQuery } from "../../Redux/api/userApi";
import {
  useGetPaymentStatusQuery,
  useGetInvoicesQuery,
} from "../../Redux/api/paymentsApi";
import { useGetTiersQuery } from "../../Redux/api/tiersApi";
import { useUser } from "../../hooks/useUser";
import { Button } from "../../components/Common/Button";
import LoadingSpinner from "../../components/Common/LoadingScreen";
import Navbar from "../../components/Common/Navbar";
import type { TierConfigDto } from "../../Redux/slices/tiersSlice";

const PaymentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isPlatformAdmin } = useUser();

  // Get user profile first
  const { data: userProfile, isLoading: profileLoading } = useGetProfileQuery();
  const clientName = userProfile?.user_info.client_name || "";

  // Get available tiers
  const { data: tiers } = useGetTiersQuery();

  // Get payment data
  const {
    data: paymentStatus,
    isLoading: statusLoading,
    error: statusError,
  } = useGetPaymentStatusQuery(clientName, {
    skip: !clientName, // Skip if no client name
  });

  const {
    data: invoices,
    isLoading: invoicesLoading,
    error: invoicesError,
  } = useGetInvoicesQuery(clientName, {
    skip: !clientName,
  });

  const getFeaturesList = (tier: TierConfigDto): string[] => {
    const features = [];
    if (tier.max_apps > 0) features.push(`${tier.max_apps} applications`);
    if (tier.max_edits > 0) features.push(`${tier.max_edits} edits/month`);
    if (tier.run_quota > 0) features.push(`${tier.run_quota} runs/month`);
    if (tier.features?.compliance_reports) features.push('Compliance reports');
    if (tier.features?.priority_support) features.push('Priority support');
    if (tier.features?.sso_integration) features.push('SSO integration');
    if (tier.features?.audit_logs) features.push('Audit logs');
    if (tier.features?.data_export) features.push('Data export');
    return features;
  };

  // Platform admins don't need payment dashboard
  if (isPlatformAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-400/30 text-white p-8 rounded-xl text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent">Platform Admin Access</h2>
            <p className="text-secondary-300 mb-6 text-lg">
              As a platform administrator, you have full access to all features without payment requirements.
            </p>
            <Button
              onClick={() => navigate("/tiers")}
              className="bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              Manage Subscription Tiers
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (profileLoading) {
    return <LoadingSpinner />;
  }

  if (!clientName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-red-500/20 border border-red-400/30 text-red-300 px-6 py-4 rounded-xl">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Unable to load user profile. Please try refreshing the page.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent mb-3">
            Payment Dashboard
          </h1>
          <p className="text-secondary-300 text-lg mb-6">
            Manage your subscription and view payment history
          </p>
          {userProfile && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-700/50 rounded-full border border-secondary-600/50 mb-6">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-secondary-200 font-medium">
                {userProfile.user_info.name || userProfile.user_info.email}
              </span>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => navigate("/payments")}
              className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              💳 Subscribe Now
            </Button>
            <Button
              onClick={() => navigate("/invoices")}
              className="bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              📄 View Invoices
            </Button>
          </div>
        </div>

        {/* Available Subscription Tiers */}
        {tiers && tiers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary-300 mb-6">
              Available Subscription Plans
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tiers.filter(tier => tier.is_active === true || tier.sub_level === "L0").map((tier) => {
                const isPopular = tier.sub_level === "L1";
                const currentSubscription = userProfile?.subscriptions?.[0]?.subscription_level;
                const isCurrentTier = tier.sub_level === currentSubscription;
                const features = getFeaturesList(tier);
                const discountPercent = tier.features?.discount_percent || 0;
                
                return (
                  <div
                    key={tier.sub_level}
                    className={`group relative bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl border transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/10 ${
                      isCurrentTier
                        ? "border-green-500 shadow-2xl shadow-green-500/10"
                        : "border-secondary-700/50 hover:border-primary-500/50"
                    } ${isPopular ? "ring-2 ring-primary-400" : ""}`}
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

                    <div className="p-6 flex flex-col h-full">
                      {/* Plan Header */}
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-secondary-600 to-secondary-700 group-hover:from-primary-500/20 group-hover:to-primary-600/20 rounded-full flex items-center justify-center transition-all duration-300">
                          <span className="text-xl font-bold text-white">{tier.sub_level}</span>
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
                        {tier.features?.max_users && (
                          <p className="text-primary-400 text-sm font-medium mt-2">
                            Up to {tier.features.max_users} users
                          </p>
                        )}
                      </div>

                      {/* Features List */}
                      <div className="space-y-3 mb-6 flex-grow">
                        {features.slice(0, 4).map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-3">
                            <div className="w-5 h-5 bg-gradient-to-r from-green-400 to-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-secondary-200 text-sm">{feature}</span>
                          </div>
                        ))}
                        {features.length > 4 && (
                          <div className="text-center">
                            <span className="text-primary-400 text-sm font-medium">+{features.length - 4} more features</span>
                          </div>
                        )}
                      </div>

                      {/* Select Button */}
                      <Button
                        onClick={() => navigate(`/payments?tier=${tier.sub_level}`)}
                        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 mt-auto ${
                          isCurrentTier
                            ? "bg-green-500/20 text-green-300 border border-green-400/30 cursor-not-allowed"
                            : "bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white"
                        }`}
                        disabled={isCurrentTier}
                      >
                        {isCurrentTier ? "✓ Current Plan" : "Select Plan"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Status Section */}
          <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">
                Current Subscription Status
              </h2>
            </div>

            {statusLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                <span className="ml-3 text-secondary-300">Loading status...</span>
              </div>
            ) : statusError ? (
              <div className="bg-red-500/20 border border-red-400/30 text-red-300 px-4 py-3 rounded-lg">
                <p>Error loading payment status</p>
                <p className="text-sm text-red-400">{String(statusError)}</p>
              </div>
            ) : paymentStatus ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-secondary-700/30 rounded-lg border border-secondary-600/30">
                  <span className="font-medium text-secondary-300">Payment Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${
                      paymentStatus.payment_status === "paid"
                        ? "bg-green-500/20 text-green-300 border-green-400/30"
                        : "bg-red-500/20 text-red-300 border-red-400/30"
                    }`}
                  >
                    {paymentStatus.payment_status === "paid"
                      ? "✅ Active"
                      : "❌ Inactive"}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-secondary-700/30 rounded-lg border border-secondary-600/30">
                  <span className="font-medium text-secondary-300">Subscription Level:</span>
                  <span className="px-3 py-1 bg-primary-500/20 text-primary-300 border border-primary-400/30 rounded-full text-sm font-medium">
                    Tier {paymentStatus.subscription_level}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-secondary-700/30 rounded-lg border border-secondary-600/30">
                  <span className="font-medium text-secondary-300">Can Run Profiling:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${
                      paymentStatus.can_run_profiling
                        ? "bg-green-500/20 text-green-300 border-green-400/30"
                        : "bg-red-500/20 text-red-300 border-red-400/30"
                    }`}
                  >
                    {paymentStatus.can_run_profiling
                      ? "✅ Full Access"
                      : "❌ Limited Access"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-secondary-400 text-center py-8">
                <div className="w-16 h-16 bg-secondary-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                No payment status found for this client
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">
                Quick Actions
              </h2>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => navigate("/payments")}
                className="w-full p-4 bg-gradient-to-r from-green-600/20 to-green-700/20 rounded-lg hover:from-green-500/30 hover:to-green-600/30 transition-all duration-200 border border-green-500/30 hover:border-green-400/50 group text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-400 group-hover:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <div>
                      <div className="text-white font-medium">Subscribe to Plan</div>
                      <div className="text-green-300 text-sm">Choose your subscription tier</div>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-secondary-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              <button
                onClick={() => navigate("/invoices")}
                className="w-full p-4 bg-gradient-to-r from-blue-600/20 to-blue-700/20 rounded-lg hover:from-blue-500/30 hover:to-blue-600/30 transition-all duration-200 border border-blue-500/30 hover:border-blue-400/50 group text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-blue-400 group-hover:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <div className="text-white font-medium">View Invoices</div>
                      <div className="text-blue-300 text-sm">Payment history & receipts</div>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-secondary-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className="w-full p-4 bg-gradient-to-r from-purple-600/20 to-purple-700/20 rounded-lg hover:from-purple-500/30 hover:to-purple-600/30 transition-all duration-200 border border-purple-500/30 hover:border-purple-400/50 group text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-purple-400 group-hover:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    </svg>
                    <div>
                      <div className="text-white font-medium">Main Dashboard</div>
                      <div className="text-purple-300 text-sm">Return to main application</div>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-secondary-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Payment History Section */}
        <div className="mt-8 bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl border border-secondary-700/50 overflow-hidden">
          <div className="bg-primary-500/10 px-6 py-4 border-b border-secondary-700/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-primary-300">
                Recent Payment History
              </h2>
            </div>
          </div>

          <div className="p-6">
            {invoicesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                <span className="ml-3 text-secondary-300">Loading payment history...</span>
              </div>
            ) : invoicesError ? (
              <div className="bg-red-500/20 border border-red-400/30 text-red-300 px-4 py-3 rounded-lg">
                <p>Error loading payment history</p>
              </div>
            ) : invoices && invoices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-secondary-700/30">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                        Payment ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                        Tier
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary-700/50">
                    {invoices.slice(0, 5).map((invoice) => (
                      <tr key={invoice.payment_id} className="hover:bg-secondary-700/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {invoice.payment_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary-300">
                          ${invoice.total_amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                              invoice.payment_status === "succeeded"
                                ? "bg-green-500/20 text-green-300 border-green-400/30"
                                : invoice.payment_status === "pending"
                                ? "bg-yellow-500/20 text-yellow-300 border-yellow-400/30"
                                : "bg-red-500/20 text-red-300 border-red-400/30"
                            }`}
                          >
                            {invoice.payment_status === "succeeded" ? "✓ Paid" : 
                             invoice.payment_status === "pending" ? "⏳ Pending" : 
                             "✗ Failed"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-300">
                          {new Date(invoice.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-300">
                          {invoice.tier || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {invoices.length > 5 && (
                  <div className="mt-4 text-center">
                    <Button
                      onClick={() => navigate("/invoices")}
                      className="bg-secondary-700/50 hover:bg-secondary-600/50 text-white border border-secondary-600/50 hover:border-secondary-500/50 font-medium py-2 px-4 rounded-lg transition-all duration-200"
                    >
                      View All {invoices.length} Invoices
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-secondary-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  No payment history found
                </h3>
                <p className="text-secondary-300 mb-4">
                  You haven't made any payments yet.
                </p>
                <Button
                  onClick={() => navigate("/payments")}
                  className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                >
                  Subscribe Now
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDashboard;