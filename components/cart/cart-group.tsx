"use client"

import {
  ChevronRight,
  FileText,
  Minus,
  Plus,
  Trash2,
  Truck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import type { CartGroup } from "@/lib/types"
import { ProductIcon } from "@/components/product/product-icon"
import { SalesOrgBadge } from "@/components/product/sales-org-badge"
import { getBU, salesOrgs } from "@/lib/data/sales-orgs"
import { useCart } from "@/lib/store/cart-context"
import { formatCurrency } from "@/lib/format"
import { toast } from "sonner"
import Link from "next/link"

export function CartGroupCard({ group }: { group: CartGroup }) {
  const { updateQty, removeLine, clearGroup, setPoNumber, setNotes } = useCart()
  const subtotal = group.lines.reduce((s, l) => s + l.qty * l.unitPrice, 0)
  const so = salesOrgs[group.salesOrg]
  const bu = getBU(group.salesOrg)

  return (
    <Card className="overflow-hidden p-0">
      <div
        className="flex items-center justify-between gap-3 border-b border-border px-5 py-3"
        style={{
          background: `linear-gradient(90deg, color-mix(in oklab, var(--${bu.colorToken}) 8%, transparent), transparent)`,
        }}
      >
        <div className="flex items-center gap-3">
          <SalesOrgBadge code={group.salesOrg} />
          <div className="text-sm">
            <div className="font-medium leading-tight">{bu.name}</div>
            <div className="text-[11px] text-muted-foreground">
              ERP {so.erp} · CPQ {so.cpq} · {so.currency}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link href={`/quotes?from=cart&so=${group.salesOrg}`}>
              <FileText className="h-3.5 w-3.5" /> Request quote
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-muted-foreground hover:text-destructive"
            onClick={() => {
              clearGroup(group.salesOrg)
              toast.success(`${group.salesOrg} cart cleared`)
            }}
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear
          </Button>
        </div>
      </div>

      <div className="divide-y divide-border">
        {group.lines.map((l) => (
          <div key={l.productId} className="flex items-center gap-4 p-4">
            <div
              className="grid h-12 w-12 shrink-0 place-items-center rounded-md border border-border"
              style={{ background: `color-mix(in oklab, var(--${bu.colorToken}) 10%, transparent)` }}
            >
              <ProductIcon name={l.icon} className="h-5 w-5" style={{ color: `var(--${bu.colorToken})` }} />
            </div>
            <div className="min-w-0 flex-1">
              <Link href={`/products/${l.productId}`} className="line-clamp-1 text-sm font-medium hover:underline">
                {l.name}
              </Link>
              <div className="font-mono text-[11px] text-muted-foreground">{l.sku}</div>
            </div>

            <div className="hidden sm:block">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Unit</div>
              <div className="font-mono text-sm">{formatCurrency(l.unitPrice, so.currency)}</div>
            </div>

            <div className="inline-flex items-center rounded-md border border-border">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateQty(group.salesOrg, l.productId, l.qty - 1)}
                aria-label="Decrease"
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <Input
                className="h-8 w-14 border-0 bg-transparent text-center font-mono shadow-none focus-visible:ring-0"
                value={l.qty}
                onChange={(e) => updateQty(group.salesOrg, l.productId, Number.parseInt(e.target.value, 10) || 0)}
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateQty(group.salesOrg, l.productId, l.qty + 1)}
                aria-label="Increase"
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="w-24 text-right font-mono text-sm font-semibold">
              {formatCurrency(l.qty * l.unitPrice, so.currency)}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeLine(group.salesOrg, l.productId)}
              aria-label={`Remove ${l.name}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>

      <Separator />

      <div className="grid gap-4 p-5 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor={`po-${group.salesOrg}`}>Purchase order</FieldLabel>
          <Input
            id={`po-${group.salesOrg}`}
            value={group.poNumber ?? ""}
            placeholder="PO number for this sales org"
            onChange={(e) => setPoNumber(group.salesOrg, e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor={`notes-${group.salesOrg}`}>Notes</FieldLabel>
          <Textarea
            id={`notes-${group.salesOrg}`}
            value={group.notes ?? ""}
            placeholder="Internal notes / delivery instructions"
            onChange={(e) => setNotes(group.salesOrg, e.target.value)}
            className="min-h-[44px]"
          />
        </Field>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-secondary/40 px-5 py-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Truck className="h-3.5 w-3.5" />
          Will create one split order in {so.erp} on checkout
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Subtotal</span>
          <span className="font-mono text-base font-semibold">{formatCurrency(subtotal, so.currency)}</span>
        </div>
      </div>
    </Card>
  )
}

export function SplitOrderHint() {
  return (
    <div className="flex items-center gap-2 rounded-md border border-dashed border-border bg-card px-3 py-2 text-xs text-muted-foreground">
      <ChevronRight className="h-3.5 w-3.5" />
      Split cart: each sales-org group becomes one split order in its respective ERP at checkout.
    </div>
  )
}
