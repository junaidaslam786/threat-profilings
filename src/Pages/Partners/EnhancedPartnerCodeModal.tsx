import { useState } from "react";
import { useCreatePartnerCodeMutation, useUpdatePartnerCodeMutation } from "../../Redux/api/partnersApi";
import Button from "../../components/Common/Button";
import Modal from "../../components/Common/Modal";
import type { CreatePartnerCodeDto, UpdatePartnerCodeDto, PartnerCode } from "../../Redux/slices/partnersSlice";

interface EnhancedPartnerCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  editingPartnerCode?: PartnerCode | null;
}

export default function EnhancedPartnerCodeModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  editingPartnerCode = null 
}: EnhancedPartnerCodeModalProps) {
  const [createPartnerCode, { isLoading: isCreating }] = useCreatePartnerCodeMutation();
  const [updatePartnerCode, { isLoading: isUpdating }] = useUpdatePartnerCodeMutation();
  
  const [fields, setFields] = useState({
    partner_code: editingPartnerCode?.partner_code || "",
    discount_percent: editingPartnerCode?.discount_percent?.toString() || "",
    commission_percent: editingPartnerCode?.commission_percent?.toString() || "",
    partner_email: editingPartnerCode?.partner_email || "",
    usage_limit: editingPartnerCode?.usage_limit?.toString() || "",
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isLoading = isCreating || isUpdating;
  const isEditing = !!editingPartnerCode;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!fields.partner_code || !fields.discount_percent || !fields.commission_percent || !fields.partner_email) {
      setError("Partner code, discount percent, commission percent, and partner email are required.");
      return;
    }

    // Validate percentages
    const discountPercent = parseFloat(fields.discount_percent);
    const commissionPercent = parseFloat(fields.commission_percent);
    
    if (discountPercent < 0 || discountPercent > 100) {
      setError("Discount percent must be between 0 and 100.");
      return;
    }
    
    if (commissionPercent < 0 || commissionPercent > 100) {
      setError("Commission percent must be between 0 and 100.");
      return;
    }

    try {
      if (isEditing && editingPartnerCode) {
        // Update existing partner code
        const updateData: UpdatePartnerCodeDto = {
          discount_percent: discountPercent,
          commission_percent: commissionPercent,
          partner_email: fields.partner_email,
          usage_limit: fields.usage_limit ? parseInt(fields.usage_limit) : undefined,
        };

        await updatePartnerCode({
          code: editingPartnerCode.partner_code,
          body: updateData
        }).unwrap();
        
        setSuccess("Partner code updated successfully!");
      } else {
        // Create new partner code
        const partnerCodeData: CreatePartnerCodeDto = {
          partner_code: fields.partner_code,
          discount_percent: discountPercent,
          commission_percent: commissionPercent,
          partner_email: fields.partner_email,
          usage_limit: fields.usage_limit ? parseInt(fields.usage_limit) : undefined,
        };

        await createPartnerCode(partnerCodeData).unwrap();
        setSuccess("Partner code created successfully!");
      }

      // Reset form
      setFields({
        partner_code: "",
        discount_percent: "",
        commission_percent: "",
        partner_email: "",
        usage_limit: "",
      });
      
      setTimeout(() => {
        onSuccess?.();
        onClose();
        setSuccess("");
      }, 1500);
      
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'data' in err) {
        const errorData = err as { data?: { message?: string } };
        setError(errorData.data?.message || `Failed to ${isEditing ? 'update' : 'create'} partner code`);
      } else {
        setError(`Failed to ${isEditing ? 'update' : 'create'} partner code`);
      }
    }
  };

  const inputClasses = "w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

  return (
    <Modal show={isOpen} onClose={onClose} size="xl">
      <div className="text-white max-h-[80vh] overflow-auto scrollbar-hide">
        <h2 className="text-2xl font-bold text-blue-300 mb-6">
          {isEditing ? "Edit Partner Code" : "Create Partner Code"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-900/20 border border-green-500 text-green-400 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {/* Partner Code */}
          <div>
            <label className={labelClasses}>Partner Code *</label>
            <input
              type="text"
              name="partner_code"
              value={fields.partner_code}
              onChange={handleChange}
              placeholder="PARTNER2024"
              className={inputClasses}
              required
              disabled={isEditing} // Code usually shouldn't be changed
            />
            {isEditing && (
              <p className="text-gray-400 text-sm mt-1">
                Partner code cannot be changed after creation
              </p>
            )}
          </div>

          {/* Partner Email */}
          <div>
            <label className={labelClasses}>Partner Email *</label>
            <input
              type="email"
              name="partner_email"
              value={fields.partner_email}
              onChange={handleChange}
              placeholder="partner@company.com"
              className={inputClasses}
              required
            />
          </div>

          {/* Discount and Commission Percentages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Discount Percent * (0-100)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                name="discount_percent"
                value={fields.discount_percent}
                onChange={handleChange}
                placeholder="10.00"
                className={inputClasses}
                required
              />
            </div>
            
            <div>
              <label className={labelClasses}>Commission Percent * (0-100)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                name="commission_percent"
                value={fields.commission_percent}
                onChange={handleChange}
                placeholder="5.00"
                className={inputClasses}
                required
              />
            </div>
          </div>

          {/* Usage Limit */}
          <div>
            <label className={labelClasses}>Usage Limit</label>
            <input
              type="number"
              min="1"
              name="usage_limit"
              value={fields.usage_limit}
              onChange={handleChange}
              placeholder="Leave empty for unlimited usage"
              className={inputClasses}
            />
            <p className="text-gray-400 text-sm mt-1">
              Maximum number of times this code can be used. Leave empty for unlimited usage.
            </p>
          </div>

          {/* Display current usage if editing */}
          {isEditing && editingPartnerCode && (
            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">Current Usage Statistics</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Times Used:</span>
                  <span className="ml-2 text-white">{editingPartnerCode.usage_count}</span>
                </div>
                <div>
                  <span className="text-gray-400">Status:</span>
                  <span className={`ml-2 ${editingPartnerCode.status === 'active' ? 'text-green-400' : 'text-red-400'}`}>
                    {editingPartnerCode.status}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Created:</span>
                  <span className="ml-2 text-white">
                    {new Date(editingPartnerCode.created_at).toLocaleDateString()}
                  </span>
                </div>
                {editingPartnerCode.usage_limit && (
                  <div>
                    <span className="text-gray-400">Remaining:</span>
                    <span className="ml-2 text-white">
                      {editingPartnerCode.usage_limit - editingPartnerCode.usage_count}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading 
                ? (isEditing ? "Updating..." : "Creating...") 
                : (isEditing ? "Update Partner Code" : "Create Partner Code")
              }
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
