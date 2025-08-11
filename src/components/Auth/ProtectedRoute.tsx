import React, { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { hasRequiredRole } from "../../utils/roleUtils";
import LoadingScreen from "../Common/LoadingScreen";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: Array<"admin" | "viewer" | "runner" | "platform_admin" | "super_admin" | "LE_ADMIN">;
  requireAuth?: boolean;
  requireActive?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  requireAuth = true,
  requireActive = true,
}) => {
  const { user, isLoading, hydrated } = useUser();
  const hasAuthToken = !!Cookies.get("id_token");
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (isLoading || !hydrated) {
      hasShownToast.current = false;
      return;
    }
    
    // Only show toasts when we're sure about the authentication state
    if (
      requireAuth &&
      !hasShownToast.current &&
      hydrated &&
      !isLoading &&
      (!hasAuthToken || !user)
    ) {
      toast.error("You must be logged in to access this page.");
      hasShownToast.current = true;
    } else if (
      requireActive &&
      user &&
      user.user_info.status !== "active" &&
      !hasShownToast.current &&
      hydrated &&
      !isLoading
    ) {
      toast.error("Your account is not active. Awaiting approval.");
      hasShownToast.current = true;
    } else if (
      requiredRoles.length > 0 &&
      user &&
      !hasRequiredRole(user, requiredRoles) &&
      !hasShownToast.current &&
      hydrated &&
      !isLoading
    ) {
      toast.error("You do not have permission to access this page.");
      hasShownToast.current = true;
    }
  }, [isLoading, hydrated, requireAuth, requireActive, hasAuthToken, user, requiredRoles]);

  if (isLoading || !hydrated) {
    return (
      <div className="w-screen h-screen flex flex-row justify-center items-center">
        <LoadingScreen />
      </div>
    );
  }

  if (requireAuth && (!hasAuthToken || !user)) {
    return <Navigate to="/dashboard" replace />;
  }
  if (requireActive && user && user.user_info.status !== "active") {
    return <Navigate to="/dashboard" replace />;
  }
  if (requiredRoles.length > 0 && user && !hasRequiredRole(user, requiredRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
