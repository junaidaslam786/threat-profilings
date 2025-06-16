import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
const LoadingScreen = lazy(() => import("../components/Common/LoadingScreen"));
const SignIn = lazy(() => import("../Pages/Auth/SignIn"));
const SignUp = lazy(() => import("../Pages/Auth/SignUp"));
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
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/approval-requests" element={<AdminApprovalRequests />} />
      </Routes>
    </Suspense>
  );
};

export default RoutesContent;
