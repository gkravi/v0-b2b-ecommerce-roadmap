"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Building2, Calendar, CheckCircle2, ClipboardCheck, Download, FileSignature, Hash, Percent, Printer, ShoppingCart, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { quotes } from "@/lib/data/quotes"
import { customer } from "@/lib/data/customer"
import { salesOrgs } from "@/lib/data/sales-orgs"
import { formatCurrency, formatDate } from "@/lib/format"
import { SalesOrgBadge } from "@/components/product/sales-org-badge"
import { StatusPill } from "@/components/history/status-pill"
import { cn } from "@/lib/utils"

const quoteFlow = [
  { key: "Draft", label: "Draft", icon: FileSignature },
  { key: "Submitted", label: "Submitted", icon: ClipboardCheck },
  { key: "In Approval", label: "In Approval", icon: Sparkles },
  { key: "Approved", label: "Approved", icon: CheckCircle2 },
  { key: "Customer Acceptance", label: "Customer Accept", icon: FileSignature },
  { key: "Won", label: "Won", icon: CheckCircle2 },
] as const

function getQuoteStatusIndex(status: string) {
  if (status === "Expired" || status === "Rejected") return -1
  return quoteFlow.findIndex((s) => s.key === status)
}

export default function QuoteDetailPage() {
  const params = useParams<{ id: string }>()
  const qt = quotes.find((q) => q.id === params.id)

  if (!qt) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center md:px-6">
        <h1 className="text-2xl font-semibold">Quote not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn&apos;t find a quote with id {params.id}.
        </p>
        <Button asChild className="mt-6">
          <Link href="/quotes">Back to quotes</Link>
        </Button>
      </main>
    )
  }

  const soldTo = customer.soldTos.find((s) => s.id === qt.soldToId)
  const so = salesOrgs[qt.salesOrg]
  const statusIdx = getQuoteStatusIndex(qt.status)
  const subtotal = qt.lines.reduce((s, l) => s + l.listPrice * l.qty, 0)
  const discount = subtotal - qt.total
  const isAcceptable = ["Approved", "Customer Acceptance"].includes(qt.status)

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Button asChild variant="ghost" size="sm" className="gap-1 px-2">
          <Link href="/quotes">
            <ArrowLeft className="h-4 w-4" /> All quotes
          </Link>
        </Button>
      </div>

      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Quote
          </p>
          <h1 className="mt-1 flex flex-wrap items-center gap-3 text-3xl font-semibold tracking-tight md:text-4xl">
            <span className="font-mono">{qt.quoteNumber}</span>
            <StatusPill status={qt.status} kind="quote" />
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Created {formatDate(qt.createdAt)} · Opportunity{" "}
            <span className="font-mono text-foreground">{qt.opportunityId}</span> · Approved via{" "}
            {qt.approver}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Printer className="h-4 w-4" /> Print
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" /> Download PDF
          </Button>
          <Button size="sm" className="gap-2" disabled={!isAcceptable}>
            <ShoppingCart className="h-4 w-4" /> Convert to Order
          </Button>
        </div>
      </header>

      {/* Approval flow */}
      {statusIdx >= 0 ? (
        <div className="mb-6 rounded-lg border border-border bg-card p-4 md:p-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Approval Flow
            </div>
            <div className="text-xs text-muted-foreground">
              {qt.approver}
            </div>
          </div>
          <ol className="grid grid-cols-2 gap-2 md:grid-cols-6">
            {quoteFlow.map((step, i) => {
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
                        "text-xs font-medium",
                        reached ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      ) : (
        <div className="mb-6 rounded-lg border border-rose-500/30 bg-rose-500/5 p-4 text-sm text-rose-700 dark:text-rose-400">
          This quote {qt.status === "Expired" ? "expired" : "was rejected"} on{" "}
          {formatDate(qt.expiresAt)}. Request a new quote to continue.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <section className="overflow-hidden rounded-lg border border-border bg-card">
          <header className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold">Quote Lines</h2>
            <span className="text-xs text-muted-foreground">{qt.lines.length} lines</span>
          </header>
          <div className="hidden grid-cols-[2fr_0.6fr_0.9fr_0.7fr_0.9fr] gap-4 border-b border-border bg-muted/40 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:grid">
            <div>Material</div>
            <div className="text-right">Qty</div>
            <div className="text-right">List Price</div>
            <div className="text-right">Discount</div>
            <div className="text-right">Net Price</div>
          </div>
          {qt.lines.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              This draft quote has no lines yet.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {qt.lines.map((line, i) => (
                <li
                  key={`${line.sku}-${i}`}
                  className="grid grid-cols-1 items-center gap-2 px-4 py-3 md:grid-cols-[2fr_0.6fr_0.9fr_0.7fr_0.9fr]"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{line.name}</span>
                    <span className="font-mono text-[11px] text-muted-foreground">{line.sku}</span>
                  </div>
                  <div className="text-right text-sm tabular-nums">{line.qty}</div>
                  <div className="text-right text-sm tabular-nums text-muted-foreground line-through">
                    {formatCurrency(line.listPrice, qt.currency)}
                  </div>
                  <div className="text-right text-sm tabular-nums text-emerald-600 dark:text-emerald-400">
                    -{line.discountPct}%
                  </div>
                  <div className="text-right text-sm font-semibold tabular-nums">
                    {formatCurrency(Math.round(line.netPrice), qt.currency)}
                  </div>
                </li>
              ))}
            </ul>
          )}
          <footer className="border-t border-border bg-muted/30 px-4 py-3">
            <dl className="ml-auto flex max-w-sm flex-col gap-1 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">List Subtotal</dt>
                <dd className="tabular-nums">{formatCurrency(subtotal, qt.currency)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1 text-muted-foreground">
                  <Percent className="h-3 w-3" /> Discount ({qt.discountPct}%)
                </dt>
                <dd className="tabular-nums text-emerald-600 dark:text-emerald-400">
                  -{formatCurrency(discount > 0 ? discount : 0, qt.currency)}
                </dd>
              </div>
              <Separator className="my-1" />
              <div className="flex items-center justify-between text-base font-semibold">
                <dt>Quote Total</dt>
                <dd className="tabular-nums">{formatCurrency(qt.total, qt.currency)}</dd>
              </div>
            </dl>
          </footer>
        </section>

        <aside className="flex flex-col gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Header Detail
            </h2>
            <dl className="space-y-3 text-sm">
              <div className="flex items-start justify-between gap-3">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <Hash className="h-3.5 w-3.5" /> Quote
                </dt>
                <dd className="font-mono font-medium">{qt.quoteNumber}</dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-muted-foreground">Opportunity</dt>
                <dd className="font-mono">{qt.opportunityId}</dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" /> Created
                </dt>
                <dd>{formatDate(qt.createdAt)}</dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-muted-foreground">Expires</dt>
                <dd>{formatDate(qt.expiresAt)}</dd>
              </div>
              <Separator />
              <div className="flex items-start justify-between gap-3">
                <dt className="text-muted-foreground">Sales Org</dt>
                <dd className="flex flex-col items-end gap-1">
                  <SalesOrgBadge code={qt.salesOrg} />
                  <span className="text-[11px] text-muted-foreground">{so.name}</span>
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-muted-foreground">CPQ System</dt>
                <dd className="font-mono text-xs">{qt.approver}</dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-muted-foreground">Currency</dt>
                <dd className="font-mono">{qt.currency}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Building2 className="h-3.5 w-3.5" /> Sold-to
            </h2>
            <p className="text-sm font-medium">{soldTo?.name}</p>
            <p className="font-mono text-[11px] text-muted-foreground">{qt.soldToId}</p>
            <Separator className="my-3" />
            <p className="text-xs text-muted-foreground">Payment Terms</p>
            <p className="text-sm">{soldTo?.paymentTerms}</p>
          </div>

          {isAcceptable && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Ready to convert
              </p>
              <p className="mt-2 text-sm">
                This quote is approved and ready to be converted into a sales order.
              </p>
              <Button size="sm" className="mt-3 w-full gap-2">
                <ShoppingCart className="h-4 w-4" /> Convert to Order
              </Button>
            </div>
          )}
        </aside>
      </div>
    </main>
  )
}
