import axiosInstance from "@/helper/axiosinstance";
import { useToast } from "@/hooks/use-toast";
import { signInSchema } from "@/pages/mainpages/authpages/login";
import { useAppDispatch } from "@/state-manager/hook";
import { Login } from "@/state-manager/slices/authSlice";
import { User } from "@/types/authState/initialState";
import React, { createContext, useEffect, useState } from "react";
import { z } from "zod";

interface authContextProps {
  isAuthenticated: boolean;
  authUser: User | null;
  isLoading: boolean;
  CheckAuth: () => void;
  logout: () => void;
  UserLogin: (data: z.infer<typeof signInSchema>) => Promise<void>;
}

export const authContext = createContext<authContextProps | null>(null);

interface authProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FunctionComponent<authProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  // Load stored user from localStorage
  const storedUser = localStorage.getItem("authUser");
  const storedAuth = localStorage.getItem("isAuthenticated");

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    storedAuth ? JSON.parse(storedAuth) : false
  );
  const [authUser, setAuthUser] = useState<User | null>(
    storedUser ? JSON.parse(storedUser) : null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Check authentication status
  const CheckAuth = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/user/me`, { withCredentials: true });

      toast({ title: "Fetched user details successfully" });

      setAuthUser(response.data);
      setIsAuthenticated(true);

      // Store user data in localStorage
      localStorage.setItem("authUser", JSON.stringify(response.data));
      localStorage.setItem("isAuthenticated", JSON.stringify(true));
    } catch (error) {
      toast({ title: "Failed to fetch user details", variant: "destructive" });
      console.error("Authentication failed", error);
      setIsAuthenticated(false);
      setAuthUser(null);

      // Remove user data from localStorage
      localStorage.removeItem("authUser");
      localStorage.removeItem("isAuthenticated");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    CheckAuth();
  }, []);

  // Log out functionality
  const logout = () => {
    setIsAuthenticated(false);
    setAuthUser(null);

    // Clear user data from localStorage
    localStorage.removeItem("authUser");
    localStorage.removeItem("isAuthenticated");
  };

  const UserLogin = async (data: z.infer<typeof signInSchema>): Promise<void> => {
    setIsLoading(true);
    dispatch(Login(data))
      .unwrap()
      .then((data) => {
        setAuthUser(data.user);
        setIsAuthenticated(true);
        CheckAuth();
      })
      .catch((error) => Promise.reject(error))
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <authContext.Provider value={{ authUser, isAuthenticated, isLoading, CheckAuth, logout, UserLogin }}>
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
