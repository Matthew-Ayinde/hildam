import { ApplicationRoutes } from "@/constants/ApplicationRoutes"

export function getLoginRedirectUrl() {
  const configuredAppUrl = process.env.NEXT_PUBLIC_APP_URL

  if (configuredAppUrl) {
    return new URL(ApplicationRoutes.Login, configuredAppUrl).toString()
  }

  if (typeof window === "undefined") {
    return ApplicationRoutes.Login
  }

  return new URL(ApplicationRoutes.Login, window.location.origin).toString()
}