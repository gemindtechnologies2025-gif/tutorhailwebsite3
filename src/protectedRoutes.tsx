import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getFromStorage } from "./constants/storage";
import { STORAGE_KEYS } from "./constants/storageKeys";

const ProtectedRoutes: React.FC = () => {
  const token = getFromStorage(STORAGE_KEYS.token);
  let auth = !!token;
  return auth ? <Outlet /> : <Outlet />;
};

export default ProtectedRoutes;
