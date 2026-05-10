import { createClient } from "@/lib/supabase/server"
import { Plus, Key01, Check, X } from "@untitledui/icons"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

async function getRolesAndPermissions() {
  const supabase = await createClient()
  
  const [rolesResult, resourcesResult, permissionsResult] = await Promise.all([
    supabase.from("roles").select("*").order("name"),
    supabase.from("resources").select("*").order("type, name"),
    supabase.from("role_permissions").select("*")
  ])

  return {
    roles: rolesResult.data ?? [],
    resources: resourcesResult.data ?? [],
    permissions: permissionsResult.data ?? []
  }
}

const permissionTypes = ["view", "create", "edit", "delete", "approve", "admin"] as const

export default async function RolesPage() {
  const { roles, resources, permissions } = await getRolesAndPermissions()

  // Group resources by type
  const resourcesByType = resources.reduce((acc, resource) => {
    if (!acc[resource.type]) {
      acc[resource.type] = []
    }
    acc[resource.type].push(resource)
    return acc
  }, {} as Record<string, typeof resources>)

  // Create permission lookup
  const permissionLookup = new Set(
    permissions.map(p => `${p.role_id}-${p.resource_id}-${p.permission}`)
  )

  const hasPermission = (roleId: string, resourceId: string, permission: string) => {
    return permissionLookup.has(`${roleId}-${resourceId}-${permission}`)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Roles & Permissions
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure role-based access control matrix
          </p>
        </div>
        <Button className="gap-2 w-fit">
          <Plus className="size-4" />
          Add Role
        </Button>
      </div>

      {/* Roles Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {roles.map((role) => (
          <Card key={role.id} className="hover:border-primary/30 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-1.5">
                  <Key01 className="size-3 text-primary" />
                </div>
                <CardTitle className="text-sm font-medium">
                  {role.name}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {role.description ?? "No description"}
              </p>
              {role.is_system_role && (
                <Badge variant="secondary" className="text-[9px] mt-2">
                  System Role
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Permission Matrix by Resource Type */}
      {Object.entries(resourcesByType).map(([type, typeResources]) => (
        <Card key={type}>
          <CardHeader>
            <CardTitle className="text-base capitalize">{type} Permissions</CardTitle>
            <CardDescription>
              Access control for {type} resources
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[200px]">Resource</TableHead>
                  {roles.map((role) => (
                    <TableHead key={role.id} className="text-center min-w-[100px]">
                      <span className="text-xs">{role.name}</span>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {typeResources.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {resource.name.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                        </p>
                        {resource.description && (
                          <p className="text-xs text-muted-foreground">
                            {resource.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    {roles.map((role) => {
                      const rolePerms = permissionTypes.filter(perm => 
                        hasPermission(role.id, resource.id, perm)
                      )
                      return (
                        <TableCell key={role.id} className="text-center">
                          {rolePerms.length > 0 ? (
                            <div className="flex flex-wrap justify-center gap-0.5">
                              {rolePerms.map((perm) => (
                                <span
                                  key={perm}
                                  className="inline-flex items-center justify-center size-5 rounded bg-emerald-50 text-emerald-600"
                                  title={perm}
                                >
                                  <Check className="size-3" />
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="inline-flex items-center justify-center size-5 rounded bg-gray-50 text-gray-400">
                              <X className="size-3" />
                            </span>
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}

      {/* Permission Legend */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Permission Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {permissionTypes.map((perm) => (
              <div key={perm} className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] capitalize">
                  {perm}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {perm === "view" && "Read access"}
                  {perm === "create" && "Create new items"}
                  {perm === "edit" && "Modify existing"}
                  {perm === "delete" && "Remove items"}
                  {perm === "approve" && "Approve workflows"}
                  {perm === "admin" && "Full control"}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
