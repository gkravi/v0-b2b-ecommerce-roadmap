"use client"

import type { FC, ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  Bell01,
  SearchLg,
  Settings01,
  LifeBuoy01,
  ChevronDown,
  Menu01,
  XClose,
  User01,
  LogOut01,
  HelpCircle,
} from "@untitledui/icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

/* ─────────────────────────── types ──────────────────────────── */

export type NavItem = {
  label: string
  href: string
  current?: boolean
  icon?: FC<{ className?: string }>
  badge?: ReactNode
  /** nested items produce a secondary sub-nav bar */
  items?: NavItem[]
}

interface HeaderNavigationProps {
  /** Logo / wordmark slot */
  logo: ReactNode
  /** Primary nav items */
  items: NavItem[]
  /** Override the active URL (defaults to usePathname) */
  activeUrl?: string
  /** Trailing content rendered right of nav (search, cart, etc.) */
  trailingContent?: ReactNode
  /** Account avatar/menu content */
  accountContent?: ReactNode
  /** Remove bottom border */
  hideBorder?: boolean
}

/* ─────────────────────────── helpers ────────────────────────── */

function isActive(href: string, activeUrl: string) {
  return activeUrl === href || activeUrl.startsWith(href + "/")
}

/* ─────────────────────── NavItemLink ────────────────────────── */

function NavItemLink({
  item,
  active,
  onClick,
}: {
  item: NavItem
  active: boolean
  onClick?: () => void
}) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        // Untitled UI nav item base styles
        "group relative flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        active
          ? "bg-secondary text-foreground"
          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
      )}
    >
      {Icon && <Icon className="size-4 shrink-0" />}
      <span className="truncate">{item.label}</span>
      {item.badge && (
        <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold leading-none text-primary-foreground">
          {item.badge}
        </span>
      )}
    </Link>
  )
}

/* ────────────────────── NavItemDropdown ─────────────────────── */

function NavItemDropdown({
  item,
  activeUrl,
}: {
  item: NavItem & { items: NavItem[] }
  activeUrl: string
}) {
  const parentActive = item.items.some((c) => isActive(c.href, activeUrl))

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "group relative flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors select-none",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
            parentActive
              ? "bg-secondary text-foreground"
              : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
          )}
        >
          {item.icon && <item.icon className="size-4 shrink-0" />}
          <span className="truncate">{item.label}</span>
          <ChevronDown className="size-3.5 opacity-60 transition-transform group-data-[state=open]:rotate-180" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        {item.items.map((child) => (
          <DropdownMenuItem key={child.href} asChild>
            <Link
              href={child.href}
              className={cn(
                "flex items-center gap-2 text-sm",
                isActive(child.href, activeUrl) && "font-medium text-foreground",
              )}
            >
              {child.icon && <child.icon className="size-4 text-muted-foreground" />}
              {child.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* ────────────────────── SecondaryNav bar ────────────────────── */

function SecondaryNav({
  items,
  activeUrl,
}: {
  items: NavItem[]
  activeUrl: string
}) {
  return (
    <div className="border-b border-border bg-background">
      <div className="mx-auto flex h-10 max-w-7xl items-center gap-1 px-4 md:px-6">
        {items.map((item) => {
          const active = isActive(item.href, activeUrl)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-full items-center border-b-2 px-3 text-sm font-medium transition-colors",
                active
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

/* ──────────────────── MobileNavDrawer ───────────────────────── */

function MobileNavDrawer({
  items,
  activeUrl,
  logo,
  accountContent,
  onClose,
}: {
  items: NavItem[]
  activeUrl: string
  logo: ReactNode
  accountContent?: ReactNode
  onClose: () => void
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-background shadow-xl lg:hidden">
        {/* Drawer header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {logo}
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            aria-label="Close menu"
          >
            <XClose className="size-4" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {items.map((item) => {
              const active = isActive(item.href, activeUrl)
              const Icon = item.icon

              if (item.items?.length) {
                return (
                  <li key={item.href}>
                    <details className="group/details">
                      <summary
                        className={cn(
                          "flex cursor-pointer list-none items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          active
                            ? "bg-secondary text-foreground"
                            : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                        )}
                      >
                        {Icon && <Icon className="size-4" />}
                        <span className="flex-1">{item.label}</span>
                        <ChevronDown className="size-3.5 opacity-60 transition-transform group-open/details:rotate-180" />
                      </summary>
                      <ul className="mt-1 space-y-1 pl-6">
                        {item.items.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={onClose}
                              className={cn(
                                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                                isActive(child.href, activeUrl)
                                  ? "font-medium text-foreground bg-secondary"
                                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                              )}
                            >
                              {child.icon && <child.icon className="size-4" />}
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                )
              }

              return (
                <li key={item.href}>
                  <NavItemLink item={item} active={active} onClick={onClose} />
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Account area */}
        {accountContent && (
          <div className="border-t border-border p-4">{accountContent}</div>
        )}
      </div>
    </>
  )
}

/* ──────────────────── HeaderNavigation ─────────────────────── */

export function HeaderNavigation({
  logo,
  items,
  activeUrl: activeUrlProp,
  trailingContent,
  accountContent,
  hideBorder = false,
}: HeaderNavigationProps) {
  const pathname = usePathname()
  const activeUrl = activeUrlProp ?? pathname
  const [mobileOpen, setMobileOpen] = useState(false)

  // Determine if any top-level item with children is active, to show sub-nav
  const activeParent = items.find(
    (item) =>
      item.items?.length &&
      (isActive(item.href, activeUrl) ||
        item.items.some((c) => isActive(c.href, activeUrl))),
  )

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          !hideBorder && !activeParent && "border-b border-border",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 md:px-6">
          {/* ── Logo ── */}
          <div className="flex shrink-0 items-center">{logo}</div>

          {/* ── Primary nav (desktop) ── */}
          <nav className="hidden flex-1 items-center gap-1 lg:flex" aria-label="Primary navigation">
            {items.map((item) => {
              const active = isActive(item.href, activeUrl)

              if (item.items?.length) {
                return (
                  <NavItemDropdown
                    key={item.href}
                    item={item as NavItem & { items: NavItem[] }}
                    activeUrl={activeUrl}
                  />
                )
              }
              return <NavItemLink key={item.href} item={item} active={active} />
            })}
          </nav>

          {/* ── Trailing content + mobile toggle ── */}
          <div className="ml-auto flex items-center gap-2">
            {trailingContent}

            {/* Mobile hamburger */}
            <button
              className="flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu01 className="size-5" />
            </button>
          </div>
        </div>

        {/* ── Secondary sub-nav (desktop) ── */}
        {activeParent?.items && (
          <SecondaryNav items={activeParent.items} activeUrl={activeUrl} />
        )}
      </header>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <MobileNavDrawer
          items={items}
          activeUrl={activeUrl}
          logo={logo}
          accountContent={accountContent}
          onClose={() => setMobileOpen(false)}
        />
      )}
    </>
  )
}

/* ──────────────── Convenience icon-only button ─────────────── */
/** Renders a small icon button matching the Untitled UI nav icon style */
export function NavIconButton({
  icon: Icon,
  label,
  href,
  onClick,
  children,
}: {
  icon: FC<{ className?: string }>
  label: string
  href?: string
  onClick?: () => void
  children?: ReactNode
}) {
  const base = cn(
    "relative flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors",
    "hover:bg-secondary hover:text-foreground",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  )

  if (href) {
    return (
      <Link href={href} className={base} aria-label={label}>
        <Icon className="size-5" />
        {children}
      </Link>
    )
  }
  return (
    <button onClick={onClick} className={base} aria-label={label}>
      <Icon className="size-5" />
      {children}
    </button>
  )
}

/* re-export icons used in header for easy access in site-header */
export { Bell01, SearchLg, Settings01, LifeBuoy01, User01, LogOut01, HelpCircle }
