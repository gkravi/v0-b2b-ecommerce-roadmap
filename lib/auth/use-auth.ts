"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"

interface UserPermissions {
  roles: string[]
  tools: string[]
  permissions: { resource: string; permission: string }[]
}

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: {
    id?: string
    email?: string
    name?: string
    oktaId?: string
  } | null
  permissions: UserPermissions | null
}

export function useAuth() {
  const { data: session, status } = useSession()
  const [permissions, setPermissions] = useState<UserPermissions | null>(null)
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    if (session?.user?.email) {
      loadPermissions(session.user.email)
    }
  }, [session?.user?.email])

  const loadPermissions = async (email: string) => {
    setIsLoadingPermissions(true)
    try {
      // Get user from Supabase
      const { data: user } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single()

      if (!user) {
        setPermissions(null)
        return
      }

      // Get roles
      const { data: userRoles } = await supabase
        .from("user_roles")
        .select("roles(name)")
        .eq("user_id", user.id)

      // Get tool access
      const { data: toolAccess } = await supabase
        .from("tool_access")
        .select("tools(master_tool_id)")
        .eq("user_id", user.id)
        .eq("status", "Approved")

      // Get permissions through roles
      const roleIds = userRoles?.map((ur: any) => ur.roles?.id).filter(Boolean) || []
      let perms: { resource: string; permission: string }[] = []

      if (roleIds.length > 0) {
        const { data: rolePermissions } = await supabase
          .from("role_permissions")
          .select("resources(name), permission")
          .in("role_id", roleIds)

        perms = rolePermissions?.map((rp: any) => ({
          resource: rp.resources?.name || "",
          permission: rp.permission,
        })) || []
      }

      setPermissions({
        roles: userRoles?.map((ur: any) => ur.roles?.name).filter(Boolean) || [],
        tools: toolAccess?.map((ta: any) => ta.tools?.master_tool_id).filter(Boolean) || [],
        permissions: perms,
      })
    } catch (error) {
      console.error("[v0] Error loading permissions:", error)
    }
    setIsLoadingPermissions(false)
  }

  const hasRole = useCallback((role: string) => {
    return permissions?.roles.includes(role) || false
  }, [permissions])

  const hasTool = useCallback((toolId: string) => {
    return permissions?.tools.includes(toolId) || false
  }, [permissions])

  const hasPermission = useCallback((resource: string, permission: string) => {
    return permissions?.permissions.some(
      p => p.resource === resource && p.permission === permission
    ) || false
  }, [permissions])

  const canView = useCallback((resource: string) => hasPermission(resource, "view"), [hasPermission])
  const canCreate = useCallback((resource: string) => hasPermission(resource, "create"), [hasPermission])
  const canEdit = useCallback((resource: string) => hasPermission(resource, "edit"), [hasPermission])
  const canDelete = useCallback((resource: string) => hasPermission(resource, "delete"), [hasPermission])
  const canApprove = useCallback((resource: string) => hasPermission(resource, "approve"), [hasPermission])
  const isAdmin = useCallback(() => hasRole("Super Admin") || hasRole("Admin"), [hasRole])

  return {
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading" || isLoadingPermissions,
    user: session?.user ? {
      id: session.user.id,
      email: session.user.email ?? undefined,
      name: session.user.name ?? undefined,
      oktaId: (session.user as any).oktaId,
    } : null,
    permissions,
    hasRole,
    hasTool,
    hasPermission,
    canView,
    canCreate,
    canEdit,
    canDelete,
    canApprove,
    isAdmin,
    signIn: () => import("next-auth/react").then(m => m.signIn("okta")),
    signOut: () => import("next-auth/react").then(m => m.signOut()),
  }
}
