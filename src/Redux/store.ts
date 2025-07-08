import { configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { combineReducers } from "redux";

import userReducer from "./slices/userSlice";
import organizationsReducer from "./slices/organizationsSlice";
import rolesReducer from "./slices/rolesSlice";
import subscriptionsReducer from "./slices/subscriptionsSlice";
import tiersReducer from "./slices/tiersSlice";

import { userApi } from "./api/userApi";
import { organizationsApi } from "./api/organizationsApi";
import { tiersApi } from "./api/tiersApi";
import { rolesApi } from "./api/rolesApi";
import { subscriptionsApi } from "./api/subscriptionsApi";

const rootReducer = combineReducers({
  user: userReducer,
  organizations: organizationsReducer,
  roles: rolesReducer,
  subscriptions: subscriptionsReducer,
  tiers: tiersReducer,
  [userApi.reducerPath]: userApi.reducer,
  [organizationsApi.reducerPath]: organizationsApi.reducer,
  [rolesApi.reducerPath]: rolesApi.reducer,
  [subscriptionsApi.reducerPath]: subscriptionsApi.reducer,
  [tiersApi.reducerPath]: tiersApi.reducer,

});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      organizationsApi.middleware,
      rolesApi.middleware,
      subscriptionsApi.middleware,
      tiersApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export default store;
