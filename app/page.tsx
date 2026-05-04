import Link from "next/link"
import {
  ArrowRight,
  Boxes,
  GitBranch,
  Layers,
  LineChart,
  PackageSearch,
  ShoppingCart,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SalesOrgBadge } from "@/components/product/sales-org-badge"

const capabilities = [
  {
    href: "/products",
    icon: PackageSearch,
    title: "Cross-business catalog",
    desc: "Browse IA, BA and PT materials in one storefront. List price comes from the default sales org with one-click 'View buying options' to choose another.",
  },
  {
    href: "/cart",
    icon: ShoppingCart,
    title: "Split cart, split order",
    desc: "Items from different sales orgs flow into separate cart groups and create split orders downstream — no more juggling business-specific portals.",
  },
  {
    href: "/quick-add",
    icon: Zap,
    title: "Quick add & PO upload",
    desc: "Power users add SKUs by code, paste a PO line list, or upload CSV. Save, export and reorder carts whenever you need.",
  },
  {
    href: "/quotes",
    icon: GitBranch,
    title: "Quote-to-cash, unified",
    desc: "Request quote from cart. Approvals flow to Salesforce CPQ or SAP CPQ, contract syncs back, customer accepts and converts to order.",
  },
  {
    href: "/orders",
    icon: Layers,
    title: "Orders & quotes history",
    desc: "Faceted search across orders and quotes spanning every business — header view with PO, sold-to/ship-to and status filters plus full line detail.",
  },
  {
    href: "/architecture",
    icon: Workflow,
    title: "Animated MACH architecture",
    desc: "See how Auth Engine, MACH storefront, BFF, Salesforce, SAP CPQ and SAP ERP work together for one customer journey.",
  },
]

const callouts = [
  { code: "IA01" as const, title: "Industrial Automation", line: "Process controllers, instruments, asset monitoring" },
  { code: "BA01" as const, title: "Building Automation", line: "HVAC controls, fire & life safety, security" },
  { code: "PT01" as const, title: "Process Technology", line: "Catalysts, adsorbents, process licensing" },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-70"
          style={{
            background:
              "radial-gradient(60% 40% at 80% 0%, color-mix(in oklab, var(--primary) 12%, transparent), transparent 60%), radial-gradient(40% 30% at 10% 10%, color-mix(in oklab, var(--chart-2) 14%, transparent), transparent 60%)",
          }}
        />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
          <div className="flex flex-col justify-center gap-6">
            <Badge variant="secondary" className="w-fit gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              MACH composable storefront demo
            </Badge>
            <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              One customer.{" "}
              <span className="text-primary">Every business.</span>{" "}
              One unified B2B journey.
            </h1>
            <p className="prose prose-base max-w-xl text-pretty leading-relaxed text-muted-foreground dark:prose-invert md:prose-lg">
              ACME Industries&apos; buyer Priya purchases across Industrial Automation, Building
              Automation and Process Technology. Today that means three SAP Commerce storefronts,
              three logins and three carts. This demo shows the unified MACH journey that replaces
              all of it &mdash; without disrupting back-office process per business.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link href="/products">
                  Start the buyer journey <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/architecture">See architecture</Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link href="/comparison">Old vs new flow</Link>
              </Button>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>Customer scope:</span>
              {callouts.map((c) => (
                <SalesOrgBadge key={c.code} code={c.code} />
              ))}
            </div>
          </div>

          {/* Hero side: animated stack */}
          <div className="relative">
            <Card className="relative overflow-hidden p-0">
              <div className="border-b border-border bg-secondary/40 px-5 py-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-primary node-pulse" />
                  Live unified order book &middot; Cust1 &middot; ACME Industries
                </div>
              </div>
              <div className="space-y-3 p-5">
                {[
                  { code: "IA01" as const, title: "Experion C300 Process Controller", price: "$12,450", qty: 2 },
                  { code: "BA01" as const, title: "T7 Pro Commercial Thermostat", price: "$320", qty: 24 },
                  { code: "PT01" as const, title: "Refining Catalyst X12 (per kg)", price: "$38", qty: 2400 },
                ].map((row, i) => (
                  <div
                    key={row.title}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3"
                    style={{ animationDelay: `${i * 120}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-block h-9 w-1.5 rounded"
                        style={{
                          background: `var(--chart-${row.code === "IA01" ? 1 : row.code === "BA01" ? 2 : 3})`,
                        }}
                        aria-hidden="true"
                      />
                      <div>
                        <div className="text-sm font-medium leading-tight">{row.title}</div>
                        <div className="mt-1 flex items-center gap-2">
                          <SalesOrgBadge code={row.code} />
                          <span className="text-xs text-muted-foreground">Qty {row.qty}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm font-semibold">{row.price}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">List · USD</div>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between rounded-lg bg-secondary/60 p-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Boxes className="h-4 w-4 text-muted-foreground" />
                    <span>3 sales orgs &middot; 1 unified cart &middot; 3 split orders</span>
                  </div>
                  <span className="font-mono text-xs font-semibold">Auto-routed</span>
                </div>
              </div>
              <div
                aria-hidden="true"
                className="absolute inset-x-6 bottom-0 h-px shimmer"
              />
            </Card>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="mb-10 flex flex-col gap-2">
          <h2 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">
            What this demo covers
          </h2>
          <p className="prose prose-sm max-w-3xl text-pretty text-muted-foreground dark:prose-invert">
            Click into any tile to walk a real screen. Every page uses dummy data designed to mimic
            the real scenario described &mdash; multi-soldto, multi-salesorg, split cart,
            split order, dual CPQ approvals, and converged order/quote history.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c) => (
            <Card key={c.href} className="group flex flex-col gap-3 p-6 transition-shadow hover:shadow-md">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-md bg-secondary text-foreground">
                  <c.icon className="h-4 w-4" />
                </span>
                <h3 className="text-base font-semibold">{c.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
              <Link
                href={c.href}
                className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary"
              >
                Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Outcomes */}
      <section className="border-t border-border bg-secondary/30">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-3 md:px-6">
          {[
            { stat: "3 \u2192 1", label: "B2B portals consolidated", icon: Layers },
            { stat: "~38%", label: "Reduction in time-to-quote (target)", icon: LineChart },
            { stat: "100%", label: "Back-office continuity per business", icon: Workflow },
          ].map((s) => (
            <div key={s.label} className="flex items-start gap-4">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-card ring-1 ring-border">
                <s.icon className="h-5 w-5 text-primary" />
              </span>
              <div>
                <div className="text-3xl font-semibold tracking-tight">{s.stat}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
