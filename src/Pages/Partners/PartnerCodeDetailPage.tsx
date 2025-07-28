import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  useValidatePartnerCodeQuery,
  useDeletePartnerCodeMutation,
} from "../../Redux/api/partnersApi";
import LoadingSpinner from "../../components/Common/LoadingScreen";
import ErrorMessage from "../../components/Common/ErrorMessage";

const PartnerCodeDetailPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  const {
    data: partnerCode,
    error,
    isLoading,
    isFetching,
  } = useValidatePartnerCodeQuery(code || "", {
    skip: !code,
  });

  const [deletePartnerCode, { isLoading: isDeleting, error: deleteError, isSuccess: isDeleteSuccess }] =
    useDeletePartnerCodeMutation();

  const handleDelete = async () => {
    if (code && window.confirm(`Are you sure you want to delete partner code "${code}"?`)) {
      try {
        await deletePartnerCode(code).unwrap();
        alert("Partner code deleted successfully!");
        navigate("/partners");
      } catch (err) {
        console.error("Failed to delete partner code:", err);
      }
    }
  };

  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !partnerCode) {
    const errorMessage =
      (error && "data" in error && typeof error.data === "string" ? error.data : "Partner code not found or an error occurred.");
    return (
      <div className="container mx-auto p-4">
        <ErrorMessage message={errorMessage} onClose={() => navigate("/partners")} />
        <Link to="/partners" className="text-blue-600 hover:underline mt-4 block">
          Back to Partner Codes
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Partner Code Details: {partnerCode.partner_code}</h1>

      {deleteError && <ErrorMessage message="Failed to delete partner code." onClose={() => {}} />}
      {isDeleteSuccess && <p className="text-green-600 mb-4">Partner code deleted successfully!</p>}

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">
              <span className="font-semibold">Code:</span> {partnerCode.partner_code}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Discount:</span> {partnerCode.discount_percent}%
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Commission:</span> {partnerCode.commission_percent}%
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Email:</span> {partnerCode.partner_email}
            </p>
          </div>
          <div>
            <p className="text-gray-600">
              <span className="font-semibold">Usage Limit:</span>{" "}
              {partnerCode.usage_limit ?? "No Limit"}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Usage Count:</span> {partnerCode.usage_count}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  partnerCode.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {partnerCode.status}
              </span>
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Created At:</span>{" "}
              {new Date(partnerCode.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Link
          to={`/partners/${partnerCode.partner_code}/edit`}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Edit Code
        </Link>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          disabled={isDeleting}
        >
          {isDeleting ? <LoadingSpinner /> : "Delete Code"}
        </button>
      </div>
      <Link to="/partners" className="text-blue-600 hover:underline mt-6 block">
        &larr; Back to all Partner Codes
      </Link>
    </div>
  );
};

export default PartnerCodeDetailPage;