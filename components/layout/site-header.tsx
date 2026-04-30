"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building2, ChevronDown, ShoppingCart, User2, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePortal } from "@/lib/store/portal-context"
import { useCart } from "@/lib/store/cart-context"
import { cn } from "@/lib/utils"
import { SalesOrgBadge } from "@/components/product/sales-org-badge"
import { Badge } from "@/components/ui/badge"

const nav = [
  { href: "/products", label: "Products" },
  { href: "/quick-add", label: "Quick Add" },
  { href: "/orders", label: "Orders" },
  { href: "/quotes", label: "Quotes" },
  { href: "/architecture", label: "Architecture" },
  { href: "/roadmap", label: "Roadmap" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const { customer, activeSoldTo, setActiveSoldToId, currency, defaultSalesOrg } = usePortal()
  const { totalItems } = useCart()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
            <Zap className="h-4 w-4" />
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">Unified Commerce</div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">B2B Portal</div>
          </div>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                  active && "bg-secondary text-foreground",
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* Sold-to switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden gap-2 md:inline-flex">
                <Building2 className="h-4 w-4" />
                <span className="max-w-[160px] truncate">{activeSoldTo.name}</span>
                <Badge variant="secondary" className="ml-1 font-mono text-[10px]">
                  {activeSoldTo.id}
                </Badge>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Switch Sold-to</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {customer.soldTos.map((s) => (
                <DropdownMenuItem
                  key={s.id}
                  onClick={() => setActiveSoldToId(s.id)}
                  className="flex flex-col items-start gap-1 py-2"
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className="font-medium">{s.name}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{s.id}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {s.salesOrgs.map((so) => (
                      <SalesOrgBadge key={so} code={so} />
                    ))}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Currency / default sales org */}
          <div className="hidden items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs md:flex">
            <span className="text-muted-foreground">Default</span>
            <SalesOrgBadge code={defaultSalesOrg} />
            <span className="font-mono font-semibold">{currency}</span>
          </div>

          {/* Cart */}
          <Button asChild variant="outline" size="sm" className="relative gap-2">
            <Link href="/cart">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </Link>
          </Button>

          {/* User */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Account">
                <User2 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{customer.name}</span>
                  <span className="text-xs text-muted-foreground">{customer.email}</span>
                  <span className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                    Persona: {customer.persona}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link href="/portal">Portal Login Demo</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/orders">Order History</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/quotes">Quote History</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/comparison">Old vs New Flow</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
