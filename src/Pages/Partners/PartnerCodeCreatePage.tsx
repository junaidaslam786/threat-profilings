import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreatePartnerCodeMutation } from "../../Redux/api/partnersApi";
import type { CreatePartnerCodeDto } from "../../Redux/slices/partnersSlice";
import Navbar from "../../components/Common/Navbar";
import { toast } from "react-hot-toast";

const PartnerCodeCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [createPartnerCode, { isLoading }] = useCreatePartnerCodeMutation();

  const [formData, setFormData] = useState<CreatePartnerCodeDto>({
    partner_code: "",
    discount_percent: 0,
    commission_percent: 0,
    partner_email: "",
    usage_limit: undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? undefined : parseFloat(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: CreatePartnerCodeDto = {
        ...formData,
        discount_percent: formData.discount_percent || 0,
        commission_percent: formData.commission_percent || 0,
        usage_limit: formData.usage_limit === undefined || isNaN(formData.usage_limit as number) ? undefined : Number(formData.usage_limit),
      };

      await createPartnerCode(payload).unwrap();
      toast.success("Partner code created successfully!");
      navigate("/platform-admins/partner-codes");
    } catch (err) {
      toast.error("Failed to create partner code. Please check your input.");
      console.error("Failed to create partner code:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent mb-3">
              Create Partner Code
            </h1>
            <p className="text-secondary-300 text-lg">
              Set up a new partner discount code with commission tracking
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
            {/* Partner Code */}
            <div>
              <label className="block text-sm font-medium text-secondary-300 mb-2">
                Partner Code *
              </label>
              <input
                type="text"
                name="partner_code"
                value={formData.partner_code}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-secondary-700/50 border border-secondary-600/50 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors"
                placeholder="Enter unique partner code (e.g., PARTNER2024)"
              />
              <p className="text-secondary-400 text-sm mt-2">
                This code will be used by customers to apply the discount.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Discount Percent */}
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">
                  Discount Percentage *
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
                    required
                    className="w-full px-4 py-3 bg-secondary-700/50 border border-secondary-600/50 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors pr-12"
                    placeholder="0.00"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-secondary-400 text-sm">%</span>
                  </div>
                </div>
              </div>

              {/* Commission Percent */}
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">
                  Commission Percentage *
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
                    required
                    className="w-full px-4 py-3 bg-secondary-700/50 border border-secondary-600/50 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors pr-12"
                    placeholder="0.00"
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
                Partner Email Address *
              </label>
              <input
                type="email"
                name="partner_email"
                value={formData.partner_email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-secondary-700/50 border border-secondary-600/50 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors"
                placeholder="partner@example.com"
              />
              <p className="text-secondary-400 text-sm mt-2">
                Email address for commission notifications and reports.
              </p>
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
                Maximum number of times this code can be used. Leave empty for unlimited usage.
              </p>
            </div>

            {/* Preview Card */}
            <div className="bg-secondary-700/30 rounded-lg p-6 border border-secondary-600/30">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>Preview</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-secondary-400 text-sm">Code</div>
                  <div className="text-white font-medium">{formData.partner_code || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-secondary-400 text-sm">Discount</div>
                  <div className="text-green-400 font-medium">{formData.discount_percent || 0}%</div>
                </div>
                <div>
                  <div className="text-secondary-400 text-sm">Commission</div>
                  <div className="text-secondary-400 font-medium">{formData.commission_percent || 0}%</div>
                </div>
                <div>
                  <div className="text-secondary-400 text-sm">Usage Limit</div>
                  <div className="text-white font-medium">{formData.usage_limit || 'Unlimited'}</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Create Partner Code</span>
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

export default PartnerCodeCreatePage;

