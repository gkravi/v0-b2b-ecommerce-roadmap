"use client"

import { useAuth } from "@/lib/auth/use-auth"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface AuthGateProps {
  children: React.ReactNode
  /** Require user to be authenticated */
  requireAuth?: boolean
  /** Require specific role(s) */
  roles?: string[]
  /** Require specific tool access */
  tool?: string
  /** Require specific resource permission */
  resource?: string
  /** Permission type for resource check */
  permission?: "view" | "create" | "edit" | "delete" | "approve" | "admin"
  /** Custom fallback component */
  fallback?: React.ReactNode
  /** Show loading state */
  showLoading?: boolean
}

export function AuthGate({
  children,
  requireAuth = true,
  roles,
  tool,
  resource,
  permission = "view",
  fallback,
  showLoading = true,
}: AuthGateProps) {
  const { 
    isAuthenticated, 
    isLoading, 
    hasRole, 
    hasTool, 
    hasPermission,
    signIn 
  } = useAuth()

  // Loading state
  if (isLoading && showLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="text-sm text-muted-foreground">Checking authorization...</p>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (requireAuth && !isAuthenticated) {
    if (fallback) return <>{fallback}</>
    
    return (
      <div className="flex items-center justify-center min-h-[300px] px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
              <Lock className="size-6 text-muted-foreground" />
            </div>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to access this content
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button onClick={() => signIn()} className="w-full">
              Sign in with Okta
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">Go to Homepage</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Role check
  if (roles && roles.length > 0) {
    const hasRequiredRole = roles.some(role => hasRole(role))
    if (!hasRequiredRole) {
      if (fallback) return <>{fallback}</>
      return <AccessDenied reason="You don't have the required role to access this content." />
    }
  }

  // Tool check
  if (tool) {
    if (!hasTool(tool)) {
      if (fallback) return <>{fallback}</>
      return <AccessDenied reason="You don't have access to this application. Contact your administrator to request access." />
    }
  }

  // Resource permission check
  if (resource) {
    if (!hasPermission(resource, permission)) {
      if (fallback) return <>{fallback}</>
      return <AccessDenied reason={`You don't have ${permission} permission for this resource.`} />
    }
  }

  return <>{children}</>
}

function AccessDenied({ reason }: { reason: string }) {
  return (
    <div className="flex items-center justify-center min-h-[300px] px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
            <Lock className="size-6 text-destructive" />
          </div>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>
            {reason}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Button variant="outline" asChild className="w-full">
            <Link href="/">Go to Homepage</Link>
          </Button>
          <Button variant="ghost" asChild className="w-full">
            <Link href="/admin">Contact Administrator</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// Convenience components for common checks
export function RequireAuth({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return <AuthGate requireAuth fallback={fallback}>{children}</AuthGate>
}

export function RequireRole({ 
  children, 
  role, 
  fallback 
}: { 
  children: React.ReactNode
  role: string | string[]
  fallback?: React.ReactNode 
}) {
  const roles = Array.isArray(role) ? role : [role]
  return <AuthGate roles={roles} fallback={fallback}>{children}</AuthGate>
}

export function RequireTool({ 
  children, 
  tool,
  fallback 
}: { 
  children: React.ReactNode
  tool: string
  fallback?: React.ReactNode 
}) {
  return <AuthGate tool={tool} fallback={fallback}>{children}</AuthGate>
}

export function RequirePermission({ 
  children, 
  resource,
  permission = "view",
  fallback 
}: { 
  children: React.ReactNode
  resource: string
  permission?: "view" | "create" | "edit" | "delete" | "approve" | "admin"
  fallback?: React.ReactNode 
}) {
  return <AuthGate resource={resource} permission={permission} fallback={fallback}>{children}</AuthGate>
}
