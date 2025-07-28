import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useValidatePartnerCodeQuery,
  useUpdatePartnerCodeMutation,
} from "../../Redux/api/partnersApi";
import type { UpdatePartnerCodeDto } from "../../Redux/slices/partnersSlice";
import LoadingSpinner from "../../components/Common/LoadingScreen";
import ErrorMessage from "../../components/Common/ErrorMessage";

const PartnerCodeEditPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  const {
    data: initialPartnerCode,
    isLoading: isFetchingInitial,
    error: fetchError,
  } = useValidatePartnerCodeQuery(code || "", {
    skip: !code,
  });

  const [updatePartnerCode, { isLoading: isUpdating, error: updateError }] =
    useUpdatePartnerCodeMutation();

  const [formData, setFormData] = useState<UpdatePartnerCodeDto>({
    discount_percent: undefined,
    commission_percent: undefined,
    partner_email: undefined,
    usage_limit: undefined,
  });

  useEffect(() => {
    if (initialPartnerCode) {
      setFormData({
        discount_percent: initialPartnerCode.discount_percent,
        commission_percent: initialPartnerCode.commission_percent,
        partner_email: initialPartnerCode.partner_email,
        usage_limit: initialPartnerCode.usage_limit,
      });
    }
  }, [initialPartnerCode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? value === ""
            ? undefined
            : parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    try {
      const payload: UpdatePartnerCodeDto = Object.fromEntries(
        Object.entries(formData).filter(([, value]) => value !== undefined)
      );
      if (
        "discount_percent" in payload &&
        (payload.discount_percent === undefined ||
          isNaN(payload.discount_percent))
      ) {
        payload.discount_percent = undefined;
      }
      if (
        "commission_percent" in payload &&
        (payload.commission_percent === undefined ||
          isNaN(payload.commission_percent))
      ) {
        payload.commission_percent = undefined;
      }
      if (
        "usage_limit" in payload &&
        (payload.usage_limit === undefined || isNaN(payload.usage_limit))
      ) {
        payload.usage_limit = undefined;
      }

      await updatePartnerCode({ code, body: payload }).unwrap();
      alert("Partner code updated successfully!");
      navigate(`/partners/${code}`);
    } catch (err) {
      console.error("Failed to update partner code:", err);
    }
  };

  if (isFetchingInitial) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (fetchError || !initialPartnerCode) {
    const errorMessage =
      fetchError && "data" in fetchError && typeof fetchError.data === "string"
        ? fetchError.data
        : "Partner code not found or an error occurred.";
    return (
      <div className="container mx-auto p-4">
        <ErrorMessage message={errorMessage} onClose={() => navigate(-1)} />
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-600 hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-3xl font-bold mb-6">Edit Partner Code: {code}</h1>

      {updateError && (
        <ErrorMessage
          message="Failed to update partner code."
          onClose={() => window.location.reload()}
        />
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label
            htmlFor="discount_percent"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Discount Percent (%):
          </label>
          <input
            type="number"
            id="discount_percent"
            name="discount_percent"
            value={formData.discount_percent ?? ""}
            onChange={handleChange}
            min="0"
            max="100"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="commission_percent"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Commission Percent (%):
          </label>
          <input
            type="number"
            id="commission_percent"
            name="commission_percent"
            value={formData.commission_percent ?? ""}
            onChange={handleChange}
            min="0"
            max="100"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="partner_email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Partner Email:
          </label>
          <input
            type="email"
            id="partner_email"
            name="partner_email"
            value={formData.partner_email ?? ""}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="usage_limit"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Usage Limit (Optional):
          </label>
          <input
            type="number"
            id="usage_limit"
            name="usage_limit"
            value={formData.usage_limit ?? ""}
            onChange={handleChange}
            min="1"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="No limit if empty"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={isUpdating}
          >
            {isUpdating ? <LoadingSpinner /> : "Update Code"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/partners/${code}`)}
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PartnerCodeEditPage;
