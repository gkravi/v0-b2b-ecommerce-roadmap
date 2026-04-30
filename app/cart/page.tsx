"use client"

import Link from "next/link"
import {
  ArrowRight,
  Download,
  FileText,
  ShoppingBag,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/store/cart-context"
import { usePortal } from "@/lib/store/portal-context"
import { CartGroupCard, SplitOrderHint } from "@/components/cart/cart-group"
import { BulkUploadDialog } from "@/components/cart/bulk-upload-dialog"
import { SaveCartDialog } from "@/components/cart/save-cart-dialog"
import { formatCurrency } from "@/lib/format"
import { toast } from "sonner"
import { ButtonGroup } from "@/components/ui/button-group"
import { SalesOrgBadge } from "@/components/product/sales-org-badge"

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function CartPage() {
  const { groups, totalItems, totalValue, clearAll } = useCart()
  const { activeSoldTo, currency } = usePortal()

  function exportCart() {
    const rows = [["Sales Org", "SKU", "Name", "Qty", "Unit Price", "Line Total", "PO", "Notes"]]
    for (const g of groups) {
      for (const l of g.lines) {
        rows.push([
          g.salesOrg,
          l.sku,
          l.name,
          String(l.qty),
          String(l.unitPrice),
          String(l.qty * l.unitPrice),
          g.poNumber ?? "",
          g.notes ?? "",
        ])
      }
    }
    downloadCsv(`cart-${Date.now()}.csv`, rows)
    toast.success("Cart exported as CSV")
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <div className="mb-6 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Unified cart</h1>
          <span className="text-sm text-muted-foreground">
            Sold-to: <span className="font-medium text-foreground">{activeSoldTo.name}</span>
          </span>
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground">
          One cart, multiple sales-org groups. Each group below becomes a separate order in its
          respective ERP at checkout. You can request a quote per group or for the entire cart.
        </p>
      </div>

      {/* Toolbar */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-3">
        <ButtonGroup>
          <BulkUploadDialog />
          <SaveCartDialog />
          <Button variant="outline" size="sm" className="gap-2" onClick={exportCart}>
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link href="/quick-add">
              <ShoppingBag className="h-4 w-4" /> Quick add
            </Link>
          </Button>
        </ButtonGroup>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-destructive"
          onClick={() => {
            clearAll()
            toast.success("Cart cleared")
          }}
          disabled={groups.length === 0}
        >
          <Trash2 className="h-4 w-4" /> Clear all
        </Button>
      </div>

      {groups.length === 0 ? (
        <Empty className="border border-border bg-card">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ShoppingBag />
            </EmptyMedia>
            <EmptyTitle>Your cart is empty</EmptyTitle>
            <EmptyDescription>
              Add products from the catalog, use Quick Add, or upload a PO to get started.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/products">Browse products</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/quick-add">Quick add</Link>
              </Button>
            </div>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="flex flex-col gap-4">
            <SplitOrderHint />
            {groups.map((g) => (
              <CartGroupCard key={g.salesOrg} group={g} />
            ))}
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-20 lg:h-fit">
            <Card className="p-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Order summary
              </div>
              <div className="mt-3 flex flex-col gap-2">
                {groups.map((g) => {
                  const sub = g.lines.reduce((s, l) => s + l.qty * l.unitPrice, 0)
                  return (
                    <div key={g.salesOrg} className="flex items-center justify-between gap-2 text-sm">
                      <SalesOrgBadge code={g.salesOrg} />
                      <span className="font-mono">{formatCurrency(sub, currency)}</span>
                    </div>
                  )
                })}
              </div>
              <Separator className="my-4" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Items</span>
                <span className="font-mono">{totalItems}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Sales orgs</span>
                <span className="font-mono">{groups.length}</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-sm">Estimated total</span>
                <span className="font-mono text-2xl font-semibold">
                  {formatCurrency(totalValue, currency)}
                </span>
              </div>

              <Button asChild size="lg" className="mt-4 w-full gap-2">
                <Link href="/checkout">
                  Checkout · split into {groups.length} order{groups.length > 1 ? "s" : ""}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="mt-2 w-full gap-2">
                <Link href="/quotes?from=cart">
                  <FileText className="h-4 w-4" /> Request quote for entire cart
                </Link>
              </Button>

              <div className="mt-4 rounded-md bg-secondary/50 p-3 text-[11px] leading-relaxed text-muted-foreground">
                Approval routing: SFDC CPQ &amp; SAP CPQ are selected per business. Customer
                acceptance comes back to this storefront, then converts to order.
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
