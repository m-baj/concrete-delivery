"use client";
import React from "react";
import VerifyPhoneNumberForm from "@/components/verifyPhoneNumberForm";
import { useSearchParams, useRouter } from "next/navigation";

const VerifyPhoneNumberPage = () => {
  const searchParams = useSearchParams();
  const context = searchParams.get("context");
  const phoneNumber = searchParams.get("phoneNumber");

  return (
    <VerifyPhoneNumberForm
      context={context === "register" ? "register" : "resetPassword"}
      phoneNumber={phoneNumber}
    />
  );
};

export default VerifyPhoneNumberPage;