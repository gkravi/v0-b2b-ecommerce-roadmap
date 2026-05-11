import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { auth } from "@/lib/auth/auth"

interface AuthCheckRequest {
  resource?: string
  permission?: string
  tool?: string
}

// POST - Check if current user has specific permissions
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({
        authorized: false,
        reason: "Not authenticated",
      })
    }

    const body: AuthCheckRequest = await request.json()
    const { resource, permission, tool } = body

    const supabase = await createClient()

    // Get user from database
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, is_super_user, status")
      .eq("email", session.user.email)
      .single()

    if (userError || !user) {
      return NextResponse.json({
        authorized: false,
        reason: "User not found in database",
      })
    }

    if (user.status !== "Active") {
      return NextResponse.json({
        authorized: false,
        reason: `User account is ${user.status.toLowerCase()}`,
      })
    }

    // Super users have all permissions
    if (user.is_super_user) {
      await logAuthCheck(supabase, user.id, resource || tool || "unknown", "allow", { superUser: true })
      return NextResponse.json({
        authorized: true,
        reason: "Super user",
      })
    }

    // Check tool access if requested
    if (tool) {
      const { data: toolAccess } = await supabase
        .from("tool_access")
        .select("status, tools!inner(master_tool_id)")
        .eq("user_id", user.id)
        .eq("tools.master_tool_id", tool)
        .eq("status", "Approved")
        .single()

      if (!toolAccess) {
        await logAuthCheck(supabase, user.id, tool, "deny", { reason: "No tool access" })
        return NextResponse.json({
          authorized: false,
          reason: "No access to this tool",
        })
      }
    }

    // Check resource permission if requested
    if (resource && permission) {
      // Get user's roles
      const { data: userRoles } = await supabase
        .from("user_roles")
        .select("role_id")
        .eq("user_id", user.id)

      const roleIds = userRoles?.map(ur => ur.role_id) || []

      if (roleIds.length === 0) {
        await logAuthCheck(supabase, user.id, resource, "deny", { reason: "No roles assigned" })
        return NextResponse.json({
          authorized: false,
          reason: "No roles assigned",
        })
      }

      // Check if any role has the required permission
      const { data: hasPermission } = await supabase
        .from("role_permissions")
        .select("id, resources!inner(name)")
        .in("role_id", roleIds)
        .eq("resources.name", resource)
        .eq("permission", permission)
        .limit(1)
        .single()

      if (!hasPermission) {
        await logAuthCheck(supabase, user.id, resource, "deny", { permission, reason: "Permission not granted" })
        return NextResponse.json({
          authorized: false,
          reason: `No ${permission} permission for ${resource}`,
        })
      }
    }

    await logAuthCheck(supabase, user.id, resource || tool || "unknown", "allow", { permission, tool })
    return NextResponse.json({
      authorized: true,
      reason: "Permission granted",
    })
  } catch (error) {
    console.error("[v0] Error checking authorization:", error)
    return NextResponse.json(
      { authorized: false, reason: "Internal error" },
      { status: 500 }
    )
  }
}

async function logAuthCheck(
  supabase: any,
  userId: string,
  resource: string,
  decision: "allow" | "deny",
  context: Record<string, any>
) {
  try {
    await supabase.from("authorization_logs").insert({
      user_id: userId,
      action: "permission_check",
      resource,
      decision,
      context,
    })
  } catch (error) {
    console.error("[v0] Error logging auth check:", error)
  }
}
