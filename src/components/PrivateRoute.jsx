import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const user = useSelector((state) => state.user.email); // Check if user is logged in

  return user ? children : <Navigate to="/signin" />; // Redirect to sign-in if not authenticated
};

export default PrivateRoute;
