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

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const CheckAuth = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/user/me`, { withCredentials: true });

      toast({ title: "Fetched user details successfully" });
      setAuthUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      toast({ title: "Failed to fetch user details", description:"please login to continue ", variant: "destructive" });
      console.error("Authentication failed", error);
      setAuthUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    CheckAuth();
  }, []);

  const logout = () => {
    setAuthUser(null);
    setIsAuthenticated(false);
  };

  const UserLogin = async (data: z.infer<typeof signInSchema>): Promise<void> => {
  setIsLoading(true);
  return dispatch(Login(data))
    .unwrap()
    .then((data) => {
      setAuthUser(data.user);
      setIsAuthenticated(true);
      CheckAuth();
    })
    .catch((error) => {
      console.error("Login error:", error);
      return Promise.reject(error); // Required so SignInForm can use it
    })
    .finally(() => {
      setIsLoading(false);
    });
};


  return (
    <authContext.Provider
      value={{
        authUser,
        isAuthenticated,
        isLoading,
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
