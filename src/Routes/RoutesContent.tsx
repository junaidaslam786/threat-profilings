import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/Auth/ProtectedRoute";
const LoadingScreen = lazy(() => import("../components/Common/LoadingScreen"));

// Auth Pages
const AuthRedirectHandlerPage = lazy(
  () => import("../Pages/Auth/AuthRedirectHandlerPage")
);
const AdminLogin = lazy(() => import("../Pages/Admin/AdminLogin"));

// Dashboard
const Dashboard = lazy(() => import("../Pages/Dashboard/Dashboard"));
const EnhancedComponentsDashboard = lazy(() => import("../Pages/Dashboard/EnhancedComponentsDashboard"));

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
const TierCreateEnhanced = lazy(() => import("../Pages/Tiers/TierCreateEnhanced"));

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
const ActivityLogs = lazy(
  () => import("../Pages/PlatformAdmins/ActivityLogs")
);
const AdminManagement = lazy(
  () => import("../Pages/PlatformAdmins/AdminManagement")
);
const UserManagement = lazy(
  () => import("../Pages/PlatformAdmins/UserManagement")
);
const GrantAdminAccess = lazy(
  () => import("../Pages/PlatformAdmins/GrantAdminAccess")
);
const TaxRules = lazy(
  () => import("../Pages/PlatformAdmins/TaxRules")
);
const Invoices = lazy(
  () => import("../Pages/PlatformAdmins/Invoices")
);
const ManualUpgrades = lazy(
  () => import("../Pages/PlatformAdmins/ManualUpgrades")
);

// Partner Pages
const PartnerCodeListPage = lazy(
  () => import("../Pages/Partners/PartnerCodeListPage")
);
const PartnerCodeCreatePage = lazy(
  () => import("../Pages/Partners/PartnerCodeCreatePage")
);
const PartnerCodeDetailPage = lazy(
  () => import("../Pages/Partners/PartnerCodeDetailPage")
);
const PartnerCodeEditPage = lazy(
  () => import("../Pages/Partners/PartnerCodeEditPage")
);
const PartnerCodeStatsPage = lazy(
  () => import("../Pages/Partners/PartnerCodeStatsPage")
);

// Payments Pages
const PaymentPage = lazy(() => import("../Pages/Payments/PaymentPage"));
const PaymentDashboard = lazy(() => import("../Pages/Payments/PaymentDashboard"));
const PaymentTestPage = lazy(() => import("../Pages/Payments/PaymentTestPage"));
const InvoicesPage = lazy(() => import("../Pages/Payments/InvoicesPage"));
const PaymentSuccessPage = lazy(() => import("../Pages/Payments/PaymentSuccessPage"));
const PaymentCancelledPage = lazy(() => import("../Pages/Payments/PaymentCancelledPage"));


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
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/user/organization/create" element={<RegisterPage />} />
        
        {/* Dashboard route - handles its own auth logic */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
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
            <ProtectedRoute requiredRoles={["admin"]}>
              <AdminPendingJoinRequests />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/admin/invite-user" 
          element={
            <ProtectedRoute requiredRoles={["admin"]}>
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

        {/* Role routes - authenticated users */}
        <Route 
          path="/roles" 
          element={
            <ProtectedRoute>
              <RoleListPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/roles/:role_id" 
          element={
            <ProtectedRoute>
              <RoleDetailPage />
            </ProtectedRoute>
          } 
        />

        {/* Subscription routes - admin only */}
        <Route
          path="/subscriptions/:client_name"
          element={
            <ProtectedRoute requiredRoles={["admin", "platform_admin"]}>
              <SubscriptionDetailPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/subscriptions/create" 
          element={
            <ProtectedRoute requiredRoles={["admin", "platform_admin"]}>
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
          path="/tiers/create" 
          element={
            <ProtectedRoute requiredRoles={["platform_admin"]}>
              <TierCreateEnhanced />
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
          path="/platform-admins/grant-admin" 
          element={
            <ProtectedRoute requiredRoles={["super_admin"]}>
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
          path="/platform-admins/manual-upgrades" 
          element={
            <ProtectedRoute requiredRoles={["platform_admin"]}>
              <ManualUpgrades />
            </ProtectedRoute>
          } 
        />

        {/* Partner Management Routes - platform admin only */}
        <Route 
          path="/partners" 
          element={
            <ProtectedRoute requiredRoles={["platform_admin"]}>
              <PartnerCodeListPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/partners/create" 
          element={
            <ProtectedRoute requiredRoles={["platform_admin"]}>
              <PartnerCodeCreatePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/partners/:code" 
          element={
            <ProtectedRoute requiredRoles={["platform_admin"]}>
              <PartnerCodeDetailPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/partners/:code/edit" 
          element={
            <ProtectedRoute requiredRoles={["platform_admin"]}>
              <PartnerCodeEditPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/partners/:code/stats" 
          element={
            <ProtectedRoute requiredRoles={["platform_admin"]}>
              <PartnerCodeStatsPage />
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
            <ProtectedRoute requiredRoles={["admin", "platform_admin"]}>
              <PaymentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/payment/success" 
          element={
            <ProtectedRoute>
              <PaymentPage />
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
