"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const accessToken = sessionStorage.getItem("access_token");
    if (!accessToken) {
      router.push("/login");
    }
  }, [router]);

  return <>{children}</>;
};

export default AuthGuard;
