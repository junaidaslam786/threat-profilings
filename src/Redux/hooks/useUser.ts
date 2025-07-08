// src/hooks/useUser.ts
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import type { RootState } from "../store";

import { useGetProfileMutation } from "../api/userApi";

import { setUserDetails, logoutUser } from "../slices/userSlice";
import toast from "react-hot-toast";

export function useUser() {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state: RootState) => state.user);
  const [fetchUser] = useGetProfileMutation();

  useEffect(() => {
    if (!user && !isLoading) {
      fetchUser()
        .unwrap()
        .then((data) => dispatch(setUserDetails(data)))
        .catch(() => {
          dispatch(logoutUser());
          toast.error("Session expired. Please sign in again.");
        });
    }
  }, [user, isLoading, fetchUser, dispatch]);

  const isAdmin = user?.role === ("admin" as string);
  const isLEAdmin = user?.role === ("le_admin" as string);
  const isViewer = user?.role === ("viewer" as string);

  return {
    user,
    isLoading,
    isAdmin,
    isLEAdmin,
    isViewer,
  };
}
