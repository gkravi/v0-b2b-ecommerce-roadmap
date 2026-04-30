"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Check,
  Clock,
  FileSpreadsheet,
  GitMerge,
  Headphones,
  Layers,
  PhoneCall,
  ShoppingCart,
  Sparkles,
  Users,
  X,
  Zap,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

type Row = {
  capability: string
  before: string
  after: string
  metric?: string
  icon: React.ComponentType<{ className?: string }>
}

const rows: Row[] = [
  {
    capability: "Customer with multiple sold-tos / sales orgs",
    before: "Separate logins per BU. Customer juggles 3 portals to buy across IA / BA / PT.",
    after: "Single login. Sold-to switcher in the header surfaces every entitled sales org.",
    metric: "1 login vs 3+",
    icon: Users,
  },
  {
    capability: "Material visibility per sales org",
    before: "User cannot tell which catalog a SKU lives in. Calls CSR to confirm.",
    after: "PLP filters by sales org and a 'View Buying Options' modal exposes price + ATP per org.",
    metric: "−40% time-to-find",
    icon: Layers,
  },
  {
    capability: "Pricing on the product list",
    before: "List price varies per BU and is hidden behind login walls; surprise at checkout.",
    after: "Default sales-org list price on the card; full per-org buying options on demand.",
    metric: "Transparent",
    icon: ShoppingCart,
  },
  {
    capability: "Cart per sales org",
    before: "One cart silently mixes items from different orgs and breaks at checkout.",
    after: "A separate cart is created per sales org with its own currency, terms and checkout.",
    metric: "0 mis-shipments",
    icon: GitMerge,
  },
  {
    capability: "Quick add by part number",
    before: "Buyers paste part numbers into email and wait for a CSR to add them.",
    after: "Inline Quick Add searches the catalog and drops items into the right sales-org cart.",
    metric: "−60% line-entry time",
    icon: Zap,
  },
  {
    capability: "Bulk upload / PO upload",
    before: "PO PDFs emailed to inside sales; manual re-keying into ERP.",
    after: "CSV / paste / PO upload validates SKUs, splits per sales org, lands in cart.",
    metric: "100s of lines / sec",
    icon: FileSpreadsheet,
  },
  {
    capability: "Save / delete / export cart",
    before: "Cart loss on session timeout. No way to share a cart with a colleague.",
    after: "Save named carts, restore, export to CSV, share — all backed by the cart service.",
    metric: "Zero lost carts",
    icon: ShoppingCart,
  },
  {
    capability: "Request quote from cart",
    before: "Customer emails a request; CSR re-keys into Salesforce CPQ; days of latency.",
    after: "One click in cart creates a Quote with required-by date and notes; CPQ rules applied.",
    metric: "−35% turnaround",
    icon: FileSpreadsheet,
  },
  {
    capability: "Order history & details",
    before: "Order numbers only; no PO, ship-to or status filters; details require CSR call.",
    after: "Faceted search on PO, sold-to, ship-to, status; full header + line details with tracking.",
    metric: "−30% CSR calls",
    icon: Clock,
  },
  {
    capability: "Quote history & details",
    before: "Quotes live in CPQ; customer cannot self-serve, must email a sales rep.",
    after: "Same faceted search and detail layout as orders; convert quote to cart in one click.",
    metric: "+15% conversion",
    icon: FileSpreadsheet,
  },
  {
    capability: "Storefront vs backoffice",
    before: "CSRs use a different tool with different data; status mismatches are common.",
    after: "Converged shell — CSRs see exactly what the customer sees, can take over carts, audit trail.",
    metric: "+25% FCR",
    icon: Headphones,
  },
  {
    capability: "Time-to-ship a UI change",
    before: "6–9 month backoffice release cycles block storefront experiments.",
    after: "Storefront ships weekly on Vercel; backoffice ships independently.",
    metric: "10× faster",
    icon: Sparkles,
  },
]

export default function ComparisonPage() {
  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-secondary/40 to-background">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4 gap-1.5">
              <ArrowRight className="h-3 w-3" /> Old vs new
            </Badge>
            <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
              Side-by-side: today&apos;s journey vs the converged MACH journey.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground">
              Capability for capability, what changes when one customer ID,
              one cart service and one quote service replace the patchwork.
            </p>
          </div>
        </div>
      </section>

      {/* Personas split */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Users, title: "Buyer", desc: "Self-serves across every BU with one login." },
            { icon: Headphones, title: "CSR", desc: "Acts on the same cart and quote, no swivel-chair." },
            { icon: PhoneCall, title: "Sales Rep", desc: "Negotiates with CPQ rules surfaced in the storefront." },
          ].map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-xl border border-border bg-card p-5"
            >
              <p.icon className="h-5 w-5 text-primary" />
              <div className="mt-3 text-lg font-semibold">{p.title}</div>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="grid grid-cols-12 border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <div className="col-span-12 px-5 py-3 md:col-span-3">Capability</div>
            <div className="hidden border-l border-border px-5 py-3 md:col-span-4 md:block">
              Today
            </div>
            <div className="hidden border-l border-border px-5 py-3 md:col-span-4 md:block">
              Converged MACH
            </div>
            <div className="hidden border-l border-border px-5 py-3 text-right md:col-span-1 md:block">
              Impact
            </div>
          </div>

          <div className="divide-y divide-border">
            {rows.map((r, i) => (
              <motion.div
                key={r.capability}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: Math.min(i * 0.03, 0.3) }}
                className="grid grid-cols-12 items-stretch"
              >
                <div className="col-span-12 flex items-start gap-3 border-b border-border px-5 py-4 md:col-span-3 md:border-b-0">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                    <r.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{r.capability}</div>
                    {r.metric ? (
                      <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-mono font-semibold text-primary md:hidden">
                        {r.metric}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="col-span-12 border-b border-border px-5 py-4 md:col-span-4 md:border-b-0 md:border-l">
                  <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground md:hidden">
                    <X className="h-3 w-3 text-destructive" /> Today
                  </div>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <X className="mt-0.5 hidden h-4 w-4 shrink-0 text-destructive md:block" />
                    <span>{r.before}</span>
                  </div>
                </div>

                <div className="col-span-12 px-5 py-4 md:col-span-4 md:border-l md:border-border">
                  <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary md:hidden">
                    <Check className="h-3 w-3" /> Converged MACH
                  </div>
                  <div className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 hidden h-4 w-4 shrink-0 text-primary md:block" />
                    <span>{r.after}</span>
                  </div>
                </div>

                <div className="hidden items-center justify-end px-5 py-4 md:col-span-1 md:flex md:border-l md:border-border">
                  {r.metric ? (
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-right font-mono text-[11px] font-semibold text-primary">
                      {r.metric}
                    </span>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-xl border border-border bg-card p-6 md:flex-row md:p-8">
          <div className="max-w-xl">
            <h3 className="text-xl font-bold tracking-tight">
              Want to see how the storefront stitches it all together?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Walk through the live demo: switch sold-tos, view buying options,
              fill multiple carts, request a quote, then check order and quote
              history.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/portal"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary"
            >
              Try the portal
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Start shopping <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
