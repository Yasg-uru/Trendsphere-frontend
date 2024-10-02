import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authSlice from "./slices/authSlice";
import productSlice from "./slices/productSlice";
import orderSlice from "./slices/orderSlice";
import deliverySlice from "./slices/deliverySlice";
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "product"],
};

const rootReducer = combineReducers({
  auth: authSlice,
  product: productSlice,
  order:orderSlice,
  delivery:deliverySlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
