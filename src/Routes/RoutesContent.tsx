import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import OrganizationManagement from "../Pages/Organizations/OrganizationManagement";
const LoadingScreen = lazy(() => import("../components/Common/LoadingScreen"));
const AuthRedirectHandlerPage = lazy(() => import("../Pages/Auth/AuthRedirectHandlerPage"));
const CreateOrganization = lazy(() => import("../Pages/Organizations/CreateOrganization"));
const CreateLEOrganization = lazy(() => import("../Pages/Organizations/CreateLEOrganization"));
const Dashboard = lazy(() => import("../Pages/Dashboard/Dashboard"));
const AdminLogin = lazy(() => import("../Pages/Admin/AdminLogin"));
const AdminApprovalRequests = lazy(() => import("../Pages/Admin/AdminApprovalRequests"));

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
        <Route path="/user/organization/create" element={<CreateOrganization />} />
        <Route path="/user/organization/create/le" element={<CreateLEOrganization />} />
        <Route path="/auth-redirect-handler" element={<AuthRedirectHandlerPage />} />
        <Route path="/admin/approval-requests" element={<AdminApprovalRequests />} />
        <Route path="/admin/organization-management" element={<OrganizationManagement />} />
      </Routes>
    </Suspense>
  );
};

export default RoutesContent;
