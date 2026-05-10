"use client"

import Link from "next/link"
import {
  Building07,
  ChevronDown,
  ShoppingCart01,
  User01,
  LogOut01,
  Settings01,
  LifeBuoy01,
} from "@untitledui/icons"
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
import { SalesOrgBadge } from "@/components/product/sales-org-badge"
import { Badge } from "@/components/ui/badge"
import { HeaderNavigation, NavIconButton } from "@/components/layout/header-navigation"
import type { NavItem } from "@/components/layout/header-navigation"

/* ─────────────────────── nav definition ─────────────────────── */

const navItems: NavItem[] = [
  { href: "/products",     label: "Products" },
  { href: "/quick-add",   label: "Quick Add" },
  {
    href: "/orders",
    label: "Orders & Quotes",
    items: [
      { href: "/orders", label: "Orders" },
      { href: "/quotes", label: "Quotes" },
    ],
  },
  { href: "/architecture", label: "Architecture" },
  { href: "/roadmap",      label: "Roadmap" },
  { href: "/admin",        label: "Admin" },
]

/* ──────────────────────── SiteHeader ────────────────────────── */

export function SiteHeader() {
  const { customer, activeSoldTo, setActiveSoldToId, currency, defaultSalesOrg } = usePortal()
  const { totalItems } = useCart()

  /* ── Logo ── */
  const logo = (
    <Link href="/" className="flex items-center gap-2.5">
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-[13px] font-bold text-primary-foreground">
        UC
      </div>
      <div className="hidden flex-col leading-none sm:flex">
        <span className="text-sm font-semibold text-foreground">Unified Commerce</span>
        <span className="text-[10px] text-muted-foreground">B2B Portal</span>
      </div>
    </Link>
  )

  /* ── Account card (mobile drawer footer + desktop dropdown) ── */
  const accountCard = (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
        {customer.name.charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{customer.name}</p>
        <p className="truncate text-xs text-muted-foreground">{customer.email}</p>
      </div>
    </div>
  )

  /* ── Trailing slot ── */
  const trailing = (
    <>
      {/* Sold-to switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="hidden items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs transition-colors hover:bg-secondary xl:flex">
            <Building07 className="size-4 shrink-0 text-muted-foreground" />
            <span className="max-w-[130px] truncate text-foreground">{activeSoldTo.name}</span>
            <Badge variant="secondary" className="font-mono text-[9px]">
              {activeSoldTo.id}
            </Badge>
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Switch Sold-to
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {customer.soldTos.map((s) => (
            <DropdownMenuItem
              key={s.id}
              onClick={() => setActiveSoldToId(s.id)}
              className="flex cursor-pointer flex-col items-start gap-1.5 py-2"
            >
              <div className="flex w-full items-center justify-between gap-2">
                <span className="text-sm font-medium">{s.name}</span>
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

      {/* Default sales org + currency pill */}
      <div className="hidden items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs lg:flex">
        <span className="text-muted-foreground">Default:</span>
        <SalesOrgBadge code={defaultSalesOrg} />
        <span className="font-mono font-semibold text-foreground">{currency}</span>
      </div>

      {/* Cart */}
      <NavIconButton icon={ShoppingCart01} label="Cart" href="/cart">
        {totalItems > 0 && (
          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
            {totalItems}
          </span>
        )}
      </NavIconButton>

      {/* Support */}
      <NavIconButton icon={LifeBuoy01} label="Support" href="#" />

      {/* Account menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground ring-2 ring-background transition-all hover:ring-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Account"
          >
            {customer.name.charAt(0)}
          </button>
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
          <DropdownMenuItem asChild>
            <Link href="/portal" className="flex items-center gap-2 text-sm">
              <User01 className="size-4 text-muted-foreground" /> Portal Demo
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/comparison" className="flex items-center gap-2 text-sm">
              <Settings01 className="size-4 text-muted-foreground" /> Old vs New Flow
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center gap-2 text-sm text-destructive focus:text-destructive">
            <LogOut01 className="size-4" /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )

  return (
    <HeaderNavigation
      logo={logo}
      items={navItems}
      trailingContent={trailing}
      accountContent={accountCard}
    />
  )
}
