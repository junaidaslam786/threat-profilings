import React, { useState } from "react";
import { useUpdateTierMutation } from "../../Redux/api/tiersApi";
import Modal from "../Common/Modal";
import MultiSelect from "../Common/MultiSelect";
import { COMPLIANCE_FRAMEWORKS } from "../../constants/complianceFrameworks";
import type { TierConfigDto } from "../../Redux/slices/tiersSlice";

interface TierEditModalProps {
  tier: TierConfigDto;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TierEditModal: React.FC<TierEditModalProps> = ({
  tier,
  onClose,
  onSuccess,
}) => {
  const [updateTier, { isLoading }] = useUpdateTierMutation();
  const [formData, setFormData] = useState({
    name: tier.name,
    description: tier.description || "",
    max_edits: tier.max_edits.toString(),
    max_apps: tier.max_apps.toString(),
    run_quota: tier.run_quota.toString(),
    price_monthly: tier.price_monthly.toString(),
    price_onetime_registration: tier.price_onetime_registration.toString(),
    compliance_reports: tier.features?.compliance_reports || false,
    api_access: tier.features?.api_access || false,
    custom_branding: tier.features?.custom_branding || false,
    priority_support: tier.features?.priority_support || false,
    sso_integration: tier.features?.sso_integration || false,
    audit_logs: tier.features?.audit_logs || false,
    data_export: tier.features?.data_export || false,
    compliance_frameworks: tier.features?.compliance_frameworks || [],
    is_active: tier.features?.is_active || false,
    le_eligible: tier.features?.le_eligible || false,
  });

  const handleComplianceFrameworksChange = (values: string[]) => {
    setFormData((prev) => ({ ...prev, compliance_frameworks: values }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateTier({
        sub_level: tier.sub_level,
        name: formData.name,
        description: formData.description,
        max_edits: parseInt(formData.max_edits),
        max_apps: parseInt(formData.max_apps),
        run_quota: parseInt(formData.run_quota),
        price_monthly: parseFloat(formData.price_monthly),
        price_onetime_registration: parseFloat(
          formData.price_onetime_registration
        ),
        features: {
          compliance_reports: formData.compliance_reports,
          api_access: formData.api_access,
          custom_branding: formData.custom_branding,
          priority_support: formData.priority_support,
          sso_integration: formData.sso_integration,
          audit_logs: formData.audit_logs,
          data_export: formData.data_export,
          compliance_frameworks: formData.compliance_frameworks,
          is_active: formData.is_active,
          le_eligible: formData.le_eligible,
        },
      }).unwrap();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update tier:", error);
    }
  };

  return (
    <Modal show={true} onClose={onClose}>
      <div className="max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Tier Name (Previous: {tier.name})
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 bg-secondary-700 border border-secondary-600 rounded text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Max Edits (Previous: {tier.max_edits})
              </label>
              <input
                type="number"
                value={formData.max_edits}
                onChange={(e) =>
                  setFormData({ ...formData, max_edits: e.target.value })
                }
                className="w-full px-3 py-2 bg-secondary-700 border border-secondary-600 rounded text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Max Apps (Previous: {tier.max_apps})
              </label>
              <input
                type="number"
                value={formData.max_apps}
                onChange={(e) =>
                  setFormData({ ...formData, max_apps: e.target.value })
                }
                className="w-full px-3 py-2 bg-secondary-700 border border-secondary-600 rounded text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Run Quota (Previous: {tier.run_quota})
              </label>
              <input
                type="number"
                value={formData.run_quota}
                onChange={(e) =>
                  setFormData({ ...formData, run_quota: e.target.value })
                }
                className="w-full px-3 py-2 bg-secondary-700 border border-secondary-600 rounded text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Monthly Price (Previous: ${tier.price_monthly})
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price_monthly}
                onChange={(e) =>
                  setFormData({ ...formData, price_monthly: e.target.value })
                }
                className="w-full px-3 py-2 bg-secondary-700 border border-secondary-600 rounded text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Registration Price (Previous: ${tier.price_onetime_registration}
                )
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price_onetime_registration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price_onetime_registration: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-secondary-700 border border-secondary-600 rounded text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Description (Previous: {tier.description || "None"})
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 bg-secondary-700 border border-secondary-600 rounded text-white"
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <label className="flex items-center text-white">
              <input
                type="checkbox"
                checked={formData.compliance_reports}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    compliance_reports: e.target.checked,
                  })
                }
                className="mr-2"
              />
              Compliance Reports
            </label>
            <label className="flex items-center text-white">
              <input
                type="checkbox"
                checked={formData.api_access}
                onChange={(e) =>
                  setFormData({ ...formData, api_access: e.target.checked })
                }
                className="mr-2"
              />
              API Access
            </label>
            <label className="flex items-center text-white">
              <input
                type="checkbox"
                checked={formData.custom_branding}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    custom_branding: e.target.checked,
                  })
                }
                className="mr-2"
              />
              Custom Branding
            </label>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <label className="flex items-center text-white">
              <input
                type="checkbox"
                checked={formData.priority_support}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority_support: e.target.checked,
                  })
                }
                className="mr-2"
              />
              Priority Support
            </label>
            <label className="flex items-center text-white">
              <input
                type="checkbox"
                checked={formData.sso_integration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sso_integration: e.target.checked,
                  })
                }
                className="mr-2"
              />
              SSO Integration
            </label>
            <label className="flex items-center text-white">
              <input
                type="checkbox"
                checked={formData.audit_logs}
                onChange={(e) =>
                  setFormData({ ...formData, audit_logs: e.target.checked })
                }
                className="mr-2"
              />
              Audit Logs
            </label>
            <label className="flex items-center text-white">
              <input
                type="checkbox"
                checked={formData.data_export}
                onChange={(e) =>
                  setFormData({ ...formData, data_export: e.target.checked })
                }
                className="mr-2"
              />
              Data Export
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center text-white">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                className="mr-2"
              />
              Is Active
            </label>
            <label className="flex items-center text-white">
              <input
                type="checkbox"
                checked={formData.le_eligible}
                onChange={(e) =>
                  setFormData({ ...formData, le_eligible: e.target.checked })
                }
                className="mr-2"
              />
              LE Eligible
            </label>
          </div>

          <div>
            <MultiSelect
              id="compliance_frameworks"
              label="Compliance Frameworks"
              options={COMPLIANCE_FRAMEWORKS}
              values={formData.compliance_frameworks}
              onChange={handleComplianceFrameworksChange}
              placeholder="Select compliance frameworks..."
              searchable={true}
              className="mt-2"
            />
            <p className="text-xs text-gray-400 mt-1">
              Previous:{" "}
              {tier.features?.compliance_frameworks?.join(", ") || "None"}
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white rounded-lg hover:from-secondary-500 hover:to-secondary-600 transition-all duration-200 font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-500 hover:to-primary-600 transition-all duration-200 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Updating..." : "Update Tier"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default TierEditModal;
