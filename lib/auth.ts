import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Send login request to backend
          const res = await fetch("https://api.hildamcouture.com/api/v1/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          })

          const response = await res.json()

          // Check if login was successful
          if (!response.status || !response.data) {
            throw new Error(response.message || "Login failed")
          }

          // Calculate expiration time (23 hours from now)
          const expirationTime = Math.floor(Date.now() / 1000) + 23 * 60 * 60

          // Return user details from the API response
          return {
            id: response.data.email, // Using email as ID since no user_id is provided
            name: response.data.name,
            email: response.data.email,
            role: response.data.role,
            token: response.data.token,
            exp: expirationTime,
          }
        } catch (error) {
          console.error("Authentication error:", error)
          throw new Error("Login failed. Please try again.")
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      // If user logs in, store token & details
      if (user) {
        token.name = user.name
        token.email = user.email
        token.role = user.role
        token.token = user.token
        token.exp = user.exp
      }

      // Check if token is expired
      if (token.exp && Date.now() >= token.exp * 1000) {
        // Token is expired, return null to force re-authentication
        return null
      }

      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      // Check if token is expired before creating session
      if (token.exp && Date.now() >= token.exp * 1000) {
        // Token is expired, return null session
        return null
      }

      // Pass user details & access token to session
      session.user = {
        name: token.name,
        email: token.email,
        role: token.role,
        token: token.token,
      }

      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// Export handler for NextAuth API route
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
