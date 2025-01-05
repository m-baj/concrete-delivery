"use client";
import React from "react";
import SetNewPasswordForm from "@/components/setNewPasswordForm";
import { useSearchParams } from "next/navigation";

const SetNewPasswordPage = () => {
    const searchParams = useSearchParams();
    const phoneNumber = searchParams.get("phoneNumber");
    return (
        <div className="flex justify-center ">
            <SetNewPasswordForm
                phoneNumber={phoneNumber === null ? "" : phoneNumber}
            />
        </div>
    );
};

export default SetNewPasswordPage;
