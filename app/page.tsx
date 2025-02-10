"use client";

import Homepage from "@/components/Homepage";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      const decodedToken = jwtDecode<{ role: string }>(token);
      switch (decodedToken.role) {
        case "admin":
          router.push("/admin");
          break;
        case "customer":
          router.push("/client/orders");
          break;
        case "project manager":
          router.push("/project-manager/joblists/projects");
          break;
        case "client manager":
          router.push("/client-manager/orders");
          break;
        case "store manager":
          router.push("/store-manager/joblists/projects");
          break;
        case "head of tailoring":
          router.push("/head-of-tailoring/joblists/tailorjoblists");
          break;
        default:
          sessionStorage.removeItem("access_token");
          router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 w-full">
    </div>
  );
}