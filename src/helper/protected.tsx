import { useAuthContext } from "@/contexts/authContext.context";
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute: React.FC<{ children:ReactNode,
  allowedRoles:string[];}> = ({
  children,
  allowedRoles,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, authUser, isLoading } = useAuthContext();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !authUser) {
        navigate("/Sign-in");
      } 
      // else if (!allowedRoles.includes(authUser.Role || "")) {
      //   navigate("/access-denied");
      // }
    }
  }, [isAuthenticated, authUser, navigate, allowedRoles]);

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading spinner or message
  }

  return <>{isAuthenticated ? children : null}</>;
};
export default ProtectedRoute;