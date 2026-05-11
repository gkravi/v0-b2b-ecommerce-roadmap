"use client"

import { useState, useEffect } from "react"
import { Save, RefreshCw, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

interface Role {
  id: string
  name: string
  description: string
  is_system_role: boolean
}

interface Resource {
  id: string
  name: string
  type: string
  description: string
}

interface Permission {
  role_id: string
  resource_id: string
  permission: string
}

const PERMISSION_TYPES = ["view", "create", "edit", "delete", "approve", "admin"] as const

export default function PermissionMatrixPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [changes, setChanges] = useState<Map<string, boolean>>(new Map())
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("page")

  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [rolesRes, resourcesRes, permissionsRes] = await Promise.all([
        supabase.from("roles").select("*").order("name"),
        supabase.from("resources").select("*").order("name"),
        supabase.from("role_permissions").select("*"),
      ])

      if (rolesRes.data) setRoles(rolesRes.data)
      if (resourcesRes.data) setResources(resourcesRes.data)
      if (permissionsRes.data) setPermissions(permissionsRes.data)
    } catch (error) {
      console.error("[v0] Error loading data:", error)
      toast.error("Failed to load permissions data")
    }
    setIsLoading(false)
  }

  const hasPermission = (roleId: string, resourceId: string, permission: string) => {
    const key = `${roleId}-${resourceId}-${permission}`
    if (changes.has(key)) {
      return changes.get(key)
    }
    return permissions.some(
      p => p.role_id === roleId && p.resource_id === resourceId && p.permission === permission
    )
  }

  const togglePermission = (roleId: string, resourceId: string, permission: string) => {
    const key = `${roleId}-${resourceId}-${permission}`
    const currentValue = hasPermission(roleId, resourceId, permission)
    setChanges(prev => {
      const newChanges = new Map(prev)
      newChanges.set(key, !currentValue)
      return newChanges
    })
  }

  const handleSave = async () => {
    if (changes.size === 0) return

    setIsSaving(true)
    try {
      const toAdd: { role_id: string; resource_id: string; permission: string }[] = []
      const toRemove: { role_id: string; resource_id: string; permission: string }[] = []

      changes.forEach((newValue, key) => {
        const [roleId, resourceId, permission] = key.split("-")
        const existsInDb = permissions.some(
          p => p.role_id === roleId && p.resource_id === resourceId && p.permission === permission
        )

        if (newValue && !existsInDb) {
          toAdd.push({ role_id: roleId, resource_id: resourceId, permission })
        } else if (!newValue && existsInDb) {
          toRemove.push({ role_id: roleId, resource_id: resourceId, permission })
        }
      })

      // Add new permissions
      if (toAdd.length > 0) {
        const { error } = await supabase.from("role_permissions").insert(toAdd)
        if (error) throw error
      }

      // Remove permissions
      for (const item of toRemove) {
        const { error } = await supabase
          .from("role_permissions")
          .delete()
          .eq("role_id", item.role_id)
          .eq("resource_id", item.resource_id)
          .eq("permission", item.permission)
        if (error) throw error
      }

      toast.success(`Saved ${toAdd.length + toRemove.length} permission changes`)
      setChanges(new Map())
      loadData()
    } catch (error) {
      console.error("[v0] Error saving permissions:", error)
      toast.error("Failed to save permissions")
    }
    setIsSaving(false)
  }

  const filteredResources = resources.filter(r => r.type === activeTab)
  const hasChanges = changes.size > 0

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Permission Matrix</h1>
          <p className="text-sm text-muted-foreground">
            Configure role-based access to resources across the application
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={loadData}>
            <RefreshCw className="size-4" />
            Refresh
          </Button>
          <Button 
            size="sm" 
            className="gap-2" 
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
          >
            <Save className="size-4" />
            {isSaving ? "Saving..." : `Save Changes ${hasChanges ? `(${changes.size})` : ""}`}
          </Button>
        </div>
      </div>

      {/* Changes Banner */}
      {hasChanges && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{changes.size} unsaved changes</Badge>
            <span className="text-sm text-muted-foreground">
              Changes will not take effect until saved
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setChanges(new Map())}>
            Discard
          </Button>
        </div>
      )}

      {/* Permission Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resource Permissions</CardTitle>
          <CardDescription>
            Check or uncheck permissions for each role. Changes are tracked and can be saved together.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="page">Pages</TabsTrigger>
              <TabsTrigger value="action">Actions</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
            </TabsList>

            {["page", "action", "data", "api"].map(type => (
              <TabsContent key={type} value={type}>
                <div className="rounded-lg border overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/50">
                      <tr>
                        <th className="text-left p-3 font-medium sticky left-0 bg-secondary/50 min-w-[200px]">
                          Resource
                        </th>
                        {roles.map(role => (
                          <th key={role.id} className="p-3 font-medium text-center min-w-[100px]">
                            <div className="flex flex-col items-center gap-1">
                              <span className="truncate max-w-[80px]">{role.name}</span>
                              {role.is_system_role && (
                                <Badge variant="outline" className="text-[10px] px-1 py-0">System</Badge>
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredResources.map(resource => (
                        PERMISSION_TYPES.map((permType, permIndex) => (
                          <tr 
                            key={`${resource.id}-${permType}`}
                            className={permIndex === 0 ? "border-t" : ""}
                          >
                            <td className="p-3 sticky left-0 bg-background">
                              {permIndex === 0 ? (
                                <div>
                                  <p className="font-medium">{resource.name}</p>
                                  <p className="text-xs text-muted-foreground">{resource.description}</p>
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground pl-4">{permType}</span>
                              )}
                            </td>
                            {roles.map(role => {
                              const isChecked = hasPermission(role.id, resource.id, permType)
                              const key = `${role.id}-${resource.id}-${permType}`
                              const isChanged = changes.has(key)

                              return (
                                <td key={role.id} className="p-3 text-center">
                                  <div className="flex items-center justify-center">
                                    <Checkbox
                                      checked={isChecked}
                                      onCheckedChange={() => togglePermission(role.id, resource.id, permType)}
                                      className={isChanged ? "border-amber-500 data-[state=checked]:bg-amber-500" : ""}
                                    />
                                  </div>
                                </td>
                              )
                            })}
                          </tr>
                        ))
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Checkbox checked disabled />
              <span className="text-muted-foreground">Permission granted</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox disabled />
              <span className="text-muted-foreground">Permission denied</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox className="border-amber-500" disabled />
              <span className="text-muted-foreground">Unsaved change</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
