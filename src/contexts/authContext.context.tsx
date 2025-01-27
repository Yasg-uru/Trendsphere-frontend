import axiosInstance from "@/helper/axiosinstance";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types/authState/initialState";
import React, { createContext, useEffect, useState } from "react";

interface authContextProps {
  isAuthenticated: boolean;
  authUser: User | null;
  isLoading: boolean;
  CheckAuth: () => void;
  logout: () => void;
}

export const authContext = createContext<authContextProps | null>(null);

interface authProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FunctionComponent<authProviderProps> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const { toast } = useToast();
  // Check authentication status
  const CheckAuth = async (): Promise<void> => {
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/user/user/${token}`, {
        withCredentials: true,
      });
      toast({
        title: "fetched user details successfully",
      });
      const { user } = response.data;

      setAuthUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      toast({
        title: "failed to fetch user details",
        variant: "destructive",
      });
      console.error("Authentication failed", error);
      setIsAuthenticated(false);
      setAuthUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Log out functionality
  const logout = () => {
    setIsAuthenticated(false);
    setAuthUser(null);
    setToken(null);
    localStorage.removeItem("token"); // Remove token from localStorage
  };

  useEffect(() => {
    // Automatically check authentication when the component mounts
    if (token) {
      CheckAuth();
    } 
  }, [token]); // Runs whenever the token changes

  // If the token changes, store it in localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

  return (
    <authContext.Provider
      value={{ authUser, isAuthenticated, isLoading, CheckAuth, logout }}
    >
      {children}
    </authContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = React.useContext(authContext);
  if (context === null) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};

export default AuthProvider;
