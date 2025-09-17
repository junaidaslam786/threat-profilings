import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthTokens, monitorTokenStability, getIdToken, getAccessToken } from "../../utils/authStorage";
import { isPlatformAdmin } from "../../utils/roleUtils";
import type { UserMeResponse } from "../../Redux/slices/userSlice";

const checkUserDetails = async (
  idToken: string
): Promise<{ user: UserMeResponse | null; userNotFound: boolean }> => {
  try {
    // First try to fetch user details from the standard users/me endpoint
    const userResponse = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/users/me`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (userResponse.ok) {
      const userData = await userResponse.json();
      return { user: userData, userNotFound: false };
    }

    // If user endpoint fails, check if it's a 404/401/403 which indicates user not found
    const userNotFound = userResponse.status === 404 || userResponse.status === 401 || userResponse.status === 403;
    return { user: null, userNotFound };
  } catch (error) {
    console.error("Error checking user details:", error);
    return { user: null, userNotFound: false };
  }
};

const AuthRedirectHandler: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      const hash = window.location.hash;
      if (hash) {
        const params = new URLSearchParams(hash.substring(1));
        const idToken = params.get("id_token");
        const accessToken = params.get("access_token");

        if (idToken && accessToken) {
          setAuthTokens(idToken, accessToken);
          
          // Start monitoring token stability to catch any premature removal
          monitorTokenStability();

          const userResult = await checkUserDetails(idToken);

          if (userResult.userNotFound) {
            navigate("/user/organization/create", { replace: true });
          } else if (userResult.user && isPlatformAdmin(userResult.user)) {
            navigate("/platform-admins", { replace: true });
          } else {
            navigate("/", { replace: true });
          }

          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        } else {
          navigate("/auth");
        }
      } else {
        console.log(
          "No hash found in URL. This component should only be hit after Cognito redirect."
        );

        const existingIdToken = getIdToken();
        const existingAccessToken = getAccessToken();
        
        if (existingIdToken && existingAccessToken) {
          const userResult = await checkUserDetails(existingIdToken);
          if (userResult.userNotFound) {
            navigate("/user/organization/create", { replace: true });
            return;
          } else if (userResult.user && isPlatformAdmin(userResult.user)) {
            navigate("/platform-admins", { replace: true });
            return;
          } else {
            navigate("/", { replace: true });
            return;
          }
        }
        navigate("/user/organization/create");
      }
    };

    handleAuthRedirect();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <p>Processing authentication redirect...</p>
    </div>
  );
};

export default AuthRedirectHandler;
