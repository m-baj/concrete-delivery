"use client";
import { isLoggedIn } from "@/hooks/useAuth";
import React from "react";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const User = () => {
  if (!isLoggedIn()) {
    redirect("/auth/login");
  }

  const token = localStorage.getItem("token");
  if (!token) {
    redirect("/auth/login");
    return null;
  }
  const { sub } = jwtDecode(token);
  return <div></div>;
};

export default User;
