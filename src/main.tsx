import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Provider } from "react-redux";
import { persistor, store } from "./state-manager/store.ts";
import { Toaster } from "@/components/ui/toaster";
import { PersistGate } from "redux-persist/integration/react";
import AuthProvider from "./contexts/authContext.context.tsx";
createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <BrowserRouter>
            <Toaster />
            <App />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </PersistGate>
  </Provider>
);
