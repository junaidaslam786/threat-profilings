import React from "react";
import { useParams, Link } from "react-router-dom";
import { useGetPartnerStatsQuery } from "../../Redux/api/partnersApi";
import LoadingSpinner from "../../components/Common/LoadingScreen";
import ErrorMessage from "../../components/Common/ErrorMessage";

const PartnerCodeStatsPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();

  const {
    data: partnerStats,
    error,
    isLoading,
    isFetching,
  } = useGetPartnerStatsQuery(code || "", {
    skip: !code,
  });

  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !partnerStats) {
    const errorMessage =
      (error && "data" in error && typeof error.data === "string" ? error.data : "Partner statistics not found or an error occurred.");
    return (
      <div className="container mx-auto p-4">
        <ErrorMessage message={errorMessage} onClose={() => window.history.back()} />
        <Link to="/partners" className="text-blue-600 hover:underline mt-4 block">
          Back to Partner Codes
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Partner Code Statistics: {partnerStats.code}</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">
              <span className="font-semibold">Code:</span> {partnerStats.code}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Usage Count:</span> {partnerStats.usage_count}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Usage Limit:</span>{" "}
              {partnerStats.usage_limit ?? "No Limit"}
            </p>
          </div>
          <div>
            <p className="text-gray-600">
              <span className="font-semibold">Total Discount Given:</span> $
              {partnerStats.total_discount_given.toFixed(2)}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Commission Earned:</span> $
              {partnerStats.commission_earned.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <Link to={`/partners/${partnerStats.code}`} className="text-blue-600 hover:underline mt-4 block">
        &larr; Back to Partner Code Details
      </Link>
    </div>
  );
};

export default PartnerCodeStatsPage;