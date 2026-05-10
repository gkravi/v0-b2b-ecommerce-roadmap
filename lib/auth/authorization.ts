import { createClient } from '@/lib/supabase/server'
import type {
  User,
  UserWithRelations,
  AuthorizationContext,
  AuthorizationResult,
  Permission,
  SessionUser,
  Tool,
  ToolAccess,
} from './types'

/**
 * Get user with all authorization-related relationships
 */
export async function getUserWithRelations(userId: string): Promise<UserWithRelations | null> {
  const supabase = await createClient()
  
  const { data: user, error } = await supabase
    .from('users')
    .select(`
      *,
      organizations:user_organizations(
        *,
        organization:organizations(*)
      ),
      roles:user_roles(
        *,
        role:roles(*),
        organization:organizations(*)
      ),
      sold_tos:user_sold_tos(
        *,
        sold_to:sold_tos(
          *,
          sales_areas(*)
        )
      ),
      tool_access(
        *,
        tool:tools(*)
      )
    `)
    .eq('id', userId)
    .single()

  if (error || !user) {
    console.error('Error fetching user with relations:', error)
    return null
  }

  return user as unknown as UserWithRelations
}

/**
 * Get user by Okta ID
 */
export async function getUserByOktaId(oktaId: string): Promise<User | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('okta_id', oktaId)
    .single()

  if (error) {
    return null
  }

  return data
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single()

  if (error) {
    return null
  }

  return data
}

/**
 * Check if user has permission for a resource
 * Implements RBAC + ABAC + ReBAC pattern
 */
export async function checkPermission(
  context: AuthorizationContext
): Promise<AuthorizationResult> {
  const { user, resource, action, sold_to_id, organization_id } = context

  // Super users have full access
  if (user.is_super_user) {
    await logAuthorizationDecision(user.id, action, resource, 'allow', { reason: 'super_user' })
    return { allowed: true, reason: 'Super user access', matched_role: 'SuperAdmin' }
  }

  // Get user's roles (optionally filtered by organization)
  const relevantRoles = organization_id
    ? user.roles.filter(r => r.organization_id === organization_id || !r.organization_id)
    : user.roles

  if (relevantRoles.length === 0) {
    await logAuthorizationDecision(user.id, action, resource, 'deny', { reason: 'no_roles' })
    return { allowed: false, reason: 'No roles assigned' }
  }

  const supabase = await createClient()

  // Get role IDs
  const roleIds = relevantRoles.map(r => r.role_id)

  // Check role permissions for this resource
  const { data: permissions, error } = await supabase
    .from('role_permissions')
    .select(`
      *,
      role:roles(*),
      resource:resources(*)
    `)
    .in('role_id', roleIds)
    .eq('permission', action)

  if (error) {
    console.error('Error checking permissions:', error)
    return { allowed: false, reason: 'Permission check failed' }
  }

  // Check if any permission matches the resource
  const matchingPermission = permissions?.find(p => 
    p.resource?.name === resource || 
    p.resource?.name === '*' ||
    resource.startsWith(p.resource?.name + '/')
  )

  if (matchingPermission) {
    await logAuthorizationDecision(user.id, action, resource, 'allow', {
      role: matchingPermission.role?.name,
      permission: matchingPermission.permission
    })
    return {
      allowed: true,
      reason: `Permission granted via role: ${matchingPermission.role?.name}`,
      matched_role: matchingPermission.role?.name,
      matched_permission: matchingPermission.permission
    }
  }

  // Check Sold-To level access (ReBAC)
  if (sold_to_id) {
    const hasSoldToAccess = user.sold_tos.some(st => st.sold_to_id === sold_to_id)
    if (!hasSoldToAccess) {
      await logAuthorizationDecision(user.id, action, resource, 'deny', { 
        reason: 'no_sold_to_access',
        sold_to_id 
      })
      return { allowed: false, reason: 'No access to this Sold-To account' }
    }
  }

  await logAuthorizationDecision(user.id, action, resource, 'deny', { reason: 'no_permission' })
  return { allowed: false, reason: 'No matching permission found' }
}

/**
 * Check if user has access to a specific tool
 */
export async function checkToolAccess(
  userId: string,
  toolId: string,
  organizationId?: string
): Promise<boolean> {
  const supabase = await createClient()

  const query = supabase
    .from('tool_access')
    .select('*')
    .eq('user_id', userId)
    .eq('tool_id', toolId)
    .eq('status', 'Approved')

  if (organizationId) {
    query.eq('organization_id', organizationId)
  }

  const { data, error } = await query.maybeSingle()

  if (error) {
    console.error('Error checking tool access:', error)
    return false
  }

  return !!data
}

/**
 * Get all tools accessible to a user
 */
export async function getUserTools(userId: string): Promise<Tool[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tool_access')
    .select(`
      tool:tools(*)
    `)
    .eq('user_id', userId)
    .eq('status', 'Approved')

  if (error) {
    console.error('Error fetching user tools:', error)
    return []
  }

  return data?.map(d => d.tool).filter(Boolean) as Tool[]
}

/**
 * Get user's accessible Sold-Tos with sales areas
 */
export async function getUserSoldTos(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('user_sold_tos')
    .select(`
      *,
      sold_to:sold_tos(
        *,
        organization:organizations(*),
        sales_areas(*)
      )
    `)
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching user sold-tos:', error)
    return []
  }

  return data
}

/**
 * Log authorization decision for audit
 */
async function logAuthorizationDecision(
  userId: string,
  action: string,
  resource: string,
  decision: 'allow' | 'deny',
  context?: Record<string, unknown>
) {
  const supabase = await createClient()

  await supabase.from('authorization_logs').insert({
    user_id: userId,
    action,
    resource,
    decision,
    context
  })
}

/**
 * Build session user object for client-side use
 */
export async function buildSessionUser(userId: string): Promise<SessionUser | null> {
  const user = await getUserWithRelations(userId)
  
  if (!user) return null

  const primaryOrg = user.organizations.find(o => o.is_primary)
  const roleNames = user.roles.map(r => r.role?.name).filter(Boolean) as string[]

  // Get all permissions for user's roles
  const supabase = await createClient()
  const roleIds = user.roles.map(r => r.role_id)

  const { data: permissions } = await supabase
    .from('role_permissions')
    .select('permission, resource:resources(name)')
    .in('role_id', roleIds)

  const permissionStrings = permissions?.map(p => 
    `${p.resource?.name}:${p.permission}`
  ).filter(Boolean) || []

  return {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    is_super_user: user.is_super_user,
    primary_organization_id: primaryOrg?.organization_id,
    roles: roleNames,
    permissions: permissionStrings
  }
}

/**
 * Update user's last login timestamp
 */
export async function updateLastLogin(userId: string) {
  const supabase = await createClient()
  
  await supabase
    .from('users')
    .update({ last_login_at: new Date().toISOString() })
    .eq('id', userId)
}
