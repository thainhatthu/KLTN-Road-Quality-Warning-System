// components/PrivateRoute.tsx Private route use for user who already have an account can access.
import React from "react";
import { Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { accountState } from "../../atoms/authState";
import { getAccessToken, handleLogOut } from "../../utils/auth.util";

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
  const accessToken = getAccessToken();
  const account = useRecoilValue(accountState);

  React.useEffect(() => {
    if (!accessToken) {
      handleLogOut();
    }
  }, [accessToken]);

  const role = account?.role || localStorage.getItem("userRole");

  if (!role) {
    return null; // Hiển thị spinner hoặc component loading
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return <>{children}</>;
};


export default PrivateRoute;
