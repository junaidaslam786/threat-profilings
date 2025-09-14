import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import Button from "../../components/Common/Button";
import ProtectedRoute from "../../components/Auth/ProtectedRoute";
import EnhancedOrganizationModal from "../Organizations/EnhancedOrganizationModal";
import ThreatProfilingReportModal from "../Organizations/ThreatProfilingReportModal";
import SecurityAssessmentModal from "../Organizations/SecurityAssessmentModal";

export default function EnhancedComponentsDashboard() {
  const navigate = useNavigate();
  const { isPlatformAdmin, isSuperAdmin, isAdmin } = useUser();
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [showThreatModal, setShowThreatModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);

  const getAvailableComponents = () => {
    const baseComponents = [
      {
        title: "Enhanced Organization Management",
        description:
          "Comprehensive organization creation and editing with advanced configuration options",
        action: () => setShowOrgModal(true),
        buttonText: "Open Organization Modal",
        requiredRole: ["admin", "platform_admin"],
      },
      {
        title: "Threat Profiling Report",
        description:
          "Detailed threat profiling with executive summary, organization context, and threat analysis",
        action: () => setShowThreatModal(true),
        buttonText: "Create Threat Report",
        requiredRole: ["admin", "platform_admin", "viewer"],
      },
      {
        title: "Security Assessment",
        description:
          "Comprehensive security assessment with methodology, findings, and remediation planning",
        action: () => setShowAssessmentModal(true),
        buttonText: "Create Security Assessment",
        requiredRole: ["admin", "platform_admin", "viewer"],
      },
    ];

    const adminComponents = [
      {
        title: "Enhanced Partner Code Management",
        description:
          "Advanced partner code creation with usage tracking and validation rules",
        action: () => navigate("/partners"),
        buttonText: "Manage Partner Codes",
        requiredRole: ["platform_admin"],
      },
      {
        title: "Enhanced Subscription Management",
        description:
          "Complete subscription management with billing information and custom limits",
        action: () => navigate("/subscriptions/create"),
        buttonText: "Create Subscription",
        requiredRole: ["platform_admin"],
      },
      {
        title: "Enhanced User Creation",
        description:
          "Comprehensive user account creation with profile details and security settings",
        action: () => navigate("/platform-admins/users"),
        buttonText: "Create User Account",
        requiredRole: ["platform_admin"],
      },
      {
        title: "Enhanced Tier Management",
        description:
          "Advanced tier configuration with comprehensive feature settings",
        action: () => navigate("/tiers"),
        buttonText: "Create Enhanced Tier",
        requiredRole: ["platform_admin"],
      },
    ];

    const availableComponents = [...baseComponents];

    if (isPlatformAdmin || isSuperAdmin) {
      availableComponents.push(...adminComponents);
    } else if (isAdmin) {
      availableComponents.push(
        ...adminComponents.filter(
          (comp) =>
            comp.title.includes("Subscription") || comp.title.includes("User")
        )
      );
    }

    return availableComponents;
  };

  const components = getAvailableComponents();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-300 mb-2">
            Enhanced Components Dashboard
          </h1>
          <p className="text-gray-300 mb-8">
            Advanced forms and components with comprehensive functionality
            tailored to your role.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {components.map((component, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              >
                <h2 className="text-xl font-semibold text-blue-300 mb-3">
                  {component.title}
                </h2>
                <p className="text-gray-300 mb-6">{component.description}</p>

                <Button onClick={component.action} className="w-full">
                  {component.buttonText}
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button
              onClick={() => navigate("/dashboard")}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Back to Main Dashboard
            </Button>
          </div>
        </div>

        {/* Modals */}
        <EnhancedOrganizationModal
          isOpen={showOrgModal}
          onClose={() => setShowOrgModal(false)}
          onSuccess={() => {
            setShowOrgModal(false);
          }}
        />

        <ThreatProfilingReportModal
          isOpen={showThreatModal}
          onClose={() => setShowThreatModal(false)}
          onSave={() => {
            setShowThreatModal(false);
          }}
        />

        <SecurityAssessmentModal
          isOpen={showAssessmentModal}
          onClose={() => setShowAssessmentModal(false)}
          onSave={() => {
            setShowAssessmentModal(false);
          }}
        />
      </div>
    </ProtectedRoute>
  );
}
