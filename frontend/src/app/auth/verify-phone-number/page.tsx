"use client";
import React from "react";
import VerifyPhoneNumberForm from "@/components/verifyPhoneNumberForm";
import { useSearchParams } from "next/navigation";

const VerifyPhoneNumberPage = () => {
  const searchParams = useSearchParams();
  const context = searchParams.get("context");

  return (
    <VerifyPhoneNumberForm context={context === "register" ? "register" : "resetPassword"} />
  );
};

export default VerifyPhoneNumberPage;