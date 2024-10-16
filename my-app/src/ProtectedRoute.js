import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import MainNavigation from "./components/Layout/MainNavigation";

// Function to check if user is authenticated by verifying the presence of a token
const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  return token ? <> <MainNavigation/> <Outlet /> </> : <Navigate to="/auth" />;
};

export default ProtectedRoute;