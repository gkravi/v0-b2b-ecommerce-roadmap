"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Building2, Calendar, CheckCircle2, Download, FileText, Hash, MapPin, Package, Printer, Repeat, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { orders } from "@/lib/data/orders"
import { customer } from "@/lib/data/customer"
import { salesOrgs } from "@/lib/data/sales-orgs"
import { formatCurrency, formatDate } from "@/lib/format"
import { SalesOrgBadge } from "@/components/product/sales-org-badge"
import { StatusPill } from "@/components/history/status-pill"
import { cn } from "@/lib/utils"

const statusFlow: { key: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "Pending", label: "Pending", icon: FileText },
  { key: "Approved", label: "Approved", icon: CheckCircle2 },
  { key: "Processing", label: "Processing", icon: Package },
  { key: "Shipped", label: "Shipped", icon: Truck },
  { key: "Delivered", label: "Delivered", icon: CheckCircle2 },
]

function getStatusIndex(status: string) {
  if (status === "Cancelled") return -1
  return statusFlow.findIndex((s) => s.key === status)
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>()
  const order = orders.find((o) => o.id === params.id)

  if (!order) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center md:px-6">
        <h1 className="text-2xl font-semibold">Order not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn&apos;t find an order with id {params.id}.
        </p>
        <Button asChild className="mt-6">
          <Link href="/orders">Back to orders</Link>
        </Button>
      </main>
    )
  }

  const soldTo = customer.soldTos.find((s) => s.id === order.soldToId)
  const shipTo = soldTo?.shipTos.find((sh) => sh.id === order.shipToId)
  const so = salesOrgs[order.salesOrg]
  const statusIdx = getStatusIndex(order.status)
  const subtotal = order.lines.reduce((s, l) => s + l.lineTotal, 0)
  const tax = Math.round(subtotal * 0.0825)
  const shipping = order.lines.length > 0 ? 250 : 0

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Button asChild variant="ghost" size="sm" className="gap-1 px-2">
          <Link href="/orders">
            <ArrowLeft className="h-4 w-4" /> All orders
          </Link>
        </Button>
      </div>

      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Sales Order
          </p>
          <h1 className="mt-1 flex flex-wrap items-center gap-3 text-3xl font-semibold tracking-tight md:text-4xl">
            <span className="font-mono">{order.orderNumber}</span>
            <StatusPill status={order.status} kind="order" />
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Placed on {formatDate(order.placedAt)} · PO{" "}
            <span className="font-mono text-foreground">{order.poNumber}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Printer className="h-4 w-4" /> Print
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" /> Download PDF
          </Button>
          <Button size="sm" className="gap-2">
            <Repeat className="h-4 w-4" /> Reorder
          </Button>
        </div>
      </header>

      {/* Status Tracker */}
      {order.status !== "Cancelled" ? (
        <div className="mb-6 rounded-lg border border-border bg-card p-4 md:p-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Order Progress
            </div>
            <div className="text-xs text-muted-foreground">
              Step {Math.max(0, statusIdx) + 1} of {statusFlow.length}
            </div>
          </div>
          <ol className="grid grid-cols-2 gap-2 md:grid-cols-5">
            {statusFlow.map((step, i) => {
              const Icon = step.icon
              const reached = i <= statusIdx
              const current = i === statusIdx
              return (
                <li key={step.key} className="relative flex items-center gap-3">
                  <span
                    className={cn(
                      "grid h-9 w-9 shrink-0 place-items-center rounded-full ring-2 transition-colors",
                      reached
                        ? "bg-primary text-primary-foreground ring-primary/30"
                        : "bg-muted text-muted-foreground ring-border",
                      current && "ring-4 ring-primary/30",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="flex flex-col">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        reached ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {step.label}
                    </span>
                    {current && (
                      <span className="text-[10px] uppercase tracking-wider text-primary">
                        Current
                      </span>
                    )}
                  </div>
                  {i < statusFlow.length - 1 && (
                    <span
                      className={cn(
                        "absolute left-9 top-1/2 hidden h-px w-[calc(100%-3rem)] -translate-y-1/2 bg-border md:block",
                        reached && i + 1 <= statusIdx && "bg-primary",
                      )}
                    />
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      ) : (
        <div className="mb-6 rounded-lg border border-rose-500/30 bg-rose-500/5 p-4 text-sm text-rose-700 dark:text-rose-400">
          This order was cancelled on {formatDate(order.placedAt)}.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Lines */}
        <section className="overflow-hidden rounded-lg border border-border bg-card">
          <header className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold">Line Items</h2>
            <span className="text-xs text-muted-foreground">{order.lines.length} lines</span>
          </header>
          <div className="hidden grid-cols-[2fr_0.6fr_0.8fr_0.9fr_0.9fr] gap-4 border-b border-border bg-muted/40 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:grid">
            <div>Material</div>
            <div className="text-right">Qty</div>
            <div className="text-right">Unit Price</div>
            <div className="text-right">Line Total</div>
            <div>Status</div>
          </div>
          <ul className="divide-y divide-border">
            {order.lines.map((line, i) => (
              <li
                key={`${line.sku}-${i}`}
                className="grid grid-cols-1 items-center gap-2 px-4 py-3 md:grid-cols-[2fr_0.6fr_0.8fr_0.9fr_0.9fr]"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{line.name}</span>
                  <span className="font-mono text-[11px] text-muted-foreground">{line.sku}</span>
                </div>
                <div className="text-right text-sm tabular-nums">{line.qty}</div>
                <div className="text-right text-sm tabular-nums">
                  {formatCurrency(line.unitPrice, order.currency)}
                </div>
                <div className="text-right text-sm font-semibold tabular-nums">
                  {formatCurrency(line.lineTotal, order.currency)}
                </div>
                <div>
                  <StatusPill status={line.status} kind="order" />
                </div>
              </li>
            ))}
          </ul>
          <footer className="border-t border-border bg-muted/30 px-4 py-3">
            <dl className="ml-auto flex max-w-sm flex-col gap-1 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="tabular-nums">{formatCurrency(subtotal, order.currency)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Estimated Tax</dt>
                <dd className="tabular-nums">{formatCurrency(tax, order.currency)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className="tabular-nums">{formatCurrency(shipping, order.currency)}</dd>
              </div>
              <Separator className="my-1" />
              <div className="flex items-center justify-between text-base font-semibold">
                <dt>Order Total</dt>
                <dd className="tabular-nums">{formatCurrency(order.total, order.currency)}</dd>
              </div>
            </dl>
          </footer>
        </section>

        {/* Header detail */}
        <aside className="flex flex-col gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Header Detail
            </h2>
            <dl className="space-y-3 text-sm">
              <div className="flex items-start justify-between gap-3">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <Hash className="h-3.5 w-3.5" /> Order
                </dt>
                <dd className="font-mono font-medium">{order.orderNumber}</dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" /> PO
                </dt>
                <dd className="font-mono">{order.poNumber}</dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" /> Placed
                </dt>
                <dd>{formatDate(order.placedAt)}</dd>
              </div>
              <Separator />
              <div className="flex items-start justify-between gap-3">
                <dt className="text-muted-foreground">Sales Org</dt>
                <dd className="flex flex-col items-end gap-1">
                  <SalesOrgBadge code={order.salesOrg} />
                  <span className="text-[11px] text-muted-foreground">{so.name}</span>
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-muted-foreground">ERP</dt>
                <dd className="font-mono text-xs">{so.erp}</dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-muted-foreground">Currency</dt>
                <dd className="font-mono">{order.currency}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Building2 className="h-3.5 w-3.5" /> Sold-to
            </h2>
            <p className="text-sm font-medium">{soldTo?.name}</p>
            <p className="font-mono text-[11px] text-muted-foreground">{order.soldToId}</p>
            <Separator className="my-3" />
            <p className="text-xs text-muted-foreground">Payment Terms</p>
            <p className="text-sm">{soldTo?.paymentTerms}</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> Ship-to
            </h2>
            <p className="text-sm font-medium">{shipTo?.name}</p>
            <p className="text-xs text-muted-foreground">{shipTo?.line1}</p>
            <p className="text-xs text-muted-foreground">
              {shipTo?.city}, {shipTo?.state} {shipTo?.postal}
            </p>
            <p className="text-xs text-muted-foreground">{shipTo?.country}</p>
            <p className="mt-2 font-mono text-[11px] text-muted-foreground">{order.shipToId}</p>
          </div>
        </aside>
      </div>
    </main>
  )
}
