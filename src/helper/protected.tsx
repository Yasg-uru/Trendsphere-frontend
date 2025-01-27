import { useAuthContext } from "@/contexts/authContext.context";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, authUser } = useAuthContext();
  console.log("this is is authenticated", isAuthenticated);
  console.log("this is authuser", authUser);
  useEffect(() => {
    if (!isAuthenticated || !authUser) {
      navigate("/Sign-in");
    } else if (!allowedRoles.includes(authUser.Role || "")) {
      navigate("/access-denied");
    }
  }, [isAuthenticated, authUser, navigate, allowedRoles]);

  return <>{isAuthenticated ? children : null}</>;
};

export default ProtectedRoute;
