import { configureStore, combineReducers, Middleware } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authSlice, { Logout } from "./slices/authSlice";
import productSlice from "./slices/productSlice";
import orderSlice from "./slices/orderSlice";
import deliverySlice from "./slices/deliverySlice";
import Cookies from "js-cookie";
import { isTokenExpired } from "@/utils/auth.utils";
const tokenValidationMiddleware: Middleware = (store) => (next) => (action) => {
  const token = Cookies.get("token");
  if (!token || isTokenExpired()) {
    store.dispatch(Logout() as any);
  }
  return next(action);
};
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "product", "delivery"],
};

const rootReducer = combineReducers({
  auth: authSlice,
  product: productSlice,
  order: orderSlice,
  delivery: deliverySlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(tokenValidationMiddleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
