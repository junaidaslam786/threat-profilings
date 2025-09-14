export const debugAuth = () => {
  const idToken = localStorage.getItem("id_token");
  const accessToken = localStorage.getItem("access_token");

  const isValidJWT = (token: string) => {
    try {
      const parts = token.split(".");
      return parts.length === 3;
    } catch {
      return false;
    }
  };

  return {
    hasIdToken: !!idToken,
    hasAccessToken: !!accessToken,
    idTokenValid: idToken ? isValidJWT(idToken) : false,
    accessTokenValid: accessToken ? isValidJWT(accessToken) : false,
  };
};

if (typeof window !== "undefined") {
  (window as unknown as { debugAuth: typeof debugAuth }).debugAuth = debugAuth;
}
