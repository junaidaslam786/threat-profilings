import { configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  // client: clientReducer,
  // [authApi.reducerPath]: authApi.reducer,
  //   [clientApi.reducerPath]: clientApi.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat
      // authApi.middleware,
      (),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export default store;
