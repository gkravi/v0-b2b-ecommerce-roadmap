import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ArrowLeft, Mail01, Phone, Globe02, Building07, Key01, Tool02, Clock } from "@untitledui/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"

async function getUser(id: string) {
  const supabase = await createClient()
  
  const { data: user, error } = await supabase
    .from("users")
    .select(`
      *,
      user_organizations (
        is_primary,
        persona,
        portal_status,
        organization:organizations (
          id,
          name,
          type
        )
      ),
      user_roles (
        role:roles (
          id,
          name,
          description
        ),
        organization:organizations (
          id,
          name
        )
      ),
      user_sold_tos (
        is_default,
        sold_to:sold_tos (
          id,
          name,
          external_id
        )
      ),
      tool_access (
        status,
        granted_date,
        tool:tools (
          id,
          name,
          icon,
          route
        )
      )
    `)
    .eq("id", id)
    .single()

  if (error || !user) {
    return null
  }

  return user
}

function getStatusColor(status: string) {
  switch (status) {
    case "Active":
    case "Approved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "Pending":
      return "bg-amber-50 text-amber-700 border-amber-200"
    case "Inactive":
    case "Revoked":
      return "bg-gray-50 text-gray-700 border-gray-200"
    case "Locked":
    case "Rejected":
      return "bg-red-50 text-red-700 border-red-200"
    default:
      return "bg-gray-50 text-gray-700 border-gray-200"
  }
}

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getUser(id)

  if (!user) {
    notFound()
  }

  const initials = `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase() || user.email[0].toUpperCase()
  const primaryOrg = user.user_organizations?.find((uo: { is_primary: boolean }) => uo.is_primary)

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/admin/users" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to Users
      </Link>

      {/* User Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarFallback className="text-lg bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {user.first_name} {user.last_name}
            </h1>
            <p className="text-sm text-muted-foreground">
              {user.email}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge 
                variant="outline" 
                className={`${getStatusColor(user.status)}`}
              >
                {user.status}
              </Badge>
              {user.is_super_user && (
                <Badge variant="default">Super User</Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Edit User</Button>
          <Button variant="destructive">Deactivate</Button>
        </div>
      </div>

      {/* User Details Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail01 className="size-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm text-foreground">{user.email}</p>
              </div>
            </div>
            {user.phone && (
              <div className="flex items-center gap-3">
                <Phone className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm text-foreground">{user.phone}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Globe02 className="size-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Language</p>
                <p className="text-sm text-foreground">{user.language_iso?.toUpperCase() ?? "EN"}</p>
              </div>
            </div>
            {user.hon_id && (
              <div className="flex items-center gap-3">
                <Key01 className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">HON ID</p>
                  <p className="text-sm text-foreground font-mono">{user.hon_id}</p>
                </div>
              </div>
            )}
            {user.last_login_at && (
              <div className="flex items-center gap-3">
                <Clock className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Last Login</p>
                  <p className="text-sm text-foreground">
                    {new Date(user.last_login_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Organizations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building07 className="size-4" />
              Organizations
            </CardTitle>
            <CardDescription>Organization memberships</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {user.user_organizations?.map((uo: { organization: { id: string; name: string; type: string }; is_primary: boolean; persona: string }) => (
                <div 
                  key={uo.organization?.id} 
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {uo.organization?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {uo.organization?.type} {uo.persona ? `• ${uo.persona}` : ""}
                    </p>
                  </div>
                  {uo.is_primary && (
                    <Badge variant="secondary" className="text-[10px]">Primary</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Roles */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Key01 className="size-4" />
              Roles
            </CardTitle>
            <CardDescription>Assigned roles and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {user.user_roles?.map((ur: { role: { id: string; name: string; description: string }; organization: { name: string } }, idx: number) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {ur.role?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {ur.organization?.name ?? "Global"}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">Remove</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tool Access */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Tool02 className="size-4" />
              Tool Access
            </CardTitle>
            <CardDescription>Application entitlements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {user.tool_access?.map((ta: { status: string; tool: { id: string; name: string; route: string } }) => (
                <div 
                  key={ta.tool?.id} 
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {ta.tool?.name}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {ta.tool?.route}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant="outline" 
                      className={`${getStatusColor(ta.status)} text-[10px]`}
                    >
                      {ta.status}
                    </Badge>
                    <Switch 
                      checked={ta.status === "Approved"} 
                      disabled
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
