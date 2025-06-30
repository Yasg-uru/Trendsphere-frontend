import { useAuthContext } from "@/contexts/authContext.context";
import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "@/helper/Loader";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[]; // Made optional
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [], // Default empty array
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    isAuthenticated, 
    authUser, 
    isLoading, 
    isInitialized // Get from context
  } = useAuthContext();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Only check auth when initialization is complete
    if (isInitialized) {
      if (!isAuthenticated) {
        // Redirect to login with return location
        navigate("/sign-in", { 
          replace: true, 
          state: { from: location.pathname } 
        });
        return;
      }

      // Check roles only if specified
      if (allowedRoles.length > 0 && authUser && !allowedRoles.includes(authUser.Role)) {
        navigate("/access-denied", { replace: true });
        return;
      }

      // All checks passed
      setIsAuthorized(true);
    }
  }, [isAuthenticated, authUser, isInitialized, allowedRoles, navigate, location]);

  // Show loader during initial auth check
  if (isLoading || !isInitialized) {
    return <Loader />;
  }

  // Don't render anything during redirect
  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;