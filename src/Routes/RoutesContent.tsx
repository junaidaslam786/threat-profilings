import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/Auth/ProtectedRoute";
import ErrorBoundary from "../components/Common/ErrorBoundary";
import TaxRules from "../Pages/PlatformAdmins/TaxRules";
import PartnerManagement from "../Pages/PlatformAdmins/PartnerManagement";
import Invoices from "../Pages/PlatformAdmins/Invoices";
const LoadingScreen = lazy(() => import("../components/Common/LoadingScreen"));

// Auth Pages
const AuthRedirectHandlerPage = lazy(
  () => import("../Pages/Auth/AuthRedirectHandlerPage")
);
const CustomAuthPage = lazy(() => import("../Pages/Auth/CustomAuthPage"));
const AdminLogin = lazy(() => import("../Pages/Admin/AdminLogin"));

// Dashboard
const Dashboard = lazy(() => import("../Pages/Dashboard/Dashboard"));
const EnhancedComponentsDashboard = lazy(
  () => import("../Pages/Dashboard/EnhancedComponentsDashboard")
);

// Home Page for non-admin users
const OrganizationDetailsHome = lazy(
  () => import("../Pages/Home/OrganizationDetailsHome")
);

// Threat Profiling Pages
const TargetPage = lazy(() => import("../Pages/ThreatProfiling/TargetPage"));
const IntroPage = lazy(() => import("../Pages/ThreatProfiling/IntroPage"));
const ThreatActorPage = lazy(
  () => import("../Pages/ThreatProfiling/ThreatActorPage")
);
const ThreatsPage = lazy(() => import("../Pages/ThreatProfiling/ThreatsPage"));
const DetectionPage = lazy(
  () => import("../Pages/ThreatProfiling/DetectionPage")
);
const ComplianceIsmPage = lazy(
  () => import("../Pages/ThreatProfiling/ComplianceIsmPage")
);
const ComplianceE8Page = lazy(
  () => import("../Pages/ThreatProfiling/ComplianceE8Page")
);

// Admin-specific Pages (non-platform admin)
const AdminPendingJoinRequests = lazy(
  () => import("../Pages/Admin/AdminPendingJoinRequests")
);
const AdminInviteUser = lazy(() => import("../Pages/Admin/AdminInviteUser"));

// Organization Pages
const OrganizationListPage = lazy(
  () => import("../Pages/Organizations/OrganizationListPage")
);
const OrganizationDetailPage = lazy(
  () => import("../Pages/Organizations/OrganizationDetailPage")
);
const OrganizationEditPage = lazy(
  () => import("../Pages/Organizations/OrganizationEditPage")
);
const OrganizationSettingsPage = lazy(
  () => import("../Pages/Organizations/OrganizationSettingsPage")
);
const ThreatProfilingManagementPage = lazy(
  () => import("../Pages/Organizations/ThreatProfilingManagementPage")
);

// Role Pages
const RoleListPage = lazy(() => import("../Pages/Roles/RoleListPage"));
const RoleDetailPage = lazy(() => import("../Pages/Roles/RoleDetailPage"));

// Subscription Pages
const SubscriptionDetailPage = lazy(
  () => import("../Pages/Subscriptions/SubscriptionDetailPage")
);
const SubscriptionCreate = lazy(
  () => import("../Pages/Subscriptions/SubscriptionCreate")
);

// Tier Pages
const TierListPage = lazy(() => import("../Pages/Tiers/TierListPage"));
const TierDetailPage = lazy(() => import("../Pages/Tiers/TierDetailPage"));
// TierCreateEnhanced removed - using default enhanced TierCreate

// User Pages
const RegisterPage = lazy(() => import("../Pages/Users/RegisterPage"));
const JoinOrgRequestPage = lazy(
  () => import("../Pages/Users/JoinOrgRequestPage")
);
const ProfilePage = lazy(() => import("../Pages/Users/ProfilePage"));

// Platform Admin Pages
const PlatformAdminDashboard = lazy(
  () => import("../Pages/PlatformAdmins/PlatformAdminsDashboard")
);
const PlatformStats = lazy(
  () => import("../Pages/PlatformAdmins/PlatformStats")
);
const ActivityLogs = lazy(() => import("../Pages/PlatformAdmins/ActivityLogs"));
const AdminManagement = lazy(
  () => import("../Pages/PlatformAdmins/AdminManagement")
);
const UserManagement = lazy(
  () => import("../Pages/PlatformAdmins/UserManagement")
);
const GrantAdminAccess = lazy(
  () => import("../Pages/PlatformAdmins/GrantAdminAccess")
);

// Partner Pages
const PartnerCodeListPage = lazy(
  () => import("../Pages/Partners/PartnerCodeListPage")
);
const PartnerCodeCreatePage = lazy(
  () => import("../Pages/Partners/PartnerCodeCreatePage")
);
const PartnerCodeEditPage = lazy(
  () => import("../Pages/Partners/PartnerCodeEditPage")
);
const PartnerCodeStatsPage = lazy(
  () => import("../Pages/Partners/PartnerCodeStatsPage")
);

// Payments Pages
const PaymentPage = lazy(() => import("../Pages/Payments/PaymentPage"));
const PaymentDashboard = lazy(
  () => import("../Pages/Payments/PaymentDashboard")
);
const PaymentTestPage = lazy(() => import("../Pages/Payments/PaymentTestPage"));
const InvoicesPage = lazy(() => import("../Pages/Payments/InvoicesPage"));
const PaymentSuccessPage = lazy(
  () => import("../Pages/Payments/PaymentSuccessPage")
);
const PaymentCancelledPage = lazy(
  () => import("../Pages/Payments/PaymentCancelledPage")
);
const PaymentDetailsPage = lazy(
  () => import("../Pages/PlatformAdmins/PaymentDetailsPage")
);
const SettingsPage = lazy(() => import("../Pages/Settings/SettingsPage"));
const AnalyticsPage = lazy(() => import("../Pages/Analytics/AnalyticsPage"));

const RoutesContent: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen flex flex-row justify-center items-center">
          <LoadingScreen />
        </div>
      }
    >
      <Routes>
        {/* Public routes - no authentication required */}
        <Route
          path="/auth-redirect-handler"
          element={<AuthRedirectHandlerPage />}
        />
        <Route path="/auth" element={<CustomAuthPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/user/organization/create" element={<RegisterPage />} />

        {/* Dashboard route - handles its own auth logic */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Home page for non-admin users */}
        <Route
          path="/home"
          element={
            <ProtectedRoute requireAuth={true} requireActive={true}>
              <OrganizationDetailsHome />
            </ProtectedRoute>
          }
        />

        {/* Threat Profiling Routes */}
        <Route
          path="/threat-profiling/target"
          element={
            <ProtectedRoute requireAuth={true} requireActive={true}>
              <TargetPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/threat-profiling/intro"
          element={
            <ProtectedRoute requireAuth={true} requireActive={true}>
              <IntroPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/threat-profiling/threat-actor"
          element={
            <ProtectedRoute requireAuth={true} requireActive={true}>
              <ThreatActorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/threat-profiling/threats"
          element={
            <ProtectedRoute requireAuth={true} requireActive={true}>
              <ThreatsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/threat-profiling/detection"
          element={
            <ProtectedRoute requireAuth={true} requireActive={true}>
              <DetectionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/threat-profiling/compliance-ism"
          element={
            <ProtectedRoute requireAuth={true} requireActive={true}>
              <ComplianceIsmPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/threat-profiling/compliance-e8"
          element={
            <ProtectedRoute requireAuth={true} requireActive={true}>
              <ComplianceE8Page />
            </ProtectedRoute>
          }
        />

        {/* Protected routes that require authentication */}
        <Route
          path="/join-org-request"
          element={
            <ProtectedRoute requireAuth={true} requireActive={false}>
              <JoinOrgRequestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute requireAuth={true} requireActive={false}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Enhanced dashboard with basic auth check */}
        <Route
          path="/enhanced"
          element={
            <ProtectedRoute requireAuth={true} requireActive={true}>
              <EnhancedComponentsDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin-only routes */}
        <Route
          path="/admin/join-requests"
          element={
            <ProtectedRoute requiredRoles={["admin", "LE_ADMIN"]}>
              <AdminPendingJoinRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/invite-user"
          element={
            <ProtectedRoute requiredRoles={["admin", "LE_ADMIN"]}>
              <AdminInviteUser />
            </ProtectedRoute>
          }
        />

        {/* Organization routes - authenticated users */}
        <Route
          path="/orgs"
          element={
            <ProtectedRoute>
              <OrganizationListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orgs/:client_name"
          element={
            <ProtectedRoute>
              <OrganizationDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orgs/:client_name/edit"
          element={
            <ProtectedRoute requiredRoles={["admin", "LE_ADMIN"]}>
              <OrganizationEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orgs/:client_name/settings"
          element={
            <ProtectedRoute>
              <OrganizationSettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/threat-profiling-management"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <ThreatProfilingManagementPage />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />

        {/* Role routes - authenticated users */}
        <Route
          path="/roles"
          element={
            <ProtectedRoute requiredRoles={["platform_admin"]}>
              <RoleListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/roles/:role_id"
          element={
            <ProtectedRoute requiredRoles={["platform_admin"]}>
              <RoleDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Subscription routes - admin only */}
        <Route
          path="/subscriptions/:client_name"
          element={
            <ProtectedRoute
              requiredRoles={["admin", "platform_admin", "LE_ADMIN"]}
            >
              <SubscriptionDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscriptions/create"
          element={
            <ProtectedRoute requiredRoles={["platform_admin"]}>
              <SubscriptionCreate />
            </ProtectedRoute>
          }
        />

        {/* Tier routes - platform admin only */}
        <Route
          path="/tiers"
          element={
            <ProtectedRoute requiredRoles={["platform_admin"]}>
              <TierListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tiers/:sub_level"
          element={
            <ProtectedRoute requiredRoles={["platform_admin"]}>
              <TierDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Platform Admin Routes - platform admin only */}
        <Route
          path="/platform-admins"
          element={
            <ProtectedRoute requiredRoles={["platform_admin"]}>
              <PlatformAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/platform-admins/stats"
          element={
            <ProtectedRoute requiredRoles={["platform_admin"]}>
              <PlatformStats />
            </ProtectedRoute>
          }
        />
        <Route
          path="/platform-admins/activity-logs"
          element={
            <ProtectedRoute requiredRoles={["platform_admin"]}>
              <ActivityLogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/platform-admins/admins"
          element={
            <ProtectedRoute requiredRoles={["platform_admin"]}>
              <AdminManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/platform-admins/users"
          element={
            <ProtectedRoute requiredRoles={["platform_admin"]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/platform-admins/partners"
          element={
            <ProtectedRoute requiredRoles={["platform_admin"]}>
              <PartnerManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/platform-admins/grant-admin"
          element={
            <ProtectedRoute requiredRoles={["platform_admin"]}>
              <GrantAdminAccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/platform-admins/tax-rules"
          element={
            <ProtectedRoute requiredRoles={["platform_admin"]}>
              <TaxRules />
            </ProtectedRoute>
          }
        />
        <Route
          path="/platform-admins/invoices"
          element={
            <ProtectedRoute requiredRoles={["platform_admin"]}>
              <Invoices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/platform-admin/payments-details"
          element={
            <ProtectedRoute requiredRoles={["platform_admin"]}>
              <PaymentDetailsPage />
            </ProtectedRoute>
          }
        />

        {/* Partner Code Management Routes - platform admin only */}
        <Route
          path="/platform-admins/partner-codes"
          element={
            <ProtectedRoute requiredRoles={["platform_admin"]}>
              <PartnerCodeListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/platform-admins/partner-codes/create"
          element={
            <ProtectedRoute requiredRoles={["platform_admin"]}>
              <PartnerCodeCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/platform-admins/partner-codes/:code/edit"
          element={
            <ProtectedRoute requiredRoles={["platform_admin"]}>
              <PartnerCodeEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/platform-admins/partner-codes/:code/stats"
          element={
            <ProtectedRoute requiredRoles={["platform_admin"]}>
              <PartnerCodeStatsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute requiredRoles={["platform_admin"]}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute requiredRoles={["admin", "LE_ADMIN"]}>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />

        {/* Payment Routes - authenticated users with admin access for dashboard */}
        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-dashboard"
          element={
            <ProtectedRoute
              requiredRoles={["admin", "platform_admin", "LE_ADMIN"]}
            >
              <PaymentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/success"
          element={
            <ProtectedRoute>
              <PaymentSuccessPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-test"
          element={
            <ProtectedRoute requiredRoles={["platform_admin"]}>
              <PaymentTestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoices"
          element={
            <ProtectedRoute>
              <InvoicesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-success"
          element={
            <ProtectedRoute>
              <PaymentSuccessPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-cancelled"
          element={
            <ProtectedRoute>
              <PaymentCancelledPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default RoutesContent;
