import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
interface PrivateRouteProps {
  children?: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user } = useAuth();

  console.log("user is", user);
  

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
export default PrivateRoute