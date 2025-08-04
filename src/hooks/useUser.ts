import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../Redux/store";
import type { RootState } from "../Redux/store";
import { useGetProfileQuery } from "../Redux/api/userApi";
import { setUserDetails, logoutUser } from "../Redux/slices/userSlice";

export function useUser() {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state: RootState) => state.user);
  const { refetch: fetchUser } = useGetProfileQuery();

  useEffect(() => {
    if (!user && !isLoading) {
      fetchUser()
        .unwrap()
        .then((data) => dispatch(setUserDetails(data)))
        .catch(() => {
          dispatch(logoutUser());
        });
    }
  }, [user, isLoading, fetchUser, dispatch]);

  const isAdmin = user?.role === "admin";
  const isLEAdmin = user?.role === "runner";
  const isViewer = user?.role === "viewer";

  return {
    user,
    isLoading,
    isAdmin,
    isLEAdmin,
    isViewer,
  };
}
