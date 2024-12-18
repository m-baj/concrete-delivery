"use client";
import { Button } from "@chakra-ui/react";
import React from "react";
import useAuth from "@/hooks/useAuth";

const LogoutButton = () => {
  const { handleLogout } = useAuth();
  return (
    <Button onClick={handleLogout} border="1px">
      {" "}
      Log out
    </Button>
  );
};

export default LogoutButton;
