import { createClient } from "@/lib/supabase/server"
import { SearchMd, FilterLines, Download01, ChevronDown } from "@untitledui/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

async function getAuditLogs() {
  const supabase = await createClient()
  
  const { data: logs, error } = await supabase
    .from("authorization_logs")
    .select(`
      *,
      user:users (
        id,
        first_name,
        last_name,
        email
      )
    `)
    .order("created_at", { ascending: false })
    .limit(100)

  if (error) {
    console.error("Error fetching audit logs:", error)
    return []
  }

  return logs ?? []
}

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default async function AuditPage() {
  const logs = await getAuditLogs()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Audit Log
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            View authorization events and access decisions
          </p>
        </div>
        <Button variant="outline" className="gap-2 w-fit">
          <Download01 className="size-4" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <SearchMd className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            placeholder="Search logs..." 
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <FilterLines className="size-4" />
                Decision
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>All</DropdownMenuItem>
              <DropdownMenuItem>Allow</DropdownMenuItem>
              <DropdownMenuItem>Deny</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                Action
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>All Actions</DropdownMenuItem>
              <DropdownMenuItem>view</DropdownMenuItem>
              <DropdownMenuItem>create</DropdownMenuItem>
              <DropdownMenuItem>edit</DropdownMenuItem>
              <DropdownMenuItem>delete</DropdownMenuItem>
              <DropdownMenuItem>approve</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[180px]">Timestamp</TableHead>
              <TableHead className="w-[200px]">User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead className="w-[100px]">Decision</TableHead>
              <TableHead className="w-[150px]">IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No audit logs found
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {formatDate(log.created_at)}
                  </TableCell>
                  <TableCell>
                    {log.user ? (
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {log.user.first_name} {log.user.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {log.user.email}
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">System</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-foreground font-mono">
                      {log.resource}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`text-[10px] ${
                        log.decision === "allow" 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {log.decision}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {log.ip_address ?? "—"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>Showing {logs.length} of {logs.length} events</p>
      </div>
    </div>
  )
}
