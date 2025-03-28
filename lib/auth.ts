import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken"; // Import jwt for decoding

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
          const res = await fetch("https:hildam.insightpublicis.com/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          const data = await res.json(); // Expecting { access_token: "JWT_STRING" }

          if (!res.ok || !data.access_token) {
            throw new Error("Invalid email or password");
          }

          // Decode JWT to extract user details
          const decodedToken = jwt.decode(data.access_token);

          if (!decodedToken) {
            throw new Error("Failed to decode token");
          }

          // Return user details along with access token
          return {
            id: decodedToken.user_id, // Required by NextAuth
            name: decodedToken.name,
            role: decodedToken.role,
            token: data.access_token, // Store encoded JWT
          };
        } catch (error) {
          console.error("Login error:", error);
          throw new Error("Login failed. Please try again.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // If user logs in, store token & details
      if (user) {
        token.name = user.name;
        token.role = user.role;
        token.token = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      // Pass user details & access token to session
      session.user = {
        name: token.name,
        role: token.role,
        token: token.token, // Keep the JWT token
      };
      return session;
    },
  },
  pages: {
    signIn: "/login", // Redirect to login if unauthorized
  },
  secret: process.env.NEXTAUTH_SECRET, // Store this in .env.local
};

// Export handler for NextAuth API route
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
