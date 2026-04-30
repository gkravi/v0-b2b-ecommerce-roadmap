"use client"

import { useMemo, useState } from "react"
import { Plus, Search, Trash2, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Input } from "@/components/ui/input"
import { products } from "@/lib/data/products"
import { usePortal } from "@/lib/store/portal-context"
import { useCart } from "@/lib/store/cart-context"
import { ProductIcon } from "@/components/product/product-icon"
import { SalesOrgBadge } from "@/components/product/sales-org-badge"
import { formatCurrency } from "@/lib/format"
import { getBU, salesOrgs } from "@/lib/data/sales-orgs"
import { toast } from "sonner"
import type { CartLine, Product, SalesOrgCode } from "@/lib/types"
import { BulkUploadDialog } from "@/components/cart/bulk-upload-dialog"

type Pending = {
  product: Product
  salesOrg: SalesOrgCode
  qty: number
}

export default function QuickAddPage() {
  const [q, setQ] = useState("")
  const [pending, setPending] = useState<Pending[]>([])
  const { availableSalesOrgs } = usePortal()
  const { bulkAdd } = useCart()

  const matches = useMemo(() => {
    if (!q.trim()) return [] as Product[]
    const s = q.toLowerCase()
    return products
      .filter((p) =>
        p.availability.some((a) => availableSalesOrgs.includes(a.salesOrg)),
      )
      .filter(
        (p) =>
          p.sku.toLowerCase().includes(s) ||
          p.name.toLowerCase().includes(s) ||
          p.tags.some((t) => t.toLowerCase().includes(s)),
      )
      .slice(0, 8)
  }, [q, availableSalesOrgs])

  function addToPending(p: Product) {
    const avail =
      p.availability.find((a) => availableSalesOrgs.includes(a.salesOrg)) ?? p.availability[0]
    setPending((prev) => {
      const existing = prev.find((x) => x.product.id === p.id && x.salesOrg === avail.salesOrg)
      if (existing) {
        return prev.map((x) =>
          x === existing ? { ...x, qty: x.qty + 1 } : x,
        )
      }
      return [...prev, { product: p, salesOrg: avail.salesOrg, qty: avail.minOrderQty }]
    })
    setQ("")
  }

  function commit() {
    if (pending.length === 0) return
    const entries: { salesOrg: SalesOrgCode; line: CartLine }[] = pending.map((p) => {
      const avail = p.product.availability.find((a) => a.salesOrg === p.salesOrg)!
      return {
        salesOrg: p.salesOrg,
        line: {
          productId: p.product.id,
          sku: p.product.sku,
          name: p.product.name,
          qty: p.qty,
          unitPrice: avail.listPrice,
          icon: p.product.icon,
        },
      }
    })
    bulkAdd(entries)
    toast.success(`${entries.length} line(s) added across ${new Set(entries.map((e) => e.salesOrg)).size} sales org(s)`)
    setPending([])
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <div className="mb-6 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
            <Zap className="h-4 w-4" />
          </span>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Quick add</h1>
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Type a SKU, partial name, or tag and add directly to your cart. The storefront auto-routes
          each line to the right sales org.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="p-5">
          <div className="relative">
            <InputGroup>
              <InputGroupAddon>
                <Search className="h-4 w-4 text-muted-foreground" />
              </InputGroupAddon>
              <InputGroupInput
                autoFocus
                placeholder="Search by SKU, name or tag (e.g. IA-EXP, thermostat, BACnet)"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </InputGroup>
            {matches.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-lg border border-border bg-popover p-1 shadow-lg">
                {matches.map((p) => {
                  const avail =
                    p.availability.find((a) => availableSalesOrgs.includes(a.salesOrg)) ?? p.availability[0]
                  const bu = getBU(avail.salesOrg)
                  return (
                    <button
                      key={p.id}
                      onClick={() => addToPending(p)}
                      className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-secondary"
                    >
                      <span
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-md"
                        style={{ background: `color-mix(in oklab, var(--${bu.colorToken}) 12%, transparent)` }}
                      >
                        <ProductIcon name={p.icon} className="h-4 w-4" style={{ color: `var(--${bu.colorToken})` }} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="font-mono text-[10px] text-muted-foreground">{p.sku}</div>
                        <div className="truncate text-sm font-medium">{p.name}</div>
                      </div>
                      <SalesOrgBadge code={avail.salesOrg} />
                      <span className="font-mono text-xs">
                        {formatCurrency(avail.listPrice, salesOrgs[avail.salesOrg].currency)}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="mt-4 text-xs text-muted-foreground">
            Pending lines ({pending.length})
          </div>
          <div className="mt-2 divide-y divide-border rounded-lg border border-border">
            {pending.length === 0 && (
              <div className="p-4 text-sm text-muted-foreground">
                Nothing pending yet. Search above to add lines.
              </div>
            )}
            {pending.map((p, idx) => {
              const avail = p.product.availability.find((a) => a.salesOrg === p.salesOrg)!
              const bu = getBU(p.salesOrg)
              return (
                <div key={`${p.product.id}-${idx}`} className="flex items-center gap-3 p-3">
                  <span
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-md"
                    style={{ background: `color-mix(in oklab, var(--${bu.colorToken}) 12%, transparent)` }}
                  >
                    <ProductIcon name={p.product.icon} className="h-4 w-4" style={{ color: `var(--${bu.colorToken})` }} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-1 text-sm font-medium">{p.product.name}</div>
                    <div className="font-mono text-[10px] text-muted-foreground">{p.product.sku}</div>
                  </div>
                  <SalesOrgBadge code={p.salesOrg} />
                  <Input
                    type="number"
                    className="h-8 w-20 text-center font-mono"
                    value={p.qty}
                    onChange={(e) => {
                      const v = Number.parseInt(e.target.value, 10) || 0
                      setPending((prev) => prev.map((x, i) => (i === idx ? { ...x, qty: v } : x)))
                    }}
                  />
                  <span className="w-24 text-right font-mono text-sm">
                    {formatCurrency(avail.listPrice * p.qty, salesOrgs[p.salesOrg].currency)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setPending((prev) => prev.filter((_, i) => i !== idx))}
                    aria-label="Remove"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )
            })}
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setPending([])} disabled={pending.length === 0}>
              Clear pending
            </Button>
            <Button onClick={commit} disabled={pending.length === 0} className="gap-2">
              <Plus className="h-4 w-4" /> Add {pending.length} line(s) to cart
            </Button>
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Or upload in bulk
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Have a long PO or spares list? Paste a CSV/PO line list and the storefront splits it
            across sales orgs automatically.
          </p>
          <div className="mt-3">
            <BulkUploadDialog />
          </div>

          <div className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Supported SKUs (sample)
          </div>
          <ul className="mt-2 space-y-1 font-mono text-[11px] text-muted-foreground">
            <li>IA-EXP-C300-PM</li>
            <li>IA-SMV-800</li>
            <li>BA-TST-T7-PRO</li>
            <li>BA-VAV-CTRL-V8</li>
            <li>PT-CAT-RFG-X12</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
