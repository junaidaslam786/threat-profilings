import React, { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { hasRequiredRole } from "../../utils/roleUtils";
import { toast } from "react-hot-toast";
import { validateAndCleanupTokens } from "../../utils/tokenValidator";

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

  // Validate tokens on mount and periodically
  useEffect(() => {
    if (requireAuth && hydrated) {
      const validateTokens = async () => {
        const isValid = await validateAndCleanupTokens();
        if (!isValid) {
          // Tokens were invalid and cleaned up, component will re-render
          // and user will be redirected to auth due to !hasBothTokens
          return;
        }
      };
      
      validateTokens();
      
      // Set up periodic token validation (every 5 minutes)
      const interval = setInterval(validateTokens, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [requireAuth, hydrated]);

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

  // If user doesn't have both tokens, redirect to custom auth page immediately
  if (requireAuth && !hasBothTokens) {
    return <Navigate to="/auth" replace />;
  }

  if (isLoading || !hydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <div className="relative mb-6">
            <div className="w-12 h-12 border-4 border-primary-600/30 border-t-primary-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-primary-300/50 rounded-full animate-spin animation-delay-75"></div>
          </div>
          <div className="space-y-2">
            <p className="text-primary-300 font-medium">
              Loading your content...
            </p>
            <div className="w-32 h-1 bg-secondary-700 rounded-full overflow-hidden">
              <div className="h-full bg-primary-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-secondary-400 text-xs">This won't take long</p>
          </div>
        </div>
      </div>
    );
  }

  // If user not found but has both tokens, redirect to organization creation
  if (requireAuth && !user && hasBothTokens) {
    return <Navigate to="/user/organization/create" replace />;
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
