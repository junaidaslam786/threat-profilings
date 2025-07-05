import { configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { combineReducers } from "redux";

import userReducer from "./slices/userSlice";
import orgSubscriptionReducer from "./slices/orgSubscriptionSlice";

import { userApi } from "./api/userApi";
import { orgSubscriptionApi } from "./api/orgSubscriptionApi";

const rootReducer = combineReducers({
  user: userReducer,
  orgSubscription: orgSubscriptionReducer,
  [userApi.reducerPath]: userApi.reducer,
  [orgSubscriptionApi.reducerPath]: orgSubscriptionApi.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      orgSubscriptionApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export default store;
