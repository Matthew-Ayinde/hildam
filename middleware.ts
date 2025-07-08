import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Check if token is expired
    if (token?.exp && Date.now() >= Number(token.exp) * 1000) {
      // Token is expired, redirect to login
      const loginUrl = new URL("/login", req.url)
      return NextResponse.redirect(loginUrl)
    }

    // Check role-based access
    const userRole = token?.role as string

    if (pathname.startsWith("/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    if (pathname.startsWith("/client-manager") && userRole !== "client manager") {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    if (pathname.startsWith("/head-of-tailoring") && userRole !== "head of tailoring") {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Only require authentication for specific routes
        const protectedRoutes = ["/admin", "/client-manager", "/head-of-tailoring"]
        const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

        if (!isProtectedRoute) {
          return true // Allow access to non-protected routes (like "/")
        }

        return !!token // Require token for protected routes
      },
    },
  },
)

export const config = {
  matcher: [
    // Only run middleware on these paths
    "/admin/:path*",
    "/client-manager/:path*",
    "/head-of-tailoring/:path*",
  ],
}
