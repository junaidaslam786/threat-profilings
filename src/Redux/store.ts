import { configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { combineReducers } from "redux";

import organizationsReducer from "./slices/organizationsSlice";
import partnersReducer from "./slices/partnersSlice";
import paymentsReducer from "./slices/paymentsSlice";
import platformAdminReducer from "./slices/platformAdminSlice";
import rolesReducer from "./slices/rolesSlice";
import subscriptionsReducer from "./slices/subscriptionsSlice";
import tiersReducer from "./slices/tiersSlice";
import userReducer from "./slices/userSlice";

import { organizationsApi } from "./api/organizationsApi";
import { partnersApi } from "./api/partnersApi";
import { paymentsApi } from "./api/paymentsApi";
import { platformAdminApi } from "./api/platformAdminApi";
import { tiersApi } from "./api/tiersApi";
import { rolesApi } from "./api/rolesApi";
import { subscriptionsApi } from "./api/subscriptionsApi";
import { userApi } from "./api/userApi";

const rootReducer = combineReducers({
  organizations: organizationsReducer,
  partners: partnersReducer,
  payments: paymentsReducer,
  platformAdmin: platformAdminReducer,
  roles: rolesReducer,
  subscriptions: subscriptionsReducer,
  tiers: tiersReducer,
  user: userReducer,
  [organizationsApi.reducerPath]: organizationsApi.reducer,
  [partnersApi.reducerPath]: partnersApi.reducer,
  [paymentsApi.reducerPath]: paymentsApi.reducer,
  [platformAdminApi.reducerPath]: platformAdminApi.reducer,
  [rolesApi.reducerPath]: rolesApi.reducer,
  [subscriptionsApi.reducerPath]: subscriptionsApi.reducer,
  [tiersApi.reducerPath]: tiersApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      organizationsApi.middleware,
      partnersApi.middleware,
      paymentsApi.middleware,
      platformAdminApi.middleware,
      rolesApi.middleware,
      subscriptionsApi.middleware,
      tiersApi.middleware,
      userApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export default store;
