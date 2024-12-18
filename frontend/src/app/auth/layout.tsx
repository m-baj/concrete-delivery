import { Stack } from "@chakra-ui/react";
import React from "react";

const AuthLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="flex justify-center ">
      <Stack spacing={1} align="center">
        <img src="/assets/logo.png" alt="logo" width="300" />
        {children}
      </Stack>
    </div>
  );
};

export default AuthLayout;
