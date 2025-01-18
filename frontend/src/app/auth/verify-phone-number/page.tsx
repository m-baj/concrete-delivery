"use client";
import React, { Suspense } from "react";
import VerifyPhoneNumberForm from "@/components/verifyPhoneNumberForm";
import { useSearchParams } from "next/navigation";

const VerifyPhoneNumberPageContent = () => {
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

const VerifyPhoneNumberPage = () => {
  return (
    <Suspense fallback={<div>Ładowanie...</div>}>
      <VerifyPhoneNumberPageContent />
    </Suspense>
  );
};

export default VerifyPhoneNumberPage;
