import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Common/Button";
import EnhancedOrganizationModal from "../Organizations/EnhancedOrganizationModal";
import ThreatProfilingReportModal from "../Organizations/ThreatProfilingReportModal";
import SecurityAssessmentModal from "../Organizations/SecurityAssessmentModal";
import EnhancedPartnerCodeModal from "../Partners/EnhancedPartnerCodeModal";
import EnhancedSubscriptionModal from "../Subscriptions/EnhancedSubscriptionModal";
import EnhancedUserCreationModal from "../PlatformAdmins/EnhancedUserCreationModal";

export default function EnhancedComponentsDashboard() {
  const navigate = useNavigate();
  
  // Modal states
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [showThreatModal, setShowThreatModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  const components = [
    {
      title: "Enhanced Organization Management",
      description: "Comprehensive organization creation and editing with all optional fields including threat profiling and security assessments",
      fields: "client_name, client_description, industry, size, headquarters, timezone, contact_info, legal_info, compliance_requirements, threat_profiling_report, security_assessment",
      action: () => setShowOrgModal(true),
      buttonText: "Open Organization Modal"
    },
    {
      title: "Threat Profiling Report",
      description: "Detailed threat profiling with executive summary, organization context, threat analysis, risk assessment, and compliance",
      fields: "report_id, version, executive_summary, organization_context, threat_analysis, attack_surface, risk_assessment, controls_assessment, compliance_status",
      action: () => setShowThreatModal(true),
      buttonText: "Create Threat Report"
    },
    {
      title: "Security Assessment",
      description: "Comprehensive security assessment with methodology, findings, controls assessment, and remediation planning",
      fields: "assessment_id, assessment_type, status, metadata, methodology, results, findings, action_plan, quality_assurance",
      action: () => setShowAssessmentModal(true),
      buttonText: "Create Security Assessment"
    },
    {
      title: "Enhanced Partner Code Management",
      description: "Advanced partner code creation with usage tracking, validation rules, and commission settings",
      fields: "code, description, partner_name, contact_email, commission_percentage, usage_limit, valid_from, valid_until, is_active, auto_approve, usage_statistics",
      action: () => setShowPartnerModal(true),
      buttonText: "Manage Partner Codes"
    },
    {
      title: "Enhanced Subscription Management",
      description: "Complete subscription management with billing information, custom limits, and suspension settings",
      fields: "tier_id, user_limits, billing_info, custom_limits, auto_renewal, payment_method, billing_cycle, suspension_settings, trial_period, promo_codes",
      action: () => setShowSubscriptionModal(true),
      buttonText: "Create Subscription"
    },
    {
      title: "Enhanced User Creation",
      description: "Comprehensive user account creation with profile details, security settings, permissions, and custom fields",
      fields: "email, first_name, last_name, phone_number, job_title, timezone, permissions, security_settings, notification_preferences, custom_fields",
      action: () => setShowUserModal(true),
      buttonText: "Create User Account"
    },
    {
      title: "Enhanced Tier Management",
      description: "Advanced tier configuration with all optional fields and feature settings",
      fields: "sub_level, price, description, features, limits, quotas, permissions, advanced_settings",
      action: () => navigate("/tiers/create"),
      buttonText: "Create Enhanced Tier"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-300 mb-2">
          Enhanced Components Dashboard
        </h1>
        <p className="text-gray-300 mb-8">
          Comprehensive forms utilizing all Redux fields including optional parameters for complete data management.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {components.map((component, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-blue-300 mb-3">
                {component.title}
              </h2>
              <p className="text-gray-300 mb-4">
                {component.description}
              </p>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Key Fields Covered:</h3>
                <div className="bg-gray-700 rounded p-3 text-sm text-gray-300 font-mono">
                  {component.fields}
                </div>
              </div>

              <Button
                onClick={component.action}
                className="w-full"
              >
                {component.buttonText}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-blue-300 mb-4">
            Implementation Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-green-900/20 border border-green-500 rounded p-4">
              <h3 className="text-green-300 font-medium mb-2">✅ Completed</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Enhanced Organization Modal</li>
                <li>• Threat Profiling Report</li>
                <li>• Security Assessment</li>
                <li>• Enhanced Partner Codes</li>
                <li>• Enhanced Subscriptions</li>
                <li>• Enhanced User Creation</li>
                <li>• Enhanced Tier Creation</li>
              </ul>
            </div>
            
            <div className="bg-blue-900/20 border border-blue-500 rounded p-4">
              <h3 className="text-blue-300 font-medium mb-2">🔧 Features</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Multi-section tabbed forms</li>
                <li>• All optional fields included</li>
                <li>• Proper TypeScript typing</li>
                <li>• Redux integration ready</li>
                <li>• Responsive design</li>
                <li>• Form validation</li>
                <li>• Error handling</li>
              </ul>
            </div>
            
            <div className="bg-yellow-900/20 border border-yellow-500 rounded p-4">
              <h3 className="text-yellow-300 font-medium mb-2">📋 Usage Notes</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Forms use Redux types</li>
                <li>• API integration placeholders</li>
                <li>• Comprehensive field coverage</li>
                <li>• Sectioned for large forms</li>
                <li>• Navigation between sections</li>
                <li>• Custom field support</li>
                <li>• Proper error messaging</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EnhancedOrganizationModal
        isOpen={showOrgModal}
        onClose={() => setShowOrgModal(false)}
        onSuccess={() => {
          console.log("Organization saved successfully");
          setShowOrgModal(false);
        }}
      />

      <ThreatProfilingReportModal
        isOpen={showThreatModal}
        onClose={() => setShowThreatModal(false)}
        onSave={(report) => {
          console.log("Threat report saved:", report);
          setShowThreatModal(false);
        }}
      />

      <SecurityAssessmentModal
        isOpen={showAssessmentModal}
        onClose={() => setShowAssessmentModal(false)}
        onSave={(assessment) => {
          console.log("Security assessment saved:", assessment);
          setShowAssessmentModal(false);
        }}
      />

      <EnhancedPartnerCodeModal
        isOpen={showPartnerModal}
        onClose={() => setShowPartnerModal(false)}
      />

      <EnhancedSubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />

      <EnhancedUserCreationModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        onSuccess={() => {
          console.log("User created successfully");
          setShowUserModal(false);
        }}
      />
    </div>
  );
}
