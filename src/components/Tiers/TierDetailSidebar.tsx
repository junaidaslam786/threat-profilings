import React from "react";
import Sidebar from "../Common/Sidebar";
import type { TierConfigDto } from "../../Redux/slices/tiersSlice";

interface TierDetailSidebarProps {
  tier: TierConfigDto | null;
  isOpen: boolean;
  onClose: () => void;
}

const TierDetailSidebar: React.FC<TierDetailSidebarProps> = ({
  tier,
  isOpen,
  onClose,
}) => {
  if (!tier) return null;

  const features = tier.features || {};

  return (
    <Sidebar isOpen={isOpen} onClose={onClose} title={`${tier.name} Details`}>
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="bg-secondary-800 rounded-xl p-6 border border-secondary-700/50">
          <h3 className="text-lg font-semibold text-primary-300 mb-4">
            Basic Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-secondary-400">Tier Name</label>
              <div className="text-white font-medium">{tier.name}</div>
            </div>
            <div>
              <label className="text-sm text-secondary-400">Sub Level</label>
              <div className="text-white font-medium">{tier.sub_level}</div>
            </div>
          </div>
          {tier.description && (
            <div className="mt-4">
              <label className="text-sm text-secondary-400">Description</label>
              <div className="text-white">{tier.description}</div>
            </div>
          )}
        </div>

        {/* Limits & Quotas */}
        <div className="bg-secondary-800 rounded-xl p-6 border border-secondary-700/50">
          <h3 className="text-lg font-semibold text-primary-300 mb-4">
            Limits & Quotas
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary-700/50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-primary-400">
                {tier.max_edits}
              </div>
              <div className="text-sm text-secondary-400">Max Edits</div>
            </div>
            <div className="bg-secondary-700/50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-primary-400">
                {tier.max_apps}
              </div>
              <div className="text-sm text-secondary-400">Max Apps</div>
            </div>
            <div className="bg-secondary-700/50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-primary-400">
                {tier.run_quota}
              </div>
              <div className="text-sm text-secondary-400">Run Quota</div>
            </div>
            <div className="bg-secondary-700/50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-primary-400">
                {features.max_users || "Unlimited"}
              </div>
              <div className="text-sm text-secondary-400">Max Users</div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-secondary-800 rounded-xl p-6 border border-secondary-700/50">
          <h3 className="text-lg font-semibold text-primary-300 mb-4">
            Pricing
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 p-4 rounded-lg border border-green-500/30">
              <div className="text-2xl font-bold text-green-400">
                ${tier.price_monthly}
              </div>
              <div className="text-sm text-green-300">Monthly</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-4 rounded-lg border border-blue-500/30">
              <div className="text-2xl font-bold text-blue-400">
                ${tier.price_onetime_registration}
              </div>
              <div className="text-sm text-blue-300">Registration</div>
            </div>
          </div>
        </div>

        {/* Feature Flags */}
        <div className="bg-secondary-800 rounded-xl p-6 border border-secondary-700/50">
          <h3 className="text-lg font-semibold text-primary-300 mb-4">
            Features
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "threat_detection", label: "Threat Detection" },
              { key: "compliance_reports", label: "Compliance Reports" },
              { key: "api_access", label: "API Access" },
              { key: "custom_branding", label: "Custom Branding" },
              { key: "priority_support", label: "Priority Support" },
              { key: "sso_integration", label: "SSO Integration" },
              { key: "audit_logs", label: "Audit Logs" },
              { key: "data_export", label: "Data Export" },
              { key: "is_active", label: "Active" },
              { key: "le_eligible", label: "LE Eligible" },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    features[key as keyof typeof features]
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                />
                <span className="text-sm text-secondary-300">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Information */}
        {features.compliance_frameworks?.length && (
          <div className="bg-secondary-800 rounded-xl p-6 border border-secondary-700/50">
            <h3 className="text-lg font-semibold text-primary-300 mb-4">
              Additional Information
            </h3>

            {features.compliance_frameworks &&
              features.compliance_frameworks.length > 0 && (
                <div>
                  <label className="text-sm text-secondary-400 mb-2 block">
                    Compliance Frameworks
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {features.compliance_frameworks.map((framework, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-tertiary-600/20 text-tertiary-300 rounded-full text-sm border border-tertiary-500/30"
                      >
                        {framework}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default TierDetailSidebar;
