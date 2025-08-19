import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useValidatePartnerCodeQuery,
  useUpdatePartnerCodeMutation,
} from "../../Redux/api/partnersApi";
import type { UpdatePartnerCodeDto } from "../../Redux/slices/partnersSlice";
import Navbar from "../../components/Common/Navbar";
import LoadingScreen from "../../components/Common/LoadingScreen";
import { toast } from "react-hot-toast";

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

  const [updatePartnerCode, { isLoading: isUpdating }] = useUpdatePartnerCodeMutation();

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
      
      await updatePartnerCode({ code, body: payload }).unwrap();
      toast.success("Partner code updated successfully!");
      navigate("/platform-admins/partner-codes");
    } catch (err) {
      toast.error("Failed to update partner code.");
      console.error("Failed to update partner code:", err);
    }
  };

  if (isFetchingInitial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <LoadingScreen />
        </div>
      </div>
    );
  }

  if (fetchError || !initialPartnerCode) {
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
            <h2 className="text-2xl font-bold text-red-400 mb-4">Partner Code Not Found</h2>
            <p className="text-secondary-300 mb-6">The partner code could not be loaded.</p>
            <button
              onClick={() => navigate("/platform-admins/partner-codes")}
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-500 hover:to-primary-600 transition-all duration-200 cursor-pointer"
            >
              Back to Partner Codes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent mb-3">
              Edit Partner Code
            </h1>
            <p className="text-secondary-300 text-lg">
              Update settings for partner code: <span className="text-primary-400 font-medium">{code}</span>
            </p>
          </div>
          <button
            onClick={() => navigate("/platform-admins/partner-codes")}
            className="px-6 py-3 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white rounded-lg hover:from-secondary-500 hover:to-secondary-600 transition-all duration-200 cursor-pointer"
          >
            Back to Partner Codes
          </button>
        </div>

        <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-8 border border-secondary-700/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Discount Percent */}
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">
                  Discount Percentage
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="discount_percent"
                    value={formData.discount_percent ?? ""}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full px-4 py-3 bg-secondary-700/50 border border-secondary-600/50 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors pr-12"
                    placeholder="Enter discount percentage"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-secondary-400 text-sm">%</span>
                  </div>
                </div>
              </div>

              {/* Commission Percent */}
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">
                  Commission Percentage
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="commission_percent"
                    value={formData.commission_percent ?? ""}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full px-4 py-3 bg-secondary-700/50 border border-secondary-600/50 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors pr-12"
                    placeholder="Enter commission percentage"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-secondary-400 text-sm">%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Partner Email */}
            <div>
              <label className="block text-sm font-medium text-secondary-300 mb-2">
                Partner Email Address
              </label>
              <input
                type="email"
                name="partner_email"
                value={formData.partner_email ?? ""}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-secondary-700/50 border border-secondary-600/50 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors"
                placeholder="Enter partner email address"
              />
            </div>

            {/* Usage Limit */}
            <div>
              <label className="block text-sm font-medium text-secondary-300 mb-2">
                Usage Limit (Optional)
              </label>
              <input
                type="number"
                name="usage_limit"
                value={formData.usage_limit ?? ""}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-3 bg-secondary-700/50 border border-secondary-600/50 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors"
                placeholder="Leave empty for unlimited usage"
              />
              <p className="text-secondary-400 text-sm mt-2">
                Set a maximum number of times this code can be used. Leave empty for unlimited usage.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isUpdating}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isUpdating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Update Partner Code</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate("/platform-admins/partner-codes")}
                className="px-6 py-3 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white rounded-lg hover:from-secondary-500 hover:to-secondary-600 transition-all duration-200 cursor-pointer flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PartnerCodeEditPage;
