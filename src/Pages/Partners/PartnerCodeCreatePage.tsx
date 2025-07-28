import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreatePartnerCodeMutation } from "../../Redux/api/partnersApi";
import type { CreatePartnerCodeDto } from "../../Redux/slices/partnersSlice";
import LoadingSpinner from "../../components/Common/LoadingScreen";
import ErrorMessage from "../../components/Common/ErrorMessage";

const PartnerCodeCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [createPartnerCode, { isLoading, error }] = useCreatePartnerCodeMutation();

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
      alert("Partner code created successfully!");
      navigate("/partners");
    } catch (err) {
      console.error("Failed to create partner code:", err);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-3xl font-bold mb-6">Create New Partner Code</h1>

      {error && <ErrorMessage message="Failed to create partner code. Please check your input." onClose={() => {}} />}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="partner_code" className="block text-gray-700 text-sm font-bold mb-2">
            Partner Code:
          </label>
          <input
            type="text"
            id="partner_code"
            name="partner_code"
            value={formData.partner_code}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="discount_percent" className="block text-gray-700 text-sm font-bold mb-2">
            Discount Percent (%):
          </label>
          <input
            type="number"
            id="discount_percent"
            name="discount_percent"
            value={formData.discount_percent ?? ''}
            onChange={handleChange}
            min="0"
            max="100"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="commission_percent" className="block text-gray-700 text-sm font-bold mb-2">
            Commission Percent (%):
          </label>
          <input
            type="number"
            id="commission_percent"
            name="commission_percent"
            value={formData.commission_percent ?? ''}
            onChange={handleChange}
            min="0"
            max="100"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="partner_email" className="block text-gray-700 text-sm font-bold mb-2">
            Partner Email:
          </label>
          <input
            type="email"
            id="partner_email"
            name="partner_email"
            value={formData.partner_email}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="usage_limit" className="block text-gray-700 text-sm font-bold mb-2">
            Usage Limit (Optional):
          </label>
          <input
            type="number"
            id="usage_limit"
            name="usage_limit"
            value={formData.usage_limit ?? ''}
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
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner /> : "Create Code"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/partners")}
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PartnerCodeCreatePage;

