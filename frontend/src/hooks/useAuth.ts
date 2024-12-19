import { redirect, useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { set } from "react-hook-form";

interface useAuthProps {
  redirectTo?: string;
  loggedIn?: boolean;
}

interface useAuthReturn {
  token: string;
  usernId: string;
  accountType: string;
  loading: boolean;
}

const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const accountType = localStorage.getItem("accountType");

  if (token && userId && accountType) {
    return true;
  } else {
    return false;
  }
};

const useAuth = ({
  redirectTo = "/login",
  loggedIn = true,
}: useAuthProps = {}) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [accountType, setAccountType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const accountType = localStorage.getItem("accountType");

    if (loggedIn) {
      if (token && userId && accountType) {
        setLoading(false);
        setToken(token);
        setUserId(userId);
        setAccountType(accountType);
      } else {
        redirect(redirectTo);
      }
    } else {
      if (token && userId && accountType) {
        redirect(redirectTo);
      } else {
        setLoading(false);
      }
    }
  }, [redirectTo, loggedIn]);
  return { token, userId, accountType, loading };
};

export default useAuth;
export { isLoggedIn };
