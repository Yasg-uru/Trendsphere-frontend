import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenExpired, getTokenPayload } from "@/utils/auth.utils";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const payload = getTokenPayload();

    if (isTokenExpired() || !payload) {
      navigate("/Sign-in");
    } else if (!allowedRoles.includes(payload.role || "")) {
      navigate("/access-denied");
    }
  }, [navigate, allowedRoles]);

  return <>{!isTokenExpired() && children}</>;
};

export default ProtectedRoute;
