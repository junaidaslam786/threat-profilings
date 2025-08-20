import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Common/Navbar";

const PaymentDetailsPage: React.FC = () => {
  const navigate = useNavigate();

  // Dummy payment data
  const dummyPayments = [
    {
      id: "pay_1234567890",
      user: "john.doe@example.com",
      organization: "Acme Corp",
      amount: 99.99,
      tier: "L1",
      status: "succeeded",
      date: "2024-01-15",
      method: "card",
    },
    {
      id: "pay_0987654321",
      user: "jane.smith@company.com",
      organization: "Tech Solutions",
      amount: 199.99,
      tier: "L2",
      status: "succeeded",
      date: "2024-01-14",
      method: "card",
    },
    {
      id: "pay_1122334455",
      user: "admin@startup.io",
      organization: "StartupCo",
      amount: 49.99,
      tier: "L1",
      status: "pending",
      date: "2024-01-13",
      method: "bank_transfer",
    },
    {
      id: "pay_5566778899",
      user: "ceo@enterprise.com",
      organization: "Enterprise Ltd",
      amount: 499.99,
      tier: "L3",
      status: "failed",
      date: "2024-01-12",
      method: "card",
    },
  ];

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold border";
    switch (status) {
      case "succeeded":
        return `${baseClasses} bg-green-500/20 text-green-300 border-green-400/30`;
      case "pending":
        return `${baseClasses} bg-yellow-500/20 text-yellow-300 border-yellow-400/30`;
      case "failed":
        return `${baseClasses} bg-red-500/20 text-red-300 border-red-400/30`;
      default:
        return `${baseClasses} bg-secondary-500/20 text-secondary-300 border-secondary-400/30`;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "succeeded":
        return "✓";
      case "pending":
        return "⏳";
      case "failed":
        return "✗";
      default:
        return "?";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent mb-3">
            Payment Details
          </h1>
          <p className="text-secondary-300 text-lg mb-6">
            Monitor all user payments and transaction statuses across the platform
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-secondary-700/50 hover:bg-secondary-600/50 text-white border border-secondary-600/50 hover:border-secondary-500/50 font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              ← Back to Dashboard
            </button>
            <button
              onClick={() => navigate("/tiers")}
              className="bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              📊 Manage Tiers
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-secondary-400 text-sm">Successful</p>
                <p className="text-2xl font-bold text-green-400">2</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-secondary-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">1</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-secondary-400 text-sm">Failed</p>
                <p className="text-2xl font-bold text-red-400">1</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <p className="text-secondary-400 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-primary-400">$749.97</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl border border-secondary-700/50 overflow-hidden">
          <div className="bg-primary-500/10 px-6 py-4 border-b border-secondary-700/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-primary-300">
                All Platform Payments ({dummyPayments.length} transactions)
              </h2>
            </div>
          </div>

          <div className="overflow-x-auto">
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
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-700/50">
                {dummyPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-secondary-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {payment.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-300">
                      {payment.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-300">
                      {payment.organization}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary-300">
                      ${payment.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2 py-1 bg-primary-500/20 text-primary-300 border border-primary-400/30 rounded-full text-xs font-medium">
                        {payment.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={getStatusBadge(payment.status)}>
                        {getStatusIcon(payment.status)} {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-300">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-300 capitalize">
                      {payment.method.replace('_', ' ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsPage;