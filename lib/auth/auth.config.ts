import type { NextAuthConfig } from "next-auth"
import Okta from "next-auth/providers/okta"

// Debug: Log Okta configuration at startup (values are masked for security)
console.log("[v0] Okta Config Check:", {
  clientId: process.env.OKTA_CLIENT_ID ? `${process.env.OKTA_CLIENT_ID.slice(0, 8)}...` : "MISSING",
  clientSecret: process.env.OKTA_CLIENT_SECRET ? "SET" : "MISSING",
  issuer: process.env.OKTA_ISSUER || "MISSING",
})

export const authConfig: NextAuthConfig = {
  debug: process.env.NODE_ENV === "development",
  providers: [
    Okta({
      clientId: process.env.OKTA_CLIENT_ID || "",
      clientSecret: process.env.OKTA_CLIENT_SECRET || "",
      issuer: process.env.OKTA_ISSUER || "",
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith("/admin")
      const isOnAuth = nextUrl.pathname.startsWith("/auth")
      const publicPaths = ["/", "/architecture", "/roadmap", "/comparison"]
      const isPublic = publicPaths.includes(nextUrl.pathname)

      // Allow public paths without auth
      if (isPublic || isOnAuth) {
        return true
      }

      // Admin routes require authentication
      if (isOnAdmin) {
        if (isLoggedIn) return true
        return false // Redirect to login
      }

      // For demo purposes, allow all other routes
      // In production, you'd check tool access here
      return true
    },
    async jwt({ token, user, account, profile }) {
      // Initial sign in
      if (account && user) {
        token.accessToken = account.access_token
        token.idToken = account.id_token
        token.oktaId = profile?.sub
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string
        session.user.oktaId = token.oktaId as string
        // @ts-expect-error - extending session type
        session.accessToken = token.accessToken
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
  },
}
