'use client'

import { createContext, useContext, useCallback, useMemo } from 'react'
import type { SessionUser, Permission } from './types'

// Auth context
interface AuthContextValue {
  user: SessionUser | null
  isLoading: boolean
  isAuthenticated: boolean
  hasPermission: (resource: string, action: Permission) => boolean
  hasRole: (role: string) => boolean
  hasAnyRole: (roles: string[]) => boolean
  canAccessTool: (toolId: string) => boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook to check specific permission
export function usePermission(resource: string, action: Permission): boolean {
  const { hasPermission } = useAuth()
  return hasPermission(resource, action)
}

// Hook to check if user can view a page
export function useCanView(resource: string): boolean {
  return usePermission(resource, 'view')
}

// Hook to check if user can edit
export function useCanEdit(resource: string): boolean {
  return usePermission(resource, 'edit')
}

// Hook to check if user can create
export function useCanCreate(resource: string): boolean {
  return usePermission(resource, 'create')
}

// Hook to check if user can delete
export function useCanDelete(resource: string): boolean {
  return usePermission(resource, 'delete')
}

// Hook to check if user can approve
export function useCanApprove(resource: string): boolean {
  return usePermission(resource, 'approve')
}

// Hook to check admin access
export function useIsAdmin(resource?: string): boolean {
  const { user } = useAuth()
  if (!user) return false
  if (user.is_super_user) return true
  
  if (resource) {
    return user.permissions.includes(`${resource}:admin`)
  }
  
  return user.permissions.some(p => p.endsWith(':admin'))
}

// Export context for provider
export { AuthContext }
export type { AuthContextValue }
