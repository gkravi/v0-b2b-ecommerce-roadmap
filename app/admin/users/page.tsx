import { createClient } from "@/lib/supabase/server"
import { SearchMd, FilterLines, Plus, ChevronDown } from "@untitledui/icons"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"

async function getUsers() {
  const supabase = await createClient()
  
  const { data: users, error } = await supabase
    .from("users")
    .select(`
      *,
      user_organizations (
        organization:organizations (
          id,
          name
        ),
        is_primary
      ),
      user_roles (
        role:roles (
          id,
          name
        )
      )
    `)
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) {
    console.error("Error fetching users:", error)
    return []
  }

  return users ?? []
}

function getStatusColor(status: string) {
  switch (status) {
    case "Active":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "Pending":
      return "bg-amber-50 text-amber-700 border-amber-200"
    case "Inactive":
      return "bg-gray-50 text-gray-700 border-gray-200"
    case "Locked":
      return "bg-red-50 text-red-700 border-red-200"
    default:
      return "bg-gray-50 text-gray-700 border-gray-200"
  }
}

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Users
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage user accounts and access permissions
          </p>
        </div>
        <Button className="gap-2 w-fit">
          <Plus className="size-4" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <SearchMd className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            placeholder="Search users..." 
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <FilterLines className="size-4" />
                Status
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>All</DropdownMenuItem>
              <DropdownMenuItem>Active</DropdownMenuItem>
              <DropdownMenuItem>Pending</DropdownMenuItem>
              <DropdownMenuItem>Inactive</DropdownMenuItem>
              <DropdownMenuItem>Locked</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                Organization
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>All Organizations</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[300px]">User</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const primaryOrg = user.user_organizations?.find((uo: { is_primary: boolean }) => uo.is_primary)
              const roles = user.user_roles?.map((ur: { role: { name: string } }) => ur.role?.name).filter(Boolean) ?? []
              const initials = `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase() || user.email[0].toUpperCase()

              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-foreground">
                      {primaryOrg?.organization?.name ?? "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {roles.slice(0, 2).map((role: string) => (
                        <Badge key={role} variant="secondary" className="text-[10px]">
                          {role}
                        </Badge>
                      ))}
                      {roles.length > 2 && (
                        <Badge variant="outline" className="text-[10px]">
                          +{roles.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`${getStatusColor(user.status)} text-[10px]`}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/users/${user.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>Showing {users.length} of {users.length} users</p>
      </div>
    </div>
  )
}
