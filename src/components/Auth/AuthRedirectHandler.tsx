import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { setAuthTokens } from "../../utils/cookieHelpers";

const checkUserLevel = async (idToken: string): Promise<string | null> => {
  try {
    const platformResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/platform-admin/me`, {
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (platformResponse.ok) {
      const data = await platformResponse.json();
      return data.level || null;
    }
    
    const userResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (userResponse.ok) {
      const data = await userResponse.json();
      return data.level || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error checking user level:', error);
    return null;
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

          const userLevel = await checkUserLevel(idToken);
          
          if (userLevel === "super") {
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
        
        const existingIdToken = Cookies.get("id_token");
        if (existingIdToken) {
          const userLevel = await checkUserLevel(existingIdToken);
          if (userLevel === "super") {
            navigate("/platform-admins", { replace: true });
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
