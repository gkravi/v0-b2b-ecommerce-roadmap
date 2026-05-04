"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building07, ChevronDown, ShoppingCart01, User01, Menu01, XClose } from "@untitledui/icons"
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
import { useState } from "react"

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold text-sm">
            UC
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <div className="text-sm font-semibold text-foreground">Unified</div>
            <div className="text-[10px] text-muted-foreground">Commerce</div>
          </div>
        </Link>

        {/* Main Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium transition-colors rounded-md",
                  active 
                    ? "text-foreground bg-secondary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1 md:hidden" />

        {/* Right Section */}
        <div className="ml-auto flex items-center gap-2">
          {/* Sold-to switcher - Hidden on mobile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden gap-2 xl:inline-flex">
                <Building07 className="size-4" />
                <span className="max-w-[140px] truncate text-xs">{activeSoldTo.name}</span>
                <Badge variant="secondary" className="ml-1 font-mono text-[9px]">
                  {activeSoldTo.id}
                </Badge>
                <ChevronDown className="size-3.5 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">Switch Sold-to</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {customer.soldTos.map((s) => (
                <DropdownMenuItem
                  key={s.id}
                  onClick={() => setActiveSoldToId(s.id)}
                  className="flex flex-col items-start gap-1.5 py-2 cursor-pointer"
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className="text-sm font-medium text-foreground">{s.name}</span>
                    <span className="font-mono text-[9px] text-muted-foreground">{s.id}</span>
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

          {/* Currency info - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs">
            <span className="text-muted-foreground">Default:</span>
            <SalesOrgBadge code={defaultSalesOrg} />
            <span className="font-mono font-semibold text-foreground">{currency}</span>
          </div>

          {/* Cart */}
          <Button asChild variant="outline" size="sm" className="relative gap-2">
            <Link href="/cart">
              <ShoppingCart01 className="size-4" />
              <span className="hidden sm:inline text-xs">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </Link>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <User01 className="size-4" />
                <span className="hidden sm:inline text-xs">Account</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="pb-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-foreground">{customer.name}</span>
                  <span className="text-xs text-muted-foreground">{customer.email}</span>
                  <span className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                    Persona: {customer.persona}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link href="/portal" className="text-xs">Portal Login Demo</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/orders" className="text-xs">Order History</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/quotes" className="text-xs">Quote History</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/comparison" className="text-xs">Old vs New Flow</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <XClose className="size-4" /> : <Menu01 className="size-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background px-4 py-3 lg:hidden">
          <nav className="flex flex-col gap-1">
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 text-sm font-medium transition-colors rounded-md",
                    active 
                      ? "text-foreground bg-secondary" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}

