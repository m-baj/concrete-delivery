"use client";
import React, { Suspense } from "react";
import SetNewPasswordForm from "@/components/setNewPasswordForm";
import { useSearchParams } from "next/navigation";

const SetNewPasswordPageContent = () => {
    const searchParams = useSearchParams();
    const phoneNumber = searchParams.get("phoneNumber");
    return (
        <div className="flex justify-center">
            <SetNewPasswordForm
                phoneNumber={phoneNumber === null ? "" : phoneNumber}
            />
        </div>
    );
};

const SetNewPasswordPage = () => {
    return (
        <Suspense fallback={<div>Ładowanie...</div>}>
            <SetNewPasswordPageContent />
        </Suspense>
    );
};

export default SetNewPasswordPage;
