import { useState } from "react";
import { useCreateSubscriptionMutation, useUpdateSubscriptionMutation } from "../../Redux/api/subscriptionsApi";
import Button from "../../components/Common/Button";
import Modal from "../../components/Common/Modal";
import type { 
  CreateSubscriptionDto, 
  UpdateSubscriptionDto, 
  ClientSubscriptionDto, 
  SubscriptionLevel,
  CustomLimits,
  BillingInfo 
} from "../../Redux/slices/subscriptionsSlice";

interface EnhancedSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  editingSubscription?: ClientSubscriptionDto | null;
  clientName?: string;
}

export default function EnhancedSubscriptionModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  editingSubscription = null,
  clientName = ""
}: EnhancedSubscriptionModalProps) {
  const [createSubscription, { isLoading: isCreating }] = useCreateSubscriptionMutation();
  const [updateSubscription, { isLoading: isUpdating }] = useUpdateSubscriptionMutation();
  
  const [fields, setFields] = useState({
    client_name: editingSubscription?.client_name || clientName,
    subscription_level: editingSubscription?.subscription_level || "L0" as SubscriptionLevel,
    payment_method: "credit_card",
    partner_code: "",
    auto_renewal: true,
    grace_period_days: "7",
    custom_limits: {
      max_edits: "",
      max_apps: "",
      run_quota: "",
      max_users: "",
    },
    billing_info: {
      company_name: "",
      billing_email: "",
      tax_id: "",
      street: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
    },
    // Update fields
    payment_status: editingSubscription?.payment_status || "unpaid",
    suspension_reason: "",
    is_suspended: false,
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isLoading = isCreating || isUpdating;
  const isEditing = !!editingSubscription;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('custom_limits.')) {
      const field = name.split('.')[1];
      setFields(prev => ({
        ...prev,
        custom_limits: {
          ...prev.custom_limits,
          [field]: value
        }
      }));
    } else if (name.startsWith('billing_info.')) {
      const field = name.split('.')[1];
      setFields(prev => ({
        ...prev,
        billing_info: {
          ...prev.billing_info,
          [field]: value
        }
      }));
    } else if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFields(prev => ({ ...prev, [name]: checked }));
    } else {
      setFields(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!fields.client_name || !fields.subscription_level) {
      setError("Client name and subscription level are required.");
      return;
    }

    try {
      // Prepare custom limits
      const customLimits: CustomLimits = {};
      if (fields.custom_limits.max_edits) customLimits.max_edits = parseInt(fields.custom_limits.max_edits);
      if (fields.custom_limits.max_apps) customLimits.max_apps = parseInt(fields.custom_limits.max_apps);
      if (fields.custom_limits.run_quota) customLimits.run_quota = parseInt(fields.custom_limits.run_quota);
      if (fields.custom_limits.max_users) customLimits.max_users = parseInt(fields.custom_limits.max_users);

      // Prepare billing info
      const billingInfo: BillingInfo = {};
      if (fields.billing_info.company_name) billingInfo.company_name = fields.billing_info.company_name;
      if (fields.billing_info.billing_email) billingInfo.billing_email = fields.billing_info.billing_email;
      if (fields.billing_info.tax_id) billingInfo.tax_id = fields.billing_info.tax_id;
      
      if (fields.billing_info.street || fields.billing_info.city || fields.billing_info.state || 
          fields.billing_info.country || fields.billing_info.postal_code) {
        billingInfo.billing_address = {
          street: fields.billing_info.street || undefined,
          city: fields.billing_info.city || undefined,
          state: fields.billing_info.state || undefined,
          country: fields.billing_info.country || undefined,
          postal_code: fields.billing_info.postal_code || undefined,
        };
      }

      if (isEditing && editingSubscription) {
        // Update existing subscription
        const updateData: UpdateSubscriptionDto = {
          subscription_level: fields.subscription_level,
          payment_status: fields.payment_status as "paid" | "unpaid" | "overdue" | "cancelled" | "pending",
          auto_renewal: fields.auto_renewal,
          grace_period_days: parseInt(fields.grace_period_days),
          custom_limits: Object.keys(customLimits).length > 0 ? customLimits : undefined,
          suspension_reason: fields.suspension_reason || undefined,
          is_suspended: fields.is_suspended,
        };

        await updateSubscription({
          clientName: editingSubscription.client_name,
          body: updateData
        }).unwrap();
        
        setSuccess("Subscription updated successfully!");
      } else {
        // Create new subscription
        const subscriptionData: CreateSubscriptionDto = {
          client_name: fields.client_name,
          subscription_level: fields.subscription_level,
          payment_method: fields.payment_method,
          billing_info: billingInfo,
          auto_renewal: fields.auto_renewal,
          partner_code: fields.partner_code || undefined,
          custom_limits: Object.keys(customLimits).length > 0 ? customLimits : undefined,
        };

        await createSubscription(subscriptionData).unwrap();
        setSuccess("Subscription created successfully!");
      }

      setTimeout(() => {
        onSuccess?.();
        onClose();
        setSuccess("");
      }, 1500);
      
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'data' in err) {
        const errorData = err as { data?: { message?: string } };
        setError(errorData.data?.message || `Failed to ${isEditing ? 'update' : 'create'} subscription`);
      } else {
        setError(`Failed to ${isEditing ? 'update' : 'create'} subscription`);
      }
    }
  };

  const inputClasses = "w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

  return (
    <Modal show={isOpen} onClose={onClose} size="2xl">
      <div className="text-white max-h-[80vh] overflow-auto scrollbar-hide">
        <h2 className="text-2xl font-bold text-blue-300 mb-6">
          {isEditing ? "Edit Subscription" : "Create Subscription"}
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

          {/* Basic Subscription Info */}
          <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <h3 className="text-lg font-semibold text-blue-300 mb-4">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Client Name *</label>
                <input
                  type="text"
                  name="client_name"
                  value={fields.client_name}
                  onChange={handleChange}
                  placeholder="client-name"
                  className={inputClasses}
                  required
                  disabled={isEditing}
                />
              </div>
              
              <div>
                <label className={labelClasses}>Subscription Level *</label>
                <select
                  name="subscription_level"
                  value={fields.subscription_level}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                >
                  <option value="L0">L0 - Basic</option>
                  <option value="L1">L1 - Standard</option>
                  <option value="L2">L2 - Professional</option>
                  <option value="L3">L3 - Enterprise</option>
                  <option value="LE">LE - Law Enforcement</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className={labelClasses}>Payment Method</label>
                <select
                  name="payment_method"
                  value={fields.payment_method}
                  onChange={handleChange}
                  className={inputClasses}
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                  <option value="crypto">Cryptocurrency</option>
                </select>
              </div>

              <div>
                <label className={labelClasses}>Partner Code</label>
                <input
                  type="text"
                  name="partner_code"
                  value={fields.partner_code}
                  onChange={handleChange}
                  placeholder="Optional partner code"
                  className={inputClasses}
                />
              </div>

              <div className="flex items-center space-x-2 mt-8">
                <input
                  type="checkbox"
                  name="auto_renewal"
                  checked={fields.auto_renewal}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label className="text-gray-300">Auto Renewal</label>
              </div>
            </div>

            {/* Only show these fields when editing */}
            {isEditing && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className={labelClasses}>Payment Status</label>
                  <select
                    name="payment_status"
                    value={fields.payment_status}
                    onChange={handleChange}
                    className={inputClasses}
                  >
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                <div>
                  <label className={labelClasses}>Grace Period (Days)</label>
                  <input
                    type="number"
                    min="0"
                    name="grace_period_days"
                    value={fields.grace_period_days}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Custom Limits */}
          <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <h3 className="text-lg font-semibold text-blue-300 mb-4">Custom Limits</h3>
            <p className="text-gray-400 text-sm mb-4">Leave empty to use tier defaults</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Max Edits</label>
                <input
                  type="number"
                  min="0"
                  name="custom_limits.max_edits"
                  value={fields.custom_limits.max_edits}
                  onChange={handleChange}
                  placeholder="Use tier default"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className={labelClasses}>Max Apps</label>
                <input
                  type="number"
                  min="0"
                  name="custom_limits.max_apps"
                  value={fields.custom_limits.max_apps}
                  onChange={handleChange}
                  placeholder="Use tier default"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className={labelClasses}>Run Quota</label>
                <input
                  type="number"
                  min="0"
                  name="custom_limits.run_quota"
                  value={fields.custom_limits.run_quota}
                  onChange={handleChange}
                  placeholder="Use tier default"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className={labelClasses}>Max Users</label>
                <input
                  type="number"
                  min="0"
                  name="custom_limits.max_users"
                  value={fields.custom_limits.max_users}
                  onChange={handleChange}
                  placeholder="Use tier default"
                  className={inputClasses}
                />
              </div>
            </div>
          </div>

          {/* Billing Information */}
          {!isEditing && (
            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <h3 className="text-lg font-semibold text-blue-300 mb-4">Billing Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Company Name</label>
                  <input
                    type="text"
                    name="billing_info.company_name"
                    value={fields.billing_info.company_name}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className={labelClasses}>Billing Email</label>
                  <input
                    type="email"
                    name="billing_info.billing_email"
                    value={fields.billing_info.billing_email}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className={labelClasses}>Tax ID</label>
                  <input
                    type="text"
                    name="billing_info.tax_id"
                    value={fields.billing_info.tax_id}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-md font-medium text-blue-200 mb-3">Billing Address</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className={labelClasses}>Street Address</label>
                    <input
                      type="text"
                      name="billing_info.street"
                      value={fields.billing_info.street}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className={labelClasses}>City</label>
                      <input
                        type="text"
                        name="billing_info.city"
                        value={fields.billing_info.city}
                        onChange={handleChange}
                        className={inputClasses}
                      />
                    </div>

                    <div>
                      <label className={labelClasses}>State/Province</label>
                      <input
                        type="text"
                        name="billing_info.state"
                        value={fields.billing_info.state}
                        onChange={handleChange}
                        className={inputClasses}
                      />
                    </div>

                    <div>
                      <label className={labelClasses}>Country</label>
                      <input
                        type="text"
                        name="billing_info.country"
                        value={fields.billing_info.country}
                        onChange={handleChange}
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  <div className="md:w-1/3">
                    <label className={labelClasses}>Postal Code</label>
                    <input
                      type="text"
                      name="billing_info.postal_code"
                      value={fields.billing_info.postal_code}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Suspension Settings (for editing) */}
          {isEditing && (
            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <h3 className="text-lg font-semibold text-blue-300 mb-4">Suspension Settings</h3>
              
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  name="is_suspended"
                  checked={fields.is_suspended}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label className="text-gray-300">Suspend Subscription</label>
              </div>

              {fields.is_suspended && (
                <div>
                  <label className={labelClasses}>Suspension Reason</label>
                  <textarea
                    name="suspension_reason"
                    value={fields.suspension_reason}
                    onChange={handleChange}
                    placeholder="Reason for suspension..."
                    rows={3}
                    className={inputClasses}
                  />
                </div>
              )}
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
                : (isEditing ? "Update Subscription" : "Create Subscription")
              }
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
