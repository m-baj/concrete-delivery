"use client";
import { Footer } from "@/components/footer";
import NavBar from "@/components/navBar";
import React from "react";
import { useParams } from "next/navigation";

const UserLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const params = useParams();
  console.log(params);
  const accountType = params["account-type"] as "user" | "courier" | "admin";
  return (
    <div className="flex flex-col min-h-screen">
      {" "}
      <NavBar accountType={accountType} />
      <main className="flex-grow">{children}</main>{" "}
      <div className="pt-10">
        <Footer />
      </div>
    </div>
  );
};

export default UserLayout;
