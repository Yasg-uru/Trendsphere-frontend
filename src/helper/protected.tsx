import { useAuthContext } from "@/contexts/authContext.context";
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, authUser, isLoading } = useAuthContext();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated ) {
        navigate("/Sign-in", {replace:true });
      } else if ( authUser &&!allowedRoles.includes(authUser.Role || "")) {
        navigate("/access-denied");
      } else {
        setChecked(true); // User is allowed
      }
    }
  }, [isAuthenticated, authUser, isLoading, allowedRoles, navigate]);

  if (isLoading || !checked) {
    return <div>Loading...</div>; // Use a real spinner if needed
  }

  return <>{children}</>;
};

export default ProtectedRoute;
