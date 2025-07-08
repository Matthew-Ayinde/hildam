"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import jwt from "jsonwebtoken"

export function useTokenExpiration() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated" && session?.user?.token) {
      const token = session.user.token as string

      try {
        const decodedToken = jwt.decode(token)

        if (typeof decodedToken === "object" && decodedToken !== null && "exp" in decodedToken) {
          const expirationTime = decodedToken.exp as number
          const currentTime = Math.floor(Date.now() / 1000)
          const timeUntilExpiration = (expirationTime - currentTime) * 1000

          if (timeUntilExpiration <= 0) {
            // Token is already expired
            signOut({ callbackUrl: "/login" })
            return
          }

          // Set a timeout to automatically sign out when token expires
          const timeoutId = setTimeout(() => {
            signOut({ callbackUrl: "/login" })
          }, timeUntilExpiration)

          return () => clearTimeout(timeoutId)
        }
      } catch (error) {
        console.error("Error checking token expiration:", error)
      }
    }
  }, [session, status, router])
}
