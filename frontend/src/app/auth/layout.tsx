import { Footer } from "@/components/footer";
import { Stack } from "@chakra-ui/react";
import React from "react";

const AuthLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="flex flex-col min-h-screen">
      {" "}
      <div className="flex justify-center flex-grow">
        {" "}
        <Stack spacing={1} align="center" justify="center">
          <img src="/assets/logo.png" alt="logo" width="300" />
          <main>{children}</main>
        </Stack>
      </div>
      <div className="pt-10">
        <Footer />
      </div>
    </div>
  );
};

export default AuthLayout;
