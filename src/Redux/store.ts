import { configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { combineReducers, type Reducer } from "redux";

// Import all reducers
import userReducer from "./slices/userSlice";
import organizationsReducer from "./slices/organizationsSlice";
import platformAdminReducer from "./slices/platformAdminSlice";
import partnersReducer from "./slices/partnersSlice";
import paymentsReducer from "./slices/paymentsSlice";
import rolesReducer from "./slices/rolesSlice";
import subscriptionsReducer from "./slices/subscriptionsSlice";
import tiersReducer from "./slices/tiersSlice";

// Import all APIs
import { authApi } from "./api/authApi";
import { userApi } from "./api/userApi";
import { organizationsApi } from "./api/organizationsApi";
import { platformAdminApi } from "./api/platformAdminApi";
import { partnersApi } from "./api/partnersApi";
import { paymentsApi } from "./api/paymentsApi";
import { rolesApi } from "./api/rolesApi";
import { subscriptionsApi } from "./api/subscriptionsApi";
import { tiersApi } from "./api/tiersApi";
import { threatProfilingApi } from "./api/threatProfilingApi";

const coreReducers = {
  // Slice reducers
  user: userReducer,
  organizations: organizationsReducer,
  platformAdmin: platformAdminReducer,
  partners: partnersReducer,
  payments: paymentsReducer,
  roles: rolesReducer,
  subscriptions: subscriptionsReducer,
  tiers: tiersReducer,
  
  // API reducers
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [organizationsApi.reducerPath]: organizationsApi.reducer,
  [platformAdminApi.reducerPath]: platformAdminApi.reducer,
  [partnersApi.reducerPath]: partnersApi.reducer,
  [paymentsApi.reducerPath]: paymentsApi.reducer,
  [rolesApi.reducerPath]: rolesApi.reducer,
  [subscriptionsApi.reducerPath]: subscriptionsApi.reducer,
  [tiersApi.reducerPath]: tiersApi.reducer,
  [threatProfilingApi.reducerPath]: threatProfilingApi.reducer,
};

const lazyReducers: Record<string, Reducer> = {};

export const injectReducer = (key: string, reducer: Reducer) => {
  if (lazyReducers[key]) return;
  lazyReducers[key] = reducer;
  store.replaceReducer(combineReducers({ ...coreReducers, ...lazyReducers }));
};

export const injectApiSlice = (api: { reducerPath: string; reducer: Reducer; middleware: unknown }) => {
  if (lazyReducers[api.reducerPath]) return;
  
  lazyReducers[api.reducerPath] = api.reducer;
  store.replaceReducer(combineReducers({ ...coreReducers, ...lazyReducers }));
};

const store = configureStore({
  reducer: combineReducers(coreReducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(
      authApi.middleware,
      userApi.middleware,
      organizationsApi.middleware,
      platformAdminApi.middleware,
      partnersApi.middleware,
      paymentsApi.middleware,
      rolesApi.middleware,
      subscriptionsApi.middleware,
      tiersApi.middleware,
      threatProfilingApi.middleware
    ),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export default store;
