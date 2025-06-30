import axiosInstance from "@/helper/axiosinstance";
import { useToast } from "@/hooks/use-toast";
import { signInSchema } from "@/pages/mainpages/authpages/login";
import { useAppDispatch } from "@/state-manager/hook";
import { Login, Logout } from "@/state-manager/slices/authSlice";
import { User } from "@/types/authState/initialState";
import React, { createContext, useEffect, useState } from "react";
import { z } from "zod";

interface authContextProps {
  isAuthenticated: boolean;
  authUser: User | null;
  isLoading: boolean;
  isInitialized: boolean; // New flag to track initial auth check
  CheckAuth: () => Promise<void>;
  logout: () => Promise<void>;
  UserLogin: (data: z.infer<typeof signInSchema>) => Promise<void>;
}

export const authContext = createContext<authContextProps | null>(null);

const AuthProvider: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start as true
  const [isInitialized, setIsInitialized] = useState<boolean>(false); // New state

  const CheckAuth = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/user/me`, { withCredentials: true });
      setAuthUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      setAuthUser(null);
      setIsAuthenticated(false);
      console.error("Authentication check failed", error);
    } finally {
      setIsLoading(false);
      setIsInitialized(true); // Mark auth check as complete
    }
  };

  useEffect(() => {
    CheckAuth();
  }, []);

  const logout = async () => {
    try {
      setIsLoading(true);
      await dispatch(Logout()).unwrap();
      setAuthUser(null);
      setIsAuthenticated(false);
      toast({ title: "Logged out successfully" });
    } catch (error) {
      toast({
        title: "Logout failed",
        variant: "destructive",
        description: "There was an error while logging out"
      });
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const UserLogin = async (data: z.infer<typeof signInSchema>): Promise<void> => {
    setIsLoading(true);
    try {
      const result = await dispatch(Login(data)).unwrap();
      setAuthUser(result.user);
      setIsAuthenticated(true);
      await CheckAuth(); // Wait for auth check to complete
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <authContext.Provider
      value={{
        authUser,
        isAuthenticated,
        isLoading,
        isInitialized, // Include in context
        CheckAuth,
        logout,
        UserLogin,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = React.useContext(authContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};

export default AuthProvider;