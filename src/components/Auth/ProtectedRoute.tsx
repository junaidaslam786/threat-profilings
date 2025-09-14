import React, { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { hasRequiredRole } from "../../utils/roleUtils";
import LoadingScreen from "../Common/LoadingScreen";
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
  const { user, isLoading, hydrated, hasBothTokens } = useUser();
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
      !hasBothTokens
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
  }, [isLoading, hydrated, requireAuth, requireActive, hasBothTokens, user, requiredRoles]);

  if (isLoading || !hydrated) {
    return (
      <div className="w-screen h-screen flex flex-row justify-center items-center">
        <LoadingScreen />
      </div>
    );
  }

  // If user not found but has both tokens, redirect to organization creation
  if (requireAuth && !user && hasBothTokens) {
    return <Navigate to="/user/organization/create" replace />;
  }

  // If user doesn't have both tokens, redirect to custom auth page
  if (requireAuth && !hasBothTokens) {
    return <Navigate to="/home" replace />;
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
