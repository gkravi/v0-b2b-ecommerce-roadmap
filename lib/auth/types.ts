// Authorization Types for Okta + FGA Integration

export type UserStatus = 'Active' | 'Inactive' | 'Pending' | 'Locked'
export type OrganizationType = 'Distributor' | 'Partner' | 'Customer' | 'Internal'
export type ToolAccessStatus = 'Approved' | 'Pending' | 'Rejected' | 'Revoked'
export type PortalStatus = 'Active' | 'Inactive' | 'Pending'
export type ResourceType = 'page' | 'action' | 'data' | 'api'
export type Permission = 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'admin'
export type AuthDecision = 'allow' | 'deny'

// Database entity types
export interface Organization {
  id: string
  external_id: string
  name: string
  type: OrganizationType
  line_of_business: string[]
  account_number?: string
  erp_number?: string
  status: 'Active' | 'Inactive' | 'Suspended'
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  okta_id?: string
  hon_id?: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  language_iso: string
  is_super_user: boolean
  status: UserStatus
  last_login_at?: string
  created_at: string
  updated_at: string
}

export interface Role {
  id: string
  name: string
  description?: string
  is_system_role: boolean
  created_at: string
}

export interface UserRole {
  id: string
  user_id: string
  role_id: string
  organization_id?: string
  created_at: string
  role?: Role
  organization?: Organization
}

export interface UserOrganization {
  id: string
  user_id: string
  organization_id: string
  is_primary: boolean
  persona?: string
  portal_status: PortalStatus
  created_at: string
  organization?: Organization
}

export interface SoldTo {
  id: string
  external_id: string
  name: string
  organization_id: string
  is_primary: boolean
  is_default: boolean
  status: 'Active' | 'Inactive'
  created_at: string
  organization?: Organization
  sales_areas?: SalesArea[]
}

export interface SalesArea {
  id: string
  sold_to_id: string
  sales_org: string
  currency: string
  distribution_channel?: string
  division?: string
  sales_area_code: string
  created_at: string
}

export interface Tool {
  id: string
  master_tool_id: string
  name: string
  description?: string
  icon?: string
  route?: string
  is_active: boolean
  requires_approval: boolean
  created_at: string
}

export interface ToolAccess {
  id: string
  user_id: string
  tool_id: string
  organization_id?: string
  status: ToolAccessStatus
  requested_by?: string
  approved_by?: string
  requested_date: string
  granted_date?: string
  revoked_date?: string
  created_at: string
  tool?: Tool
  organization?: Organization
}

export interface Resource {
  id: string
  name: string
  type: ResourceType
  description?: string
  parent_resource_id?: string
  created_at: string
}

export interface RolePermission {
  id: string
  role_id: string
  resource_id: string
  permission: Permission
  created_at: string
  role?: Role
  resource?: Resource
}

export interface UserSoldTo {
  id: string
  user_id: string
  sold_to_id: string
  is_default: boolean
  created_at: string
  sold_to?: SoldTo
}

export interface AuthorizationLog {
  id: string
  user_id?: string
  action: string
  resource: string
  decision: AuthDecision
  context?: Record<string, unknown>
  ip_address?: string
  user_agent?: string
  created_at: string
}

// Extended user with all relationships
export interface UserWithRelations extends User {
  organizations: UserOrganization[]
  roles: UserRole[]
  sold_tos: UserSoldTo[]
  tool_access: ToolAccess[]
}

// Authorization context for making decisions
export interface AuthorizationContext {
  user: UserWithRelations
  resource: string
  action: Permission
  sold_to_id?: string
  sales_area_code?: string
  organization_id?: string
}

// Authorization check result
export interface AuthorizationResult {
  allowed: boolean
  reason?: string
  matched_role?: string
  matched_permission?: Permission
}

// Session user (minimal data for client)
export interface SessionUser {
  id: string
  email: string
  first_name?: string
  last_name?: string
  is_super_user: boolean
  primary_organization_id?: string
  roles: string[]
  permissions: string[]
}

// Okta token claims
export interface OktaClaims {
  sub: string
  email: string
  email_verified: boolean
  name?: string
  given_name?: string
  family_name?: string
  groups?: string[]
  hon_id?: string
}
