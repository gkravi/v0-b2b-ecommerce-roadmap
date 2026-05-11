import { createClient } from "@/lib/supabase/server"
import { Users01, Building07, Key01, Tool02, Activity, TrendUp01 } from "@untitledui/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

async function getStats() {
  const supabase = await createClient()
  
  const [users, organizations, roles, tools, recentLogs] = await Promise.all([
    supabase.from("users").select("id, status", { count: "exact" }),
    supabase.from("organizations").select("id, status", { count: "exact" }),
    supabase.from("roles").select("id", { count: "exact" }),
    supabase.from("tools").select("id, is_active", { count: "exact" }),
    supabase.from("authorization_logs")
      .select("id, action, resource, decision, created_at, user_id")
      .order("created_at", { ascending: false })
      .limit(10)
  ])

  const activeUsers = users.data?.filter(u => u.status === "Active").length ?? 0
  const activeOrgs = organizations.data?.filter(o => o.status === "Active").length ?? 0
  const activeTools = tools.data?.filter(t => t.is_active).length ?? 0

  return {
    totalUsers: users.count ?? 0,
    activeUsers,
    totalOrganizations: organizations.count ?? 0,
    activeOrgs,
    totalRoles: roles.count ?? 0,
    totalTools: tools.count ?? 0,
    activeTools,
    recentLogs: recentLogs.data ?? []
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      subValue: `${stats.activeUsers} active`,
      icon: Users01,
      href: "/admin/users",
      trend: "+12%",
      color: "text-blue-600 bg-blue-50"
    },
    {
      title: "Organizations",
      value: stats.totalOrganizations,
      subValue: `${stats.activeOrgs} active`,
      icon: Building07,
      href: "/admin/organizations",
      trend: "+5%",
      color: "text-emerald-600 bg-emerald-50"
    },
    {
      title: "Roles",
      value: stats.totalRoles,
      subValue: "Configured",
      icon: Key01,
      href: "/admin/roles",
      trend: "Stable",
      color: "text-violet-600 bg-violet-50"
    },
    {
      title: "Tools",
      value: stats.totalTools,
      subValue: `${stats.activeTools} active`,
      icon: Tool02,
      href: "/admin/tools",
      trend: "+2",
      color: "text-amber-600 bg-amber-50"
    },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Admin Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of user access control and authorization metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:border-primary/30 hover:shadow-md transition-all cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`rounded-lg p-2 ${stat.color}`}>
                    <Icon className="size-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-foreground">
                      {stat.value}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {stat.subValue}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600">
                    <TrendUp01 className="size-3" />
                    <span>{stat.trend}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Link 
              href="/admin/users?action=create"
              className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-secondary transition-colors"
            >
              <div className="rounded-lg bg-primary/10 p-2">
                <Users01 className="size-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Add New User</p>
                <p className="text-xs text-muted-foreground">Create a new user account</p>
              </div>
            </Link>
            <Link 
              href="/admin/tools"
              className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-secondary transition-colors"
            >
              <div className="rounded-lg bg-primary/10 p-2">
                <Tool02 className="size-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Manage Tool Access</p>
                <p className="text-xs text-muted-foreground">Configure application entitlements</p>
              </div>
            </Link>
            <Link 
              href="/admin/roles"
              className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-secondary transition-colors"
            >
              <div className="rounded-lg bg-primary/10 p-2">
                <Key01 className="size-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Edit Permissions</p>
                <p className="text-xs text-muted-foreground">Update role-based access control</p>
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Recent Activity</CardTitle>
                <CardDescription>Latest authorization events</CardDescription>
              </div>
              <Link 
                href="/admin/audit" 
                className="text-xs text-primary hover:underline"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentLogs.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent activity
                </p>
              ) : (
                stats.recentLogs.slice(0, 5).map((log) => (
                  <div 
                    key={log.id} 
                    className="flex items-center gap-3 text-sm"
                  >
                    <div className={`size-2 rounded-full ${
                      log.decision === "allow" ? "bg-emerald-500" : "bg-red-500"
                    }`} />
                    <span className="flex-1 truncate text-foreground">
                      {log.action} on {log.resource}
                    </span>
                    <Badge 
                      variant={log.decision === "allow" ? "secondary" : "destructive"}
                      className="text-[10px]"
                    >
                      {log.decision}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
