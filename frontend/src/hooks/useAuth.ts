import { redirect } from "next/navigation";
import React from "react";

const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

const useAuth = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    redirect("/auth/login");
  };
  return { handleLogout };
};

export default useAuth;
export { isLoggedIn };
