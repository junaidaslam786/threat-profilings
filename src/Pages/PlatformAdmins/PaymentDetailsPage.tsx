import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../components/Common/Navbar";
import LoadingScreen from "../../components/Common/LoadingScreen";
import {
  useGetLEAdminPaymentsQuery,
  useGetStandardAdminPaymentsQuery,
  useGetPaymentAnalyticsQuery,
} from "../../Redux/api/platformAdminApi";
import { toast } from "react-hot-toast";

const PaymentDetailsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // State for filtering and pagination
  const [activeTab, setActiveTab] = useState<"le" | "standard" | "all">(
    (searchParams.get("tab") as "le" | "standard" | "all") || "all"
  );
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get("status") || "");
  const [dateRange, setDateRange] = useState({
    start_date: searchParams.get("start_date") || "",
    end_date: searchParams.get("end_date") || "",
  });

  // API calls
  const {
    data: lePaymentsData,
    isLoading: lePaymentsLoading,
    error: lePaymentsError,
    refetch: refetchLEPayments,
  } = useGetLEAdminPaymentsQuery({
    page,
    limit,
    status: statusFilter || undefined,
    start_date: dateRange.start_date || undefined,
    end_date: dateRange.end_date || undefined,
  });

  const {
    data: standardPaymentsData,
    isLoading: standardPaymentsLoading,
    error: standardPaymentsError,
    refetch: refetchStandardPayments,
  } = useGetStandardAdminPaymentsQuery({
    page,
    limit,
    status: statusFilter || undefined,
    start_date: dateRange.start_date || undefined,
    end_date: dateRange.end_date || undefined,
  });

  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useGetPaymentAnalyticsQuery();

  const isLoading =
    lePaymentsLoading || standardPaymentsLoading || analyticsLoading;
  const hasError = lePaymentsError || standardPaymentsError || analyticsError;

  // Get the appropriate data based on active tab
  const getDisplayData = () => {
    if (activeTab === "le") {
      return lePaymentsData?.payments || [];
    } else if (activeTab === "standard") {
      return standardPaymentsData?.payments || [];
    } else {
      // Combine both datasets for "all" view
      const lePayments = lePaymentsData?.payments || [];
      const standardPayments = standardPaymentsData?.payments || [];
      return [...lePayments, ...standardPayments].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
  };

  const displayData = getDisplayData();

  // Calculate stats from analytics data
  const getStats = () => {
    if (!analyticsData) {
      return {
        successful: 0,
        pending: 0,
        failed: 0,
        totalRevenue: 0,
      };
    }

    const { le_admin_analytics, standard_admin_analytics, comparison } =
      analyticsData;

    // Safely access nested properties with fallback defaults
    const leAnalytics = le_admin_analytics || {};
    const standardAnalytics = standard_admin_analytics || {};

    const leSuccessful =
      leAnalytics.total_payments && leAnalytics.success_rate
        ? Math.round(
            (leAnalytics.total_payments * leAnalytics.success_rate) / 100
          )
        : 0;

    const standardSuccessful =
      standardAnalytics.total_payments && standardAnalytics.success_rate
        ? Math.round(
            (standardAnalytics.total_payments *
              standardAnalytics.success_rate) /
              100
          )
        : 0;

    const leFailed = (leAnalytics.total_payments || 0) - leSuccessful;
    const standardFailed =
      (standardAnalytics.total_payments || 0) - standardSuccessful;

    return {
      successful: leSuccessful + standardSuccessful,
      pending: 0, // Not provided in current analytics structure
      failed: leFailed + standardFailed,
      totalRevenue: comparison?.total_platform_revenue || 0,
    };
  };

  const handleRefresh = () => {
    refetchLEPayments();
    refetchStandardPayments();
    refetchAnalytics();
    toast.success("Payment data refreshed");
  };

  const handleDateRangeChange = (
    field: "start_date" | "end_date",
    value: string
  ) => {
    setDateRange((prev) => ({
      ...prev,
      [field]: value,
    }));
    setPage(1); // Reset to first page when filtering
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold border";
    switch (status) {
      case "succeeded":
      case "completed":
        return `${baseClasses} bg-green-500/20 text-green-300 border-green-400/30`;
      case "pending":
      case "processing":
        return `${baseClasses} bg-yellow-500/20 text-yellow-300 border-yellow-400/30`;
      case "failed":
      case "error":
        return `${baseClasses} bg-red-500/20 text-red-300 border-red-400/30`;
      default:
        return `${baseClasses} bg-secondary-500/20 text-secondary-300 border-secondary-400/30`;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "succeeded":
      case "completed":
        return "✓";
      case "pending":
      case "processing":
        return "⏳";
      case "failed":
      case "error":
        return "✗";
      default:
        return "?";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <LoadingScreen />
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 p-8 rounded-xl border border-red-500/30 text-center max-w-md">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-400 mb-4">
              Error Loading Payment Data
            </h2>
            <p className="text-secondary-300 mb-6">
              Failed to load payment information.
            </p>
            <button
              onClick={handleRefresh}
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-500 hover:to-primary-600 transition-all duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats after loading/error checks
  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent mb-3">
                Payment Details
              </h1>
              <p className="text-secondary-300 text-lg mb-6">
                Monitor all user payments and transaction statuses across the
                platform
              </p>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-secondary-700/50 hover:bg-secondary-600/50 text-white border border-secondary-600/50 hover:border-secondary-500/50 font-semibold py-3 px-6 rounded-lg transition-all duration-200 cursor-pointer"
            >
              ← Back to Dashboard
            </button>
          </div>

          {/* Filters */}
          <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50 mb-6">
            <h3 className="text-lg font-semibold text-primary-300 mb-4">
              Filters & Controls
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Tab Selection */}
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">
                  Payment Type
                </label>
                <select
                  value={activeTab}
                  onChange={(e) =>
                    setActiveTab(e.target.value as "le" | "standard" | "all")
                  }
                  className="w-full px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Payments</option>
                  <option value="le">LE Admin Payments</option>
                  <option value="standard">Standard Admin Payments</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Statuses</option>
                  <option value="succeeded">Succeeded</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={dateRange.start_date}
                  onChange={(e) =>
                    handleDateRangeChange("start_date", e.target.value)
                  }
                  className="w-full px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={dateRange.end_date}
                  onChange={(e) =>
                    handleDateRangeChange("end_date", e.target.value)
                  }
                  className="w-full px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-400"
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
              </div>
              <div>
                <p className="text-secondary-400 text-sm">Successful</p>
                <p className="text-2xl font-bold text-green-400">
                  {stats.successful}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-secondary-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {stats.pending}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-secondary-400 text-sm">Failed</p>
                <p className="text-2xl font-bold text-red-400">
                  {stats.failed}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-primary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <div>
                <p className="text-secondary-400 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-primary-400">
                  ${stats.totalRevenue.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Analytics */}
        {activeTab !== "all" && (
          <div className="mb-8">
            <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50">
              <h3 className="text-lg font-semibold text-primary-300 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                {activeTab === "le" ? "LE Admin" : "Standard Admin"} Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-secondary-700/30 rounded-lg p-4">
                  <p className="text-secondary-400 text-sm">Success Rate</p>
                  <p className="text-xl font-bold text-green-400">
                    {activeTab === "le"
                      ? (lePaymentsData?.summary?.success_rate || 0).toFixed(1)
                      : (
                          standardPaymentsData?.summary?.success_rate || 0
                        ).toFixed(1)}
                    %
                  </p>
                </div>
                <div className="bg-secondary-700/30 rounded-lg p-4">
                  <p className="text-secondary-400 text-sm">Average Payment</p>
                  <p className="text-xl font-bold text-primary-400">
                    $
                    {activeTab === "le"
                      ? (lePaymentsData?.summary?.average_amount || 0).toFixed(
                          2
                        )
                      : (
                          standardPaymentsData?.summary?.average_amount || 0
                        ).toFixed(2)}
                  </p>
                </div>
                <div className="bg-secondary-700/30 rounded-lg p-4">
                  <p className="text-secondary-400 text-sm">Payment Source</p>
                  <p className="text-xl font-bold text-secondary-400">
                    {activeTab === "le"
                      ? lePaymentsData?.partner_analytics?.direct_payments
                          ?.count || 0
                      : standardPaymentsData?.partner_analytics?.direct_payments
                          ?.count || 0}{" "}
                    Direct
                  </p>
                </div>
              </div>

              {/* Tier Breakdown for Standard Admin */}
              {activeTab === "standard" &&
                standardPaymentsData?.summary?.tier_breakdown && (
                  <div className="mt-6">
                    <h4 className="text-md font-medium text-secondary-300 mb-3">
                      Tier Breakdown
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Object.entries(
                        standardPaymentsData.summary.tier_breakdown
                      ).map(([tier, data]) => (
                        <div
                          key={tier}
                          className="bg-secondary-700/30 rounded-lg p-3 border border-secondary-600/50"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-primary-300">
                              {tier}
                            </span>
                            <span className="text-sm text-secondary-400">
                              {data.count} payments
                            </span>
                          </div>
                          <p className="text-lg font-bold text-white">
                            ${data.amount.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Payments Table */}
        <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl border border-secondary-700/50 overflow-hidden">
          <div className="bg-primary-500/10 px-6 py-4 border-b border-secondary-700/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-primary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-primary-300">
                {activeTab === "all"
                  ? "All Platform Payments"
                  : activeTab === "le"
                  ? "LE Admin Payments"
                  : "Standard Admin Payments"}
                ({displayData.length} transactions)
              </h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            {displayData.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-secondary-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-secondary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-secondary-300 mb-2">
                  No payments found
                </h3>
                <p className="text-secondary-400">
                  Try adjusting your filters or check back later.
                </p>
              </div>
            ) : (
              <table className="min-w-full">
                <thead className="bg-secondary-700/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                      Payment ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                      Organization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                      Tier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-300 uppercase tracking-wider">
                      Partner
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-700/50">
                  {displayData.map((payment) => (
                    <tr
                      key={payment.payment_id}
                      className="hover:bg-secondary-700/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {payment.payment_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-300">
                        {payment.user_email || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-300">
                        {payment.le_organization?.organization_name ||
                          payment.organization?.organization_name ||
                          payment.client_name ||
                          "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary-300">
                        $
                        {payment.total_amount
                          ? payment.total_amount.toFixed(2)
                          : "0.00"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {payment.tier && (
                          <span className="px-2 py-1 bg-primary-500/20 text-primary-300 border border-primary-400/30 rounded-full text-xs font-medium">
                            {payment.tier}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={getStatusBadge(
                            payment.payment_status || "unknown"
                          )}
                        >
                          {getStatusIcon(payment.payment_status || "unknown")}{" "}
                          {payment.payment_status || "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-300">
                        {payment.created_at
                          ? new Date(payment.created_at).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-300 capitalize">
                        {payment.payment_type || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-300">
                        {payment.partner_code ? (
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-primary-300">
                              {payment.partner_code}
                            </span>
                            <span className="text-xs text-green-400">
                              -{payment.discount}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-secondary-400">
                            {payment.partner_relationship?.source === "direct"
                              ? "Direct"
                              : "No partner"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {displayData.length > 0 && (
            <div className="bg-secondary-700/30 px-6 py-4 border-t border-secondary-700/50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-secondary-300">
                  Showing {(page - 1) * limit + 1} to{" "}
                  {Math.min(
                    page * limit,
                    activeTab === "all"
                      ? (lePaymentsData?.pagination?.total || 0) +
                          (standardPaymentsData?.pagination?.total || 0)
                      : activeTab === "le"
                      ? lePaymentsData?.pagination?.total || 0
                      : standardPaymentsData?.pagination?.total || 0
                  )}{" "}
                  of{" "}
                  {activeTab === "all"
                    ? (lePaymentsData?.pagination?.total || 0) +
                      (standardPaymentsData?.pagination?.total || 0)
                    : activeTab === "le"
                    ? lePaymentsData?.pagination?.total || 0
                    : standardPaymentsData?.pagination?.total || 0}{" "}
                  results
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={
                      page === 1 ||
                      (activeTab === "le"
                        ? !lePaymentsData?.pagination?.hasPrev
                        : activeTab === "standard"
                        ? !standardPaymentsData?.pagination?.hasPrev
                        : page === 1)
                    }
                    className="px-3 py-1 bg-secondary-600 hover:bg-secondary-500 disabled:bg-secondary-700 disabled:opacity-50 text-white rounded text-sm transition-all duration-200"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded text-sm">
                    Page {page} of{" "}
                    {activeTab === "le"
                      ? lePaymentsData?.pagination?.totalPages || 1
                      : activeTab === "standard"
                      ? standardPaymentsData?.pagination?.totalPages || 1
                      : Math.max(
                          lePaymentsData?.pagination?.totalPages || 1,
                          standardPaymentsData?.pagination?.totalPages || 1
                        )}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={
                      activeTab === "all"
                        ? displayData.length < limit
                        : activeTab === "le"
                        ? !lePaymentsData?.pagination?.hasNext
                        : activeTab === "standard"
                        ? !standardPaymentsData?.pagination?.hasNext
                        : false
                    }
                    className="px-3 py-1 bg-secondary-600 hover:bg-secondary-500 disabled:bg-secondary-700 disabled:opacity-50 text-white rounded text-sm transition-all duration-200"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsPage;
