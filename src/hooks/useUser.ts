import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../Redux/store";
import type { RootState } from "../Redux/store";
import { useGetProfileQuery } from "../Redux/api/userApi";
import { setUserDetails, logoutUser, setLoading } from "../Redux/slices/userSlice";
import {
  isPlatformAdmin as checkPlatformAdmin,
  isSuperAdmin as checkSuperAdmin,
  isOrgAdmin as checkOrgAdmin,
  isLEMaster as checkLEMaster,
  isOrgViewer as checkOrgViewer,
  isRunner as checkRunner,
  // Legacy compatibility
  isAdmin as checkAdmin,
  isLEAdmin as checkLEAdmin,
  isViewer as checkViewer,
} from "../utils/roleUtils";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { extractErrorMessage } from "../utils/errorHandling";
import { hasAuthTokens } from "../utils/cookieHelpers";

export function useUser() {
  const dispatch = useAppDispatch();
  const { user, isLoading: userLoading } = useAppSelector((state: RootState) => state.user);

  const hasAuthToken = !!Cookies.get("id_token");
  const hasBothTokens = hasAuthTokens();

  const shouldSkip = !hasAuthToken || !!user;

  const {
    data: profileData,
    isLoading: queryLoading,
    isFetching,
    error,
    refetch,
    isUninitialized,
  } = useGetProfileQuery(undefined, {
    skip: shouldSkip,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (!hasAuthToken || user || (!queryLoading && !isFetching)) {
      setHydrated(true);
    }
  }, [hasAuthToken, user, queryLoading, isFetching]);

  const isLoading = userLoading || (hasAuthToken && queryLoading && !user);

  useEffect(() => {
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
      dispatch(logoutUser());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (!hasAuthToken && user) {
      dispatch(logoutUser());
    }
  }, [hasAuthToken, user, dispatch]);

  return {
    user,
    isLoading,
    hydrated,
    // New role functions with clear names
    isOrgAdmin: checkOrgAdmin(user),
    isLEMaster: checkLEMaster(user),
    isOrgViewer: checkOrgViewer(user),
    isRunner: checkRunner(user),
    isPlatformAdmin: checkPlatformAdmin(user),
    isSuperAdmin: checkSuperAdmin(user),
    // Legacy compatibility
    isAdmin: checkAdmin(user),
    isLEAdmin: checkLEAdmin(user),
    isViewer: checkViewer(user),
    refetch: () => {
      // Only refetch if the query is not skipped/uninitialized
      if (!shouldSkip && !isUninitialized) {
        return refetch();
      }
      return Promise.resolve({ data: user });
    },
    hasBothTokens,
  };
}
