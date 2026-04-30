"use client"

import { motion } from "framer-motion"
import {
  Boxes,
  Cloud,
  Code2,
  Cpu,
  Database,
  Factory,
  FileSpreadsheet,
  Globe,
  Headphones,
  Layers,
  Layout,
  Lock,
  Network,
  Package,
  Plug,
  RefreshCw,
  Search,
  Server,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Tags,
  Truck,
  Users,
  Workflow,
  Zap,
} from "lucide-react"
import { ArchLayer, ArchNode } from "@/components/architecture/arch-node"
import { FlowLine } from "@/components/architecture/flow-line"
import { Badge } from "@/components/ui/badge"

const machPillars = [
  {
    letter: "M",
    title: "Microservices",
    desc: "Independently deployable domain services for catalog, pricing, cart, order, quote and CPQ.",
    icon: Boxes,
  },
  {
    letter: "A",
    title: "API-first",
    desc: "Every capability exposed through stable, versioned APIs (REST + GraphQL BFF).",
    icon: Plug,
  },
  {
    letter: "C",
    title: "Cloud-native",
    desc: "Elastic, observable, and resilient. Edge rendering on Vercel with global CDN.",
    icon: Cloud,
  },
  {
    letter: "H",
    title: "Headless",
    desc: "Decouple presentation from commerce so every touchpoint reuses the same APIs.",
    icon: Layout,
  },
]

export default function ArchitecturePage() {
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
              <Sparkles className="h-3 w-3" /> MACH Reference Architecture
            </Badge>
            <h1 className="text-balance text-4xl font-bold tracking-tight md:text-6xl">
              From a fragmented stack to one composable commerce fabric.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              A single API-first platform that converges the storefront and the
              backoffice. Every sales org, every persona, every channel — fed by
              the same domain services.
            </p>
          </div>
        </div>
      </section>

      {/* TODAY vs TOMORROW */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="mb-10 flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              The shift
            </div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Two stacks, one outcome
            </h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            A side-by-side of where most enterprises are today, and where MACH
            takes them.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* TODAY */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-xl border border-border bg-card p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Today
                </div>
                <div className="text-lg font-semibold">Monolith + silos</div>
              </div>
              <Badge variant="outline" className="border-destructive/40 text-destructive">
                Friction
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {["Storefront IA", "Storefront BA", "Storefront PT", "Sales Portal", "Distributor Portal"].map(
                  (s) => (
                    <span
                      key={s}
                      className="rounded-md border border-dashed border-border bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {s}
                    </span>
                  ),
                )}
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Point-to-point integrations
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    "ERP ⇄ Storefront IA",
                    "ERP ⇄ Storefront BA",
                    "CPQ ⇄ Sales Portal",
                    "PIM ⇄ Each storefront",
                    "OMS ⇄ Custom adapters",
                    "Pricing ⇄ Spreadsheets",
                  ].map((s) => (
                    <span
                      key={s}
                      className="rounded border border-border bg-muted/30 px-2 py-1 font-mono text-[10px] text-muted-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Backoffice (monolith)
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {["SAP ECC", "Custom Pricing", "Legacy CPQ", "Static PIM", "Manual OMS"].map((s) => (
                    <span
                      key={s}
                      className="rounded-md bg-secondary px-2.5 py-1 text-secondary-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                  Each BU runs its own storefront with duplicated catalog logic
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                  Pricing & inventory drift between channels and CSR tools
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                  6–9 month release cycles for any storefront change
                </li>
              </ul>
            </div>
          </motion.div>

          {/* TOMORROW */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative overflow-hidden rounded-xl border border-primary/30 bg-card p-6 ring-1 ring-primary/10"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Tomorrow
                </div>
                <div className="text-lg font-semibold">MACH composable</div>
              </div>
              <Badge className="gap-1 bg-primary text-primary-foreground hover:bg-primary">
                <Zap className="h-3 w-3" /> Velocity
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-background p-4">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Unified experience layer
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {["Web (Next.js)", "Mobile", "CSR Console", "Partner Portal", "Field App"].map((s) => (
                    <span
                      key={s}
                      className="rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-primary"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-center py-1">
                <FlowLine height={28} count={2} />
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Composable domain services
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {["Catalog", "Pricing", "Cart", "Order", "Quote", "Customer"].map((s) => (
                    <span
                      key={s}
                      className="rounded-md bg-secondary px-2.5 py-1 text-center text-secondary-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  One catalog & pricing service powers every BU and channel
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  CSR and customer see the same cart, quote, and inventory
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Storefront ships weekly, backoffice rolls out independently
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MACH PILLARS */}
      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <div className="mb-10 max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              The four pillars
            </div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              MACH, in plain language
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {machPillars.map((p, i) => (
              <motion.div
                key={p.letter}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
                    <p.icon className="h-4 w-4" />
                  </div>
                  <div className="font-mono text-4xl font-bold leading-none text-muted-foreground/30 transition-colors group-hover:text-primary/40">
                    {p.letter}
                  </div>
                </div>
                <div className="text-base font-semibold">{p.title}</div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TARGET ARCHITECTURE — animated layered diagram */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="mb-10 max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Target state
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            The animated reference architecture
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Watch a request travel from a customer touchpoint, through the
            experience and composition layers, into domain services and finally
            into the system of record. Every layer is independently scalable
            and replaceable.
          </p>
        </div>

        <div className="relative space-y-3 rounded-2xl border border-border bg-gradient-to-b from-card to-background p-4 md:p-6">
          <ArchLayer label="Touchpoints" description="Channels & personas" tone="primary">
            <ArchNode icon={Globe} title="Web Storefront" subtitle="Next.js on Vercel" tone="primary" />
            <ArchNode icon={Smartphone} title="Mobile App" subtitle="Field & buyer" />
            <ArchNode icon={Headphones} title="CSR Console" subtitle="Converged backoffice" />
            <ArchNode icon={Users} title="Partner Portal" subtitle="Distributors & resellers" />
            <ArchNode icon={Truck} title="Field Service" subtitle="On-site reps" />
          </ArchLayer>

          <div className="flex justify-center">
            <FlowLine count={3} delay={0} />
          </div>

          <ArchLayer label="Experience layer" description="Edge rendering, ISR, personalization" tone="primary">
            <ArchNode icon={Layout} title="Next.js / React" subtitle="App Router, RSC" tone="primary" />
            <ArchNode icon={Cloud} title="Vercel Edge" subtitle="CDN, image opt." tone="primary" />
            <ArchNode icon={Search} title="Search" subtitle="Algolia / Coveo" />
            <ArchNode icon={Sparkles} title="Personalization" subtitle="A/B + ML" />
          </ArchLayer>

          <div className="flex justify-center">
            <FlowLine count={3} delay={0.3} />
          </div>

          <ArchLayer label="Composition / BFF" description="GraphQL gateway + auth" tone="accent">
            <ArchNode icon={Network} title="GraphQL Gateway" subtitle="Federated schema" tone="accent" />
            <ArchNode icon={Lock} title="Identity & SSO" subtitle="OIDC, B2B IdP" tone="accent" />
            <ArchNode icon={ShieldCheck} title="Authorization" subtitle="Sold-to entitlements" tone="accent" />
            <ArchNode icon={Workflow} title="Orchestration" subtitle="Sagas & workflows" tone="accent" />
          </ArchLayer>

          <div className="flex justify-center">
            <FlowLine count={3} delay={0.6} />
          </div>

          <ArchLayer label="Domain microservices" description="Independently deployable">
            <ArchNode icon={Package} title="Catalog" subtitle="PIM-backed" />
            <ArchNode icon={Tags} title="Pricing" subtitle="Per sales org" />
            <ArchNode icon={ShoppingCart} title="Cart" subtitle="Per sales org" />
            <ArchNode icon={FileSpreadsheet} title="Quote" subtitle="CPQ-aware" />
            <ArchNode icon={Boxes} title="Inventory & ATP" />
            <ArchNode icon={Users} title="Customer" subtitle="Sold-to / ship-to" />
            <ArchNode icon={Code2} title="Order" subtitle="Lifecycle" />
            <ArchNode icon={RefreshCw} title="Returns / RMA" />
          </ArchLayer>

          <div className="flex justify-center">
            <FlowLine count={3} delay={0.9} />
          </div>

          <ArchLayer label="Integration / iPaaS" description="Events, MQ, webhooks" tone="muted">
            <ArchNode icon={Plug} title="Event Bus" subtitle="Kafka / EventBridge" tone="muted" />
            <ArchNode icon={Workflow} title="Workflow SDK" subtitle="Durable jobs" tone="muted" />
            <ArchNode icon={Cpu} title="Cache" subtitle="Redis / Upstash" tone="muted" />
          </ArchLayer>

          <div className="flex justify-center">
            <FlowLine count={3} delay={1.2} />
          </div>

          <ArchLayer label="Systems of record" description="Single source of truth" tone="muted">
            <ArchNode icon={Server} title="SAP S/4HANA" subtitle="ERP" tone="muted" />
            <ArchNode icon={Database} title="Salesforce CPQ" subtitle="Quote-to-cash" tone="muted" />
            <ArchNode icon={Layers} title="PIM" subtitle="Master catalog" tone="muted" />
            <ArchNode icon={Factory} title="OMS / WMS" subtitle="Fulfilment" tone="muted" />
          </ArchLayer>
        </div>

        <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-muted-foreground">
          Particles flowing between layers represent live API calls and events.
          Each domain service can be replaced or upgraded without rebuilding the
          storefront — that is the core promise of MACH.
        </p>
      </section>

      {/* CONVERGENCE */}
      <section className="border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <div className="mb-10 max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Storefront × backoffice
            </div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              One platform. Two audiences. Same data.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The CSR sees what the customer sees — and acts on the same cart,
              the same quote, the same inventory in real time.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-xl border border-primary/30 bg-card p-5"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Storefront
              </div>
              <div className="mt-1 text-lg font-semibold">Self-service for buyers</div>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" /> Browse & buying options</li>
                <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" /> Multi-cart per sales org</li>
                <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" /> Quick add, bulk upload, request quote</li>
              </ul>
            </motion.div>

            <div className="hidden items-center justify-center lg:flex">
              <div className="relative h-40 w-px bg-gradient-to-b from-transparent via-border to-transparent">
                <FlowLine height={160} count={4} />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-xl border border-accent/30 bg-card p-5"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Backoffice
              </div>
              <div className="mt-1 text-lg font-semibold">Assisted by CSR</div>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" /> Order on behalf of, take-over cart</li>
                <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" /> Quote builder with the same CPQ rules</li>
                <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" /> Returns, credit checks, fulfilment overrides</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
