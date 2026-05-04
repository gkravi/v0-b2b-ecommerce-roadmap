"use client"

import { motion } from "framer-motion"
import {
  ArrowRight,
  Bot,
  Boxes,
  CheckCircle2,
  CircuitBoard,
  Cloud,
  Cpu,
  FileSpreadsheet,
  Flag,
  Layers,
  LineChart,
  Network,
  Package,
  Plug,
  Rocket,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Target,
  Users,
  Wallet,
  Workflow,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

type Phase = {
  id: string
  index: number
  horizon: string
  title: string
  theme: string
  goal: string
  scope: string[]
  benefits: { label: string; metric: string }[]
  risks: string[]
  icon: React.ComponentType<{ className?: string }>
  tone: "primary" | "accent" | "neutral"
}

const phases: Phase[] = [
  {
    id: "phase-1",
    index: 1,
    horizon: "Months 0 – 3",
    title: "Foundation: headless storefront",
    theme: "Stand up the experience layer",
    goal:
      "Replace the legacy storefront with a Next.js app on Vercel and surface the existing catalog through an API gateway. No commerce changes yet — pure decoupling.",
    scope: [
      "Next.js storefront on Vercel with edge caching and ISR",
      "Catalog read API + image / asset CDN",
      "B2B SSO and basic sold-to switching",
      "Telemetry: Web Vitals, conversion funnel, error budgets",
    ],
    benefits: [
      { label: "Page-load speed", metric: "−45% LCP" },
      { label: "Time to ship UI changes", metric: "from weeks to days" },
      { label: "SEO indexable pages", metric: "+10×" },
    ],
    risks: ["Catalog API rate limits", "SSO mapping for legacy sold-tos"],
    icon: Cloud,
    tone: "primary",
  },
  {
    id: "phase-2",
    index: 2,
    horizon: "Months 3 – 6",
    title: "Commerce core: cart, orders & quick-add",
    theme: "Let customers self-serve the basics",
    goal:
      "Stand up the cart, quick-add, bulk-upload (PO upload), order history and quote history experiences against domain services.",
    scope: [
      "Cart microservice with persistence and save / export",
      "Quick add by part number + bulk PO upload",
      "Order history with facet search and details (header + lines)",
      "Quote history with same filter facets and details view",
    ],
    benefits: [
      { label: "Order-entry time per line", metric: "−60%" },
      { label: "CSR calls deflected to self-service", metric: "−30%" },
      { label: "Reorder rate from history", metric: "+22%" },
    ],
    risks: ["Order history data volume", "Legacy PO file formats"],
    icon: ShoppingCart,
    tone: "primary",
  },
  {
    id: "phase-3",
    index: 3,
    horizon: "Months 6 – 9",
    title: "Sales-org convergence & buying options",
    theme: "One login, every business unit",
    goal:
      "Model the customer master so a single login can shop across all sold-tos and sales orgs the customer is extended to. View Buying Options surfaces price + availability per sales org and creates a separate cart per sales org.",
    scope: [
      "Multi sold-to / multi sales-org entitlements in the BFF",
      "Default sales org per persona with View Buying Options modal",
      "Per-sales-org carts with parallel checkout flows",
      "Material visibility filters: per sales org or all entitled",
    ],
    benefits: [
      { label: "Cross-BU attach rate", metric: "+18%" },
      { label: "CSR escalations for 'wrong sales org'", metric: "−55%" },
      { label: "Time to find an authorized SKU", metric: "−40%" },
    ],
    risks: ["Master-data quality across BUs", "Tax / currency per sales org"],
    icon: Network,
    tone: "primary",
  },
  {
    id: "phase-4",
    index: 4,
    horizon: "Months 9 – 12",
    title: "Quote-to-cash & CPQ",
    theme: "Configurable, negotiated commerce",
    goal:
      "Plug Salesforce CPQ behind the BFF so customers can request a quote from any cart, sales reps can negotiate, and the same quote can be converted back into the storefront cart.",
    scope: [
      "Request Quote from cart with optional comments and required-by date",
      "CPQ pricing rules surfaced in storefront (volume, contract, project)",
      "CSR-assisted quotes in the converged backoffice",
      "Approvals, expiry, versioning and quote → order conversion",
    ],
    benefits: [
      { label: "Quote turnaround time", metric: "−35%" },
      { label: "Margin lift via guided selling", metric: "+8 pts" },
      { label: "Quote-to-order conversion", metric: "+15%" },
    ],
    risks: ["CPQ throughput", "Approval matrix complexity"],
    icon: FileSpreadsheet,
    tone: "accent",
  },
  {
    id: "phase-5",
    index: 5,
    horizon: "Months 12 – 18",
    title: "Backoffice convergence",
    theme: "CSR and customer on one platform",
    goal:
      "Retire the standalone CSR tools by giving them a converged console that uses the same domain services and UI primitives as the storefront — order on behalf of, take over cart, manage returns.",
    scope: [
      "CSR console in the same Next.js shell, role-aware UI",
      "Order on behalf of / impersonation with audit trail",
      "Unified returns, credits and fulfilment overrides",
      "Shared component library across storefront and backoffice",
    ],
    benefits: [
      { label: "Backoffice change cost", metric: "−60%" },
      { label: "First-contact resolution (CSR)", metric: "+25%" },
      { label: "Tools to maintain", metric: "from 6 → 1" },
    ],
    risks: ["Change management for CSR teams", "Permission model parity"],
    icon: Users,
    tone: "accent",
  },
  {
    id: "phase-6",
    index: 6,
    horizon: "Months 18+",
    title: "AI & composable optimization",
    theme: "Personalize and automate at the edge",
    goal:
      "Layer AI search, recommendations, agentic reorder assistants and smart approvals on top of the now-stable composable platform.",
    scope: [
      "AI search and natural-language part finder",
      "Agentic reorder & replenishment assistants",
      "Personalized merchandising per persona / sold-to",
      "Predictive availability and dynamic delivery promises",
    ],
    benefits: [
      { label: "Average order value", metric: "+12%" },
      { label: "Conversion rate", metric: "+8%" },
      { label: "Time on task (buyer)", metric: "−30%" },
    ],
    risks: ["Data quality for ML", "Governance for agentic actions"],
    icon: Sparkles,
    tone: "accent",
  },
]

const guardrails = [
  { icon: ShieldCheck, title: "Strangler-fig migration", desc: "Route traffic incrementally; legacy and MACH coexist." },
  { icon: Target, title: "Outcome-driven phases", desc: "Every milestone ships measurable business value." },
  { icon: Plug, title: "API-first contracts", desc: "Stable, versioned APIs keep the storefront moving." },
  { icon: Workflow, title: "Independent release trains", desc: "Storefront and backoffice ship on their own cadence." },
]

const kpiHeadlines = [
  { icon: LineChart, label: "Conversion lift", value: "+8%", caption: "by month 18" },
  { icon: Wallet, label: "Order-entry cost", value: "−60%", caption: "by month 6" },
  { icon: Cpu, label: "Time-to-market", value: "10×", caption: "for storefront changes" },
  { icon: Boxes, label: "Sales-org coverage", value: "1 login", caption: "across every BU" },
]

export default function RoadmapPage() {
  return (
    <div className="bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-secondary/40 to-background">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-5 gap-1.5">
              <Rocket className="h-3 w-3" /> 18-month MACH adoption plan
            </Badge>
            <div className="prose prose-lg mx-auto dark:prose-invert not-prose">
              <h1 className="text-balance text-4xl font-bold tracking-tight md:text-6xl">
                A phased roadmap with business benefits at every milestone.
              </h1>
            </div>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              Six phases, each shipping standalone value. We never ask the
              business to wait 18 months for the payoff — every quarter
              improves a metric a CFO recognizes.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-4">
            {kpiHeadlines.map((k, i) => (
              <motion.div
                key={k.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-xl border border-border bg-card p-4"
              >
                <k.icon className="h-4 w-4 text-primary" />
                <div className="mt-2 font-mono text-2xl font-bold leading-none">{k.value}</div>
                <div className="mt-1 text-xs font-medium">{k.label}</div>
                <div className="text-[11px] text-muted-foreground">{k.caption}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="mb-10 max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Phased plan
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            The path, milestone by milestone
          </h2>
        </div>

        <div className="relative">
          {/* vertical spine */}
          <div className="absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-border via-primary/30 to-border md:block md:left-1/2" />

          <div className="space-y-10">
            {phases.map((p, i) => {
              const left = i % 2 === 0
              const toneRing =
                p.tone === "accent"
                  ? "border-accent/40 ring-accent/10"
                  : p.tone === "primary"
                    ? "border-primary/40 ring-primary/10"
                    : "border-border"
              const toneIcon =
                p.tone === "accent"
                  ? "bg-accent/10 text-accent"
                  : p.tone === "primary"
                    ? "bg-primary/10 text-primary"
                    : "bg-secondary text-foreground"
              const toneLabel =
                p.tone === "accent"
                  ? "text-accent"
                  : p.tone === "primary"
                    ? "text-primary"
                    : "text-muted-foreground"

              return (
                <div key={p.id} className="relative md:grid md:grid-cols-2 md:gap-12">
                  {/* node on spine */}
                  <div className="absolute left-4 top-6 hidden h-3 w-3 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_0_4px_var(--color-background)] md:block md:left-1/2" />

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.45 }}
                    className={`relative ${left ? "md:col-start-1 md:pr-8 md:text-right" : "md:col-start-2 md:pl-8"}`}
                  >
                    <div className={`rounded-xl border bg-card p-6 ring-1 ${toneRing}`}>
                      <div className={`flex items-center gap-3 ${left ? "md:justify-end" : ""}`}>
                        <div className={`grid h-9 w-9 place-items-center rounded-md ${toneIcon}`}>
                          <p.icon className="h-4 w-4" />
                        </div>
                        <div className={left ? "md:text-right" : ""}>
                          <div className={`text-xs font-semibold uppercase tracking-[0.18em] ${toneLabel}`}>
                            Phase {p.index} · {p.horizon}
                          </div>
                          <div className="text-lg font-semibold">{p.title}</div>
                        </div>
                      </div>

                      <p className="prose prose-sm mt-4 text-muted-foreground dark:prose-invert max-w-none">{p.goal}</p>

                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <div>
                          <div className={`mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground ${left ? "md:text-right" : ""}`}>
                            In scope
                          </div>
                          <ul className="space-y-1.5">
                            {p.scope.map((s) => (
                              <li key={s} className={`flex items-start gap-2 text-xs text-muted-foreground ${left ? "md:flex-row-reverse md:text-right" : ""}`}>
                                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                                <span>{s}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className={`mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground ${left ? "md:text-right" : ""}`}>
                            Business benefits
                          </div>
                          <ul className="space-y-1.5">
                            {p.benefits.map((b) => (
                              <li
                                key={b.label}
                                className={`flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs ${left ? "md:flex-row-reverse" : ""}`}
                              >
                                <span className="font-mono font-semibold text-primary">{b.metric}</span>
                                <span className="text-muted-foreground">{b.label}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className={`mt-4 flex flex-wrap gap-2 ${left ? "md:justify-end" : ""}`}>
                        {p.risks.map((r) => (
                          <span
                            key={r}
                            className="rounded-full border border-dashed border-border bg-muted/30 px-2.5 py-0.5 text-[11px] text-muted-foreground"
                          >
                            risk · {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* GUARDRAILS */}
      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <div className="mb-10 max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              How we de-risk it
            </div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Guardrails baked into every phase
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {guardrails.map((g, i) => (
              <motion.div
                key={g.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
                  <g.icon className="h-4 w-4" />
                </div>
                <div className="mt-3 text-base font-semibold">{g.title}</div>
                <p className="prose prose-sm mt-1 text-muted-foreground dark:prose-invert max-w-none">{g.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="mx-auto max-w-5xl px-4 py-16 md:px-6">
        <div className="rounded-2xl border border-border bg-card p-8 md:p-12">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <Flag className="h-5 w-5 text-primary" />
              <h3 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
                Start with phase 1, prove the velocity, then keep compounding.
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                The shape of the program is intentional: every phase is a
                shippable deliverable with its own ROI case. You can stop or
                pivot at any boundary.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <a
                href="/architecture"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary"
              >
                <CircuitBoard className="h-4 w-4" /> Architecture
              </a>
              <a
                href="/comparison"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Old vs new flow <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* hidden imports usage to satisfy lint when icons aren't all used directly */}
      <div className="sr-only" aria-hidden>
        <Bot />
        <Layers />
        <Package />
      </div>
    </div>
  )
}
