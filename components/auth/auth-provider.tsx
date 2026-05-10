'use client'

import { useCallback, useMemo, useState, useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { AuthContext, type AuthContextValue } from '@/lib/auth/hooks'
import type { SessionUser, Permission } from '@/lib/auth/types'

interface AuthProviderProps {
  children: ReactNode
  initialUser: SessionUser | null
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const [user, setUser] = useState<SessionUser | null>(initialUser)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const isAuthenticated = useMemo(() => !!user, [user])

  const hasPermission = useCallback((resource: string, action: Permission): boolean => {
    if (!user) return false
    if (user.is_super_user) return true

    const permissionKey = `${resource}:${action}`
    const adminKey = `${resource}:admin`
    const globalAdmin = '*:admin'

    return (
      user.permissions.includes(permissionKey) ||
      user.permissions.includes(adminKey) ||
      user.permissions.includes(globalAdmin)
    )
  }, [user])

  const hasRole = useCallback((role: string): boolean => {
    if (!user) return false
    return user.roles.includes(role)
  }, [user])

  const hasAnyRole = useCallback((roles: string[]): boolean => {
    if (!user) return false
    return roles.some(role => user.roles.includes(role))
  }, [user])

  const canAccessTool = useCallback((toolId: string): boolean => {
    if (!user) return false
    if (user.is_super_user) return true
    // Tool access would be checked via API in real implementation
    return true
  }, [user])

  const signOut = useCallback(async () => {
    setIsLoading(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      router.push('/auth/login')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const value: AuthContextValue = useMemo(() => ({
    user,
    isLoading,
    isAuthenticated,
    hasPermission,
    hasRole,
    hasAnyRole,
    canAccessTool,
    signOut,
  }), [user, isLoading, isAuthenticated, hasPermission, hasRole, hasAnyRole, canAccessTool, signOut])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
