import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../Redux/store";
import type { RootState } from "../Redux/store";
import { useGetProfileQuery } from "../Redux/api/userApi";
import { setUserDetails, logoutUser, setLoading } from "../Redux/slices/userSlice";
import {
  isPlatformAdmin as checkPlatformAdmin,
  isSuperAdmin as checkSuperAdmin,
  isAdmin as checkAdmin,
  isLEAdmin as checkLEAdmin,
  isViewer as checkViewer,
  isRunner as checkRunner,
} from "../utils/roleUtils";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { extractErrorMessage } from "../utils/errorHandling";
import { hasAuthTokens } from "../utils/cookieHelpers";

export function useUser() {
  const dispatch = useAppDispatch();
  const { user, isLoading: userLoading } = useAppSelector((state: RootState) => state.user);

  // Check if user has both auth tokens
  const hasAuthToken = !!Cookies.get("id_token");
  const hasBothTokens = hasAuthTokens();

  // Only fetch profile if we have a token and don't have user data
  const shouldSkip = !hasAuthToken || !!user;

  const {
    data: profileData,
    isLoading: queryLoading,
    isFetching,
    error,
    refetch,
  } = useGetProfileQuery(undefined, {
    skip: shouldSkip,
  });

  // Hydrated means we've attempted to fetch user profile at least once
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (!hasAuthToken || user || (!queryLoading && !isFetching)) {
      setHydrated(true);
    }
  }, [hasAuthToken, user, queryLoading, isFetching]);

  const isLoading = userLoading || (hasAuthToken && queryLoading && !user);

  useEffect(() => {
    // Set loading state when starting to fetch
    if (hasAuthToken && !user && !queryLoading) {
      dispatch(setLoading(true));
    }
  }, [hasAuthToken, user, queryLoading, dispatch]);

  useEffect(() => {
    if (profileData) {
      dispatch(setUserDetails(profileData));
    }
  }, [profileData, dispatch]);

  useEffect(() => {
    if (error) {
      const msg = extractErrorMessage(error) || "Failed to fetch user profile.";
      toast.error(msg);
      console.error("Failed to fetch user profile:", error);
      dispatch(logoutUser());
    }
  }, [error, dispatch]);

  // If no auth token, clear user data
  useEffect(() => {
    if (!hasAuthToken && user) {
      dispatch(logoutUser());
    }
  }, [hasAuthToken, user, dispatch]);

  return {
    user,
    isLoading,
    hydrated,
    isAdmin: checkAdmin(user),
    isLEAdmin: checkLEAdmin(user),
    isViewer: checkViewer(user),
    isRunner: checkRunner(user),
    isPlatformAdmin: checkPlatformAdmin(user),
    isSuperAdmin: checkSuperAdmin(user),
    refetch,
    hasBothTokens,
  };
}
