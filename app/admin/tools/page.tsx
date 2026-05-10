import { createClient } from "@/lib/supabase/server"
import { SearchMd, Plus, Tool02, Users01, CheckCircle, XCircle, Clock } from "@untitledui/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

async function getToolsWithAccess() {
  const supabase = await createClient()
  
  const { data: tools, error } = await supabase
    .from("tools")
    .select(`
      *,
      tool_access (
        id,
        status,
        user:users (
          id,
          first_name,
          last_name,
          email
        )
      )
    `)
    .order("name")

  if (error) {
    console.error("Error fetching tools:", error)
    return []
  }

  return tools ?? []
}

export default async function ToolsPage() {
  const tools = await getToolsWithAccess()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Tool Access
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage application entitlements and user access to tools
          </p>
        </div>
        <Button className="gap-2 w-fit">
          <Plus className="size-4" />
          Add Tool
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <SearchMd className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input 
          placeholder="Search tools..." 
          className="pl-9"
        />
      </div>

      {/* Tools Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const approved = tool.tool_access?.filter((ta: { status: string }) => ta.status === "Approved").length ?? 0
          const pending = tool.tool_access?.filter((ta: { status: string }) => ta.status === "Pending").length ?? 0
          const total = tool.tool_access?.length ?? 0

          return (
            <Card key={tool.id} className="hover:border-primary/30 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Tool02 className="size-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-medium">
                        {tool.name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground font-mono">
                        {tool.route}
                      </p>
                    </div>
                  </div>
                  <Switch checked={tool.is_active} />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {tool.description ?? "No description"}
                </p>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1 text-emerald-600">
                    <CheckCircle className="size-3" />
                    <span>{approved} approved</span>
                  </div>
                  {pending > 0 && (
                    <div className="flex items-center gap-1 text-amber-600">
                      <Clock className="size-3" />
                      <span>{pending} pending</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users01 className="size-3" />
                    <span>{total} total</span>
                  </div>
                </div>
                {tool.requires_approval && (
                  <Badge variant="outline" className="text-[9px] mt-2">
                    Requires Approval
                  </Badge>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pending Access Requests</CardTitle>
          <CardDescription>
            Tool access requests awaiting approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>User</TableHead>
                <TableHead>Tool</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tools.flatMap(tool => 
                (tool.tool_access ?? [])
                  .filter((ta: { status: string }) => ta.status === "Pending")
                  .map((ta: { id: string; user: { first_name: string; last_name: string; email: string } }) => (
                    <TableRow key={ta.id}>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {ta.user?.first_name} {ta.user?.last_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {ta.user?.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-foreground">{tool.name}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">Just now</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                            <CheckCircle className="size-4 mr-1" />
                            Approve
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <XCircle className="size-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
              )}
              {tools.every(t => !t.tool_access?.some((ta: { status: string }) => ta.status === "Pending")) && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No pending requests
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
