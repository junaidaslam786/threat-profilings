import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
const LoadingScreen = lazy(() => import("../components/Common/LoadingScreen"));
const AuthRedirectHandlerPage = lazy(
  () => import("../Pages/Auth/AuthRedirectHandlerPage")
);
const Dashboard = lazy(() => import("../Pages/Dashboard/Dashboard"));
const AdminLogin = lazy(() => import("../Pages/Admin/AdminLogin"));
const AdminPendingJoinRequests = lazy(
  () => import("../Pages/Admin/AdminPendingJoinRequests")
);
const AdminInviteUser = lazy(() => import("../Pages/Admin/AdminInviteUser"));
const OrganizationListPage = lazy(
  () => import("../Pages/Organizations/OrganizationListPage")
);
const OrganizationDetailPage = lazy(
  () => import("../Pages/Organizations/OrganizationDetailPage")
);
const RoleListPage = lazy(() => import("../Pages/Roles/RoleListPage"));
const RoleDetailPage = lazy(() => import("../Pages/Roles/RoleDetailPage"));
const SubscriptionDetailPage = lazy(
  () => import("../Pages/Subscriptions/SubscriptionDetailPage")
);
const SubscriptionCreate = lazy(
  () => import("../Pages/Subscriptions/SubscriptionCreate")
);
const TierListPage = lazy(() => import("../Pages/Tiers/TierListPage"));
const TierDetailPage = lazy(() => import("../Pages/Tiers/TierDetailPage"));
const RegisterPage = lazy(() => import("../Pages/Users/RegisterPage"));
const JoinOrgRequestPage = lazy(
  () => import("../Pages/Users/JoinOrgRequestPage")
);
const ProfilePage = lazy(() => import("../Pages/Users/ProfilePage"));

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
      </Routes>
    </Suspense>
  );
};

export default RoutesContent;
