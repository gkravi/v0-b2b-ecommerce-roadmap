"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermissions?: {
    resource: string
    action: string
  }[]
  fallback?: React.ReactNode
}

export function ProtectedRoute({ 
  children, 
  requiredPermissions = [],
  fallback
}: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          router.push("/auth/login")
          return
        }

        // If no specific permissions required, user is authorized
        if (requiredPermissions.length === 0) {
          setIsAuthorized(true)
          setIsLoading(false)
          return
        }

        // Check permissions
        const { data: userData } = await supabase
          .from("users")
          .select(`
            is_super_user,
            user_roles (
              role:roles (
                id,
                name
              )
            )
          `)
          .eq("okta_id", user.id)
          .single()

        // Super users have all permissions
        if (userData?.is_super_user) {
          setIsAuthorized(true)
          setIsLoading(false)
          return
        }

        // Get role IDs
        const roleIds = userData?.user_roles?.map((ur: { role: { id: string } }) => ur.role?.id).filter(Boolean) ?? []

        if (roleIds.length === 0) {
          setIsAuthorized(false)
          setIsLoading(false)
          return
        }

        // Check if any role has required permissions
        for (const perm of requiredPermissions) {
          const { data: resources } = await supabase
            .from("resources")
            .select("id")
            .eq("name", perm.resource)
            .single()

          if (!resources) {
            setIsAuthorized(false)
            setIsLoading(false)
            return
          }

          const { data: hasPermission } = await supabase
            .from("role_permissions")
            .select("id")
            .in("role_id", roleIds)
            .eq("resource_id", resources.id)
            .eq("permission", perm.action)
            .limit(1)

          if (!hasPermission || hasPermission.length === 0) {
            setIsAuthorized(false)
            setIsLoading(false)
            return
          }
        }

        setIsAuthorized(true)
        setIsLoading(false)
      } catch (error) {
        console.error("Auth check failed:", error)
        setIsAuthorized(false)
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, supabase, requiredPermissions])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!isAuthorized) {
    if (fallback) {
      return <>{fallback}</>
    }
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h2 className="text-lg font-semibold text-foreground">Access Denied</h2>
        <p className="text-sm text-muted-foreground">
          You don&apos;t have permission to access this page.
        </p>
      </div>
    )
  }

  return <>{children}</>
}
