import { configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { combineReducers } from "redux";

import userOrganizationReducer from "./slices/userOrganizationSlice";
import userReducer from "./slices/userSlice";

import { userOrganizationApi } from "./api/userOrganizationApi";
import { userApi } from "./api/userApi";

const rootReducer = combineReducers({
  userOrganization: userOrganizationReducer,
  user: userReducer,
  [userOrganizationApi.reducerPath]: userOrganizationApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userOrganizationApi.middleware, userApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export default store;
