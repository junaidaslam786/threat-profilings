import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
const LoadingScreen = lazy(() => import("../components/Common/LoadingScreen"));

// Auth Pages
const AuthRedirectHandlerPage = lazy(
  () => import("../Pages/Auth/AuthRedirectHandlerPage")
);
const AdminLogin = lazy(() => import("../Pages/Admin/AdminLogin"));

// Dashboard
const Dashboard = lazy(() => import("../Pages/Dashboard/Dashboard"));

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
const InvoicesPage = lazy(() => import("../Pages/Payments/InvoicesPage"));


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
        <Route path="/" element={<Dashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/auth-redirect-handler"
          element={<AuthRedirectHandlerPage />}
        />
        <Route
          path="/admin/join-requests"
          element={<AdminPendingJoinRequests />}
        />
        <Route path="/admin/invite-user" element={<AdminInviteUser />} />
        <Route path="/orgs" element={<OrganizationListPage />} />
        <Route path="/orgs/:client_name" element={<OrganizationDetailPage />} />
        <Route path="/roles" element={<RoleListPage />} />
        <Route path="/roles/:role_id" element={<RoleDetailPage />} />
        <Route
          path="/subscriptions/:client_name"
          element={<SubscriptionDetailPage />}
        />
        <Route path="/subscriptions/create" element={<SubscriptionCreate />} />
        <Route path="/tiers" element={<TierListPage />} />
        <Route path="/tiers/:sub_level" element={<TierDetailPage />} />
        <Route path="/user/organization/create" element={<RegisterPage />} />
        <Route path="/join-org-request" element={<JoinOrgRequestPage />} />
        <Route path="/profile" element={<ProfilePage />} />

         {/* Platform Admin Routes */}
        <Route path="/super-admin" element={<PlatformAdminDashboard />} />
        <Route path="/super-admin/stats" element={<PlatformStats />} />
        <Route path="/super-admin/activity-logs" element={<ActivityLogs />} />
        <Route path="/super-admin/admins" element={<AdminManagement />} />
        <Route path="/super-admin/users" element={<UserManagement />} />
        <Route path="/super-admin/grant-admin" element={<GrantAdminAccess />} />

       {/* Partner Management Routes */}
        <Route path="/partners" element={<PartnerCodeListPage />} />
        <Route path="/partners/create" element={<PartnerCodeCreatePage />} />
        <Route path="/partners/:code" element={<PartnerCodeDetailPage />} />
        <Route path="/partners/:code/edit" element={<PartnerCodeEditPage />} />
        <Route path="/partners/:code/stats" element={<PartnerCodeStatsPage />} />

        {/* Payment Routes */}
        <Route path="/payments/:client_name" element={<PaymentPage />} />
        <Route path="/invoices/:client_name" element={<InvoicesPage />} />
      </Routes>
    </Suspense>
  );
};

export default RoutesContent;
