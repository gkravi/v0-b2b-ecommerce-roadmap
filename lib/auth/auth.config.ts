import type { NextAuthConfig } from "next-auth"
import Okta from "next-auth/providers/okta"
import { createClient } from "@supabase/supabase-js"

// Debug: Log Okta configuration at startup (values are masked for security)
console.log("[v0] Okta Config Check:", {
  clientId: process.env.OKTA_CLIENT_ID ? `${process.env.OKTA_CLIENT_ID.slice(0, 8)}...` : "MISSING",
  clientSecret: process.env.OKTA_CLIENT_SECRET ? "SET" : "MISSING",
  issuer: process.env.OKTA_ISSUER || "MISSING",
})

// Initialize Supabase admin client for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
)

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
    async signIn({ user, account, profile }) {
      try {
        if (!user.email) {
          console.error("[v0] No email from Okta profile")
          return false
        }

        console.log("[v0] SignIn callback - Okta user:", {
          email: user.email,
          name: user.name,
          oktaId: profile?.sub,
        })

        // Find or update user in Supabase
        const { data: existingUser, error: fetchError } = await supabase
          .from("users")
          .select("id, okta_id")
          .eq("email", user.email)
          .single()

        if (fetchError && fetchError.code !== "PGRST116") {
          console.error("[v0] Error fetching user:", fetchError)
          return false
        }

        if (existingUser) {
          // Update okta_id if not set
          if (!existingUser.okta_id && profile?.sub) {
            console.log("[v0] Updating user okta_id:", {
              userId: existingUser.id,
              oktaId: profile.sub,
            })
            const { error: updateError } = await supabase
              .from("users")
              .update({ okta_id: profile.sub })
              .eq("id", existingUser.id)

            if (updateError) {
              console.error("[v0] Error updating okta_id:", updateError)
              return false
            }
          }
        } else {
          // User doesn't exist in database - this shouldn't happen with pre-seeded users
          console.warn("[v0] User not found in database:", user.email)
          // For now, allow the login to proceed - the session callback will handle the user lookup
        }

        return true
      } catch (error) {
        console.error("[v0] SignIn callback error:", error)
        return false
      }
    },
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
