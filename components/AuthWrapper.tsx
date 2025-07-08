"use client"

import type React from "react"

import { useTokenExpiration } from "@/hooks/useTokenExpiration"
import { usePathname } from "next/navigation"

interface AuthWrapperProps {
  children: React.ReactNode
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const pathname = usePathname()
  const protectedRoutes = ["/admin", "/client-manager", "/head-of-tailoring"]
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Always call the hook at the top level to avoid linting errors
  useTokenExpiration()

  if (isProtectedRoute) {
    // Additional logic for protected routes can be added here if needed
  }

  return <>{children}</>
}
