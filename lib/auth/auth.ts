import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { createClient } from "@/lib/supabase/server"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }) {
      if (!user.email) return false

      try {
        // Sync user with Supabase on sign in
        const supabase = await createClient()
        
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
          // Update existing user with Okta ID and last login
          await supabase
            .from("users")
            .update({
              okta_id: profile?.sub,
              last_login_at: new Date().toISOString(),
              first_name: user.name?.split(" ")[0] || existingUser.first_name,
              last_name: user.name?.split(" ").slice(1).join(" ") || existingUser.last_name,
            })
            .eq("id", existingUser.id)
        } else {
          // Create new user if not exists
          const { error: insertError } = await supabase.from("users").insert({
            okta_id: profile?.sub,
            email: user.email,
            first_name: user.name?.split(" ")[0],
            last_name: user.name?.split(" ").slice(1).join(" "),
            status: "Active",
            last_login_at: new Date().toISOString(),
          })

          if (insertError) {
            console.error("[v0] Error creating user:", insertError)
            // Still allow sign in even if we can't create the user record
          }
        }

        return true
      } catch (error) {
        console.error("[v0] Sign in callback error:", error)
        return true // Allow sign in even if sync fails
      }
    },
  },
})
