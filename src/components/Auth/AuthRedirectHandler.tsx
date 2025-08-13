import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { setAuthTokens } from "../../utils/cookieHelpers";

const checkUserLevel = async (
  idToken: string
): Promise<{ level: string | null; userNotFound: boolean }> => {
  try {
    const platformResponse = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/platform-admin/me`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (platformResponse.ok) {
      const data = await platformResponse.json();
      return { level: data.level || null, userNotFound: false };
    }

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
      const data = await userResponse.json();
      return { level: data.level || null, userNotFound: false };
    }

    const userNotFound =
      (platformResponse.status === 404 || platformResponse.status === 401) &&
      (userResponse.status === 404 || userResponse.status === 401);

    return { level: null, userNotFound };
  } catch (error) {
    console.error("Error checking user level:", error);
    return { level: null, userNotFound: false };
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

          const userResult = await checkUserLevel(idToken);

          if (userResult.userNotFound) {
            navigate("/user/organization/create", { replace: true });
          } else if (userResult.level === "super") {
            navigate("/platform-admins", { replace: true });
          } else {
            navigate("/dashboard", { replace: true });
          }

          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        } else {
          console.warn("ID token or Access token not found in URL hash.");
          navigate("/login");
        }
      } else {
        console.log(
          "No hash found in URL. This component should only be hit after Cognito redirect."
        );

        // Check if user has both tokens
        const existingIdToken = Cookies.get("id_token");
        const existingAccessToken = Cookies.get("access_token");
        
        if (existingIdToken && existingAccessToken) {
          const userResult = await checkUserLevel(existingIdToken);
          if (userResult.userNotFound) {
            // User not found but has tokens - redirect to organization creation
            navigate("/user/organization/create", { replace: true });
            return;
          } else if (userResult.level === "super") {
            navigate("/platform-admins", { replace: true });
            return;
          } else {
            // User found and has tokens - redirect to dashboard
            navigate("/dashboard", { replace: true });
            return;
          }
        }

        // No tokens found - redirect to organization creation as fallback
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
