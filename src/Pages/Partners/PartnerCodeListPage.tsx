import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllPartnerCodesQuery } from "../../Redux/api/partnersApi";
import Navbar from "../../components/Common/Navbar";
import LoadingScreen from "../../components/Common/LoadingScreen";
import Sidebar from "../../components/Common/Sidebar";
import PartnerCodeDetailSidebar from "../../components/Partners/PartnerCodeDetailSidebar";

interface PartnerCode {
  partner_code: string;
  discount_percent: number;
  commission_percent: number;
  partner_email: string;
  usage_limit?: number;
  usage_count: number;
  status: 'active' | 'inactive';
  created_at: string;
}

const PartnerCodeListPage: React.FC = () => {
  const { data: partnerCodes, error, isLoading, refetch } = useGetAllPartnerCodesQuery();
  const navigate = useNavigate();
  const [selectedCode, setSelectedCode] = useState<PartnerCode | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const handleViewCode = (code: PartnerCode) => {
    setSelectedCode(code);
    setShowSidebar(true);
  };

  const handleCloseSidebar = () => {
    setShowSidebar(false);
    setSelectedCode(null);
  };

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
      : 'bg-red-500/20 text-red-400 border border-red-500/30';
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 p-8 rounded-xl border border-red-500/30 text-center max-w-md">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-400 mb-4">Error Loading Partner Codes</h2>
            <p className="text-secondary-300 mb-6">Failed to load partner codes.</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => refetch()}
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-500 hover:to-primary-600 transition-all duration-200 cursor-pointer"
              >
                Retry
              </button>
              <button
                onClick={() => navigate("/platform-admins")}
                className="px-6 py-3 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white rounded-lg hover:from-secondary-500 hover:to-secondary-600 transition-all duration-200 cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent mb-3">
              Partner Codes
            </h1>
            <p className="text-secondary-300 text-lg">
              Manage partner discount codes, commissions, and usage tracking
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/platform-admins/partner-codes/create")}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-all duration-200 cursor-pointer flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Create New Code</span>
            </button>
            <button
              onClick={() => refetch()}
              className="px-6 py-3 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white rounded-lg hover:from-secondary-500 hover:to-secondary-600 transition-all duration-200 cursor-pointer flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>

            <button
              onClick={() => navigate("/platform-admins")}
              className="px-6 py-3 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white rounded-lg hover:from-secondary-500 hover:to-secondary-600 transition-all duration-200 cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-8 border border-secondary-700/50">
          {!partnerCodes || partnerCodes.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-secondary-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <p className="text-secondary-400 text-lg mb-4">No partner codes found.</p>
              <button
                onClick={() => navigate("/platform-admins/partner-codes/create")}
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-500 hover:to-primary-600 transition-all duration-200 cursor-pointer"
              >
                Create Your First Code
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-secondary-700/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-300 uppercase tracking-wider">
                      Partner Code
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-300 uppercase tracking-wider">
                      Partner Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-300 uppercase tracking-wider">
                      Discount
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-300 uppercase tracking-wider">
                      Commission
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-300 uppercase tracking-wider">
                      Usage
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {partnerCodes.map((code: PartnerCode, index) => (
                    <tr key={code.partner_code} className={`border-b border-secondary-700/30 hover:bg-secondary-700/20 transition-colors ${index % 2 === 0 ? 'bg-secondary-800/30' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {code.partner_code.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-white font-medium">{code.partner_code}</div>
                            <div className="text-secondary-400 text-sm">
                              Created {new Date(code.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {code.partner_email}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                          {code.discount_percent}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary-500/20 text-secondary-400 border border-secondary-500/30">
                          {code.commission_percent}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-secondary-300">
                        {code.usage_count} / {code.usage_limit ?? '∞'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(code.status)}`}>
                          {code.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewCode(code)}
                            className="px-3 py-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-500 hover:to-primary-600 transition-all duration-200 cursor-pointer text-sm"
                          >
                            View
                          </button>
                          <button
                            onClick={() => navigate(`/platform-admins/partner-codes/${code.partner_code}/edit`)}
                            className="px-3 py-1 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 cursor-pointer text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => navigate(`/platform-admins/partner-codes/${code.partner_code}/stats`)}
                            className="px-3 py-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-500 hover:to-purple-600 transition-all duration-200 cursor-pointer text-sm"
                          >
                            Stats
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Partner Code Detail Sidebar */}
      <Sidebar isOpen={showSidebar} onClose={handleCloseSidebar} title="Partner Code Details">
        {selectedCode && (
          <PartnerCodeDetailSidebar 
            partnerCode={selectedCode} 
            onClose={handleCloseSidebar}
            onEdit={() => {
              navigate(`/platform-admins/partner-codes/${selectedCode.partner_code}/edit`);
              handleCloseSidebar();
            }}
            onStats={() => {
              navigate(`/platform-admins/partner-codes/${selectedCode.partner_code}/stats`);
              handleCloseSidebar();
            }}
          />
        )}
      </Sidebar>
    </div>
  );
};

export default PartnerCodeListPage;