import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const location = useLocation();

  const isAuthenticated = Boolean(localStorage.getItem("authToken"));

  return isAuthenticated ? (
    children
  ) : (
    <Navigate
      to="/"
      replace
      state={{
        openLogin: true,
        from: location.pathname,
      }}
    />
  );
};

export default PrivateRoute;