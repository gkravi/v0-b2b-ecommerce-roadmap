"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { 
  Users01, 
  Building07, 
  Key01, 
  Settings01, 
  Shield01, 
  Tool02,
  FileCheck02,
  BarChart07,
  ChevronRight,
  AlertCircle
} from "@untitledui/icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const adminNav = [
  { 
    href: "/admin", 
    label: "Dashboard", 
    icon: BarChart07,
    exact: true 
  },
  { 
    href: "/admin/users", 
    label: "Users", 
    icon: Users01,
    description: "Manage user accounts"
  },
  { 
    href: "/admin/organizations", 
    label: "Organizations", 
    icon: Building07,
    description: "Manage organizations and sold-tos"
  },
  { 
    href: "/admin/roles", 
    label: "Roles", 
    icon: Key01,
    description: "Configure roles"
  },
  { 
    href: "/admin/permissions", 
    label: "Permission Matrix", 
    icon: Shield01,
    description: "Detailed permission control"
  },
  { 
    href: "/admin/tools", 
    label: "Tool Access", 
    icon: Tool02,
    description: "Manage application entitlements"
  },
  { 
    href: "/admin/audit", 
    label: "Audit Log", 
    icon: FileCheck02,
    description: "View authorization events"
  },
  { 
    href: "/admin/settings", 
    label: "Settings", 
    icon: Settings01,
    description: "System configuration"
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  // Show loading state
  if (status === "loading") {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  // Show login prompt if not authenticated (middleware should redirect, but this is a fallback)
  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <AlertCircle className="size-6" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-muted-foreground mb-4">
            You need to sign in with Okta SSO to access the Admin Portal.
          </p>
          <Button asChild>
            <Link href="/auth/login?callbackUrl=/admin">Sign in with Okta</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-border bg-card lg:block overflow-y-auto">
        <div className="flex flex-col gap-1 p-4">
          {/* Admin Header */}
          <div className="flex items-center gap-2 px-3 py-2 mb-2">
            <Shield01 className="size-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">Admin Portal</span>
          </div>
          
          {/* Session Info */}
          {session?.user && (
            <div className="mb-4 px-3 py-2 rounded-lg bg-secondary/50 border border-border">
              <p className="text-xs font-medium text-foreground truncate">{session.user.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{session.user.email}</p>
              <p className="text-[10px] text-primary mt-1">Authenticated via Okta</p>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex flex-col gap-1">
            {adminNav.map((item) => {
              const Icon = item.icon
              const isActive = item.exact 
                ? pathname === item.href 
                : pathname.startsWith(item.href)
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className={cn(
                    "size-4 shrink-0",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && (
                    <ChevronRight className="size-4 text-primary" />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
