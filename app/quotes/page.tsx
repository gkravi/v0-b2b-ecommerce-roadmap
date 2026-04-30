"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, Download, FileText, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { quotes } from "@/lib/data/quotes"
import { customer } from "@/lib/data/customer"
import { salesOrgs } from "@/lib/data/sales-orgs"
import { formatCurrency, formatDate } from "@/lib/format"
import { SalesOrgBadge } from "@/components/product/sales-org-badge"
import { StatusPill } from "@/components/history/status-pill"
import { FacetGroup, type Facet } from "@/components/history/facet-filter"
import type { QuoteStatus, SalesOrgCode } from "@/lib/types"

function buildFacets<T extends string>(values: T[]): Facet[] {
  const counts = new Map<T, number>()
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1)
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([key, count]) => ({ key: String(key), label: String(key), count }))
}

export default function QuotesPage() {
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<Set<string>>(new Set())
  const [salesOrgFilter, setSalesOrgFilter] = useState<Set<string>>(new Set())
  const [soldToFilter, setSoldToFilter] = useState<Set<string>>(new Set())
  const [approverFilter, setApproverFilter] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return quotes.filter((qt) => {
      if (q) {
        const hay = [
          qt.quoteNumber,
          qt.opportunityId,
          qt.soldToId,
          qt.salesOrg,
          qt.status,
          qt.approver,
          ...qt.lines.map((l) => `${l.sku} ${l.name}`),
        ]
          .join(" ")
          .toLowerCase()
        if (!hay.includes(q)) return false
      }
      if (statusFilter.size && !statusFilter.has(qt.status)) return false
      if (salesOrgFilter.size && !salesOrgFilter.has(qt.salesOrg)) return false
      if (soldToFilter.size && !soldToFilter.has(qt.soldToId)) return false
      if (approverFilter.size && !approverFilter.has(qt.approver)) return false
      return true
    })
  }, [query, statusFilter, salesOrgFilter, soldToFilter, approverFilter])

  const statusFacets = buildFacets(quotes.map((q) => q.status))
  const salesOrgFacets = buildFacets(quotes.map((q) => q.salesOrg))
  const soldToFacets = buildFacets(quotes.map((q) => q.soldToId))
  const approverFacets = buildFacets(quotes.map((q) => q.approver))

  const totalValue = filtered.reduce((sum, q) => sum + q.total, 0)
  const activeFilterCount =
    statusFilter.size + salesOrgFilter.size + soldToFilter.size + approverFilter.size

  const toggle = (set: Set<string>, setter: (s: Set<string>) => void, key: string) => {
    const next = new Set(set)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    setter(next)
  }
  const clearAll = () => {
    setStatusFilter(new Set())
    setSalesOrgFilter(new Set())
    setSoldToFilter(new Set())
    setApproverFilter(new Set())
    setQuery("")
  }

  const soldToName = (id: string) => customer.soldTos.find((s) => s.id === id)?.name ?? id

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Quote Management
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            Quote History
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground text-pretty">
            All quotes from Salesforce CPQ and SAP CPQ in a single inbox. Track approval status,
            customer acceptance, and convert to orders.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button asChild size="sm" className="gap-2">
            <Link href="/cart">Request New Quote <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="flex flex-col gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Summary
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div>
                <div className="text-2xl font-semibold tabular-nums">{filtered.length}</div>
                <div className="text-[11px] text-muted-foreground">Quotes</div>
              </div>
              <div>
                <div className="text-2xl font-semibold tabular-nums">
                  {formatCurrency(totalValue, "USD")}
                </div>
                <div className="text-[11px] text-muted-foreground">Pipeline</div>
              </div>
            </div>
            {activeFilterCount > 0 && (
              <Button
                onClick={clearAll}
                variant="ghost"
                size="sm"
                className="mt-3 h-7 w-full justify-start gap-1 px-2 text-xs"
              >
                <X className="h-3 w-3" /> Clear {activeFilterCount} filter
                {activeFilterCount > 1 ? "s" : ""}
              </Button>
            )}
          </div>

          <FacetGroup
            title="Status"
            facets={statusFacets}
            selected={statusFilter}
            onToggle={(k) => toggle(statusFilter, setStatusFilter, k)}
            renderLabel={(f) => <StatusPill status={f.label as QuoteStatus} kind="quote" />}
          />
          <FacetGroup
            title="Sales Org"
            facets={salesOrgFacets}
            selected={salesOrgFilter}
            onToggle={(k) => toggle(salesOrgFilter, setSalesOrgFilter, k)}
            renderLabel={(f) => <SalesOrgBadge code={f.key as SalesOrgCode} />}
          />
          <FacetGroup
            title="Sold-to"
            facets={soldToFacets}
            selected={soldToFilter}
            onToggle={(k) => toggle(soldToFilter, setSoldToFilter, k)}
            renderLabel={(f) => (
              <span className="max-w-[140px] truncate text-sm">{soldToName(f.key)}</span>
            )}
          />
          <FacetGroup
            title="CPQ System"
            facets={approverFacets}
            selected={approverFilter}
            onToggle={(k) => toggle(approverFilter, setApproverFilter, k)}
          />
        </aside>

        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by quote number, opportunity, SKU..."
              className="h-11 pl-9"
            />
          </div>

          {filtered.length === 0 ? (
            <Empty className="rounded-lg border border-dashed border-border bg-card">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FileText className="h-5 w-5" />
                </EmptyMedia>
                <EmptyTitle>No quotes match your filters</EmptyTitle>
                <EmptyDescription>
                  Adjust the search query or clear filters to see more quotes.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button variant="outline" onClick={clearAll}>
                  Clear filters
                </Button>
              </EmptyContent>
            </Empty>
          ) : (
            <div className="overflow-hidden rounded-lg border border-border bg-card">
              <div className="hidden grid-cols-[1.2fr_1fr_1.2fr_0.9fr_0.9fr_0.8fr_auto] gap-4 border-b border-border bg-muted/40 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:grid">
                <div>Quote / Opportunity</div>
                <div>Sold-to</div>
                <div>Sales Org / CPQ</div>
                <div>Expires</div>
                <div className="text-right">Total</div>
                <div>Status</div>
                <div />
              </div>
              <ul className="divide-y divide-border">
                {filtered.map((qt) => {
                  const so = salesOrgs[qt.salesOrg]
                  const isExpired = qt.status === "Expired"
                  return (
                    <li key={qt.id}>
                      <Link
                        href={`/quotes/${qt.id}`}
                        className="grid grid-cols-1 items-center gap-3 px-4 py-4 transition-colors hover:bg-secondary/40 md:grid-cols-[1.2fr_1fr_1.2fr_0.9fr_0.9fr_0.8fr_auto]"
                      >
                        <div className="flex flex-col">
                          <span className="font-mono text-sm font-semibold">{qt.quoteNumber}</span>
                          <span className="text-xs text-muted-foreground">
                            Opp {qt.opportunityId}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="truncate text-sm">{soldToName(qt.soldToId)}</span>
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {qt.soldToId}
                          </span>
                        </div>
                        <div className="flex flex-col items-start gap-1">
                          <SalesOrgBadge code={qt.salesOrg} />
                          <span className="text-[11px] text-muted-foreground">
                            {so.name} · {qt.approver}
                          </span>
                        </div>
                        <div
                          className={`text-sm tabular-nums ${
                            isExpired ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground"
                          }`}
                        >
                          {formatDate(qt.expiresAt)}
                        </div>
                        <div className="text-right text-sm font-semibold tabular-nums">
                          {formatCurrency(qt.total, qt.currency)}
                        </div>
                        <div>
                          <StatusPill status={qt.status} kind="quote" />
                        </div>
                        <div className="flex items-center justify-end">
                          <Badge variant="outline" className="gap-1 text-[10px]">
                            -{qt.discountPct}%
                          </Badge>
                          <ArrowRight className="ml-2 h-4 w-4 text-muted-foreground" />
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
