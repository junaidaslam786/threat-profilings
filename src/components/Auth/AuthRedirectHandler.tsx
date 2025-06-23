import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const AuthRedirectHandler: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthRedirect = () => {
      const hash = window.location.hash;
      if (hash) {
        const params = new URLSearchParams(hash.substring(1));
        const idToken = params.get("id_token");
        const accessToken = params.get("access_token");
        const expiresIn = params.get("expires_in");

        if (idToken && accessToken) {
          const expires = expiresIn
            ? new Date(Date.now() + parseInt(expiresIn) * 1000)
            : undefined;

          Cookies.set("id_token", idToken, {
            expires,
            secure: true,
            sameSite: "Lax",
          });
          Cookies.set("access_token", accessToken, {
            expires,
            secure: true,
            sameSite: "Lax",
          });

          navigate("/dashboard", { replace: true });

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
