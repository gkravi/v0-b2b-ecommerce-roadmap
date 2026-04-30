"use client"

import { use, useMemo, useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileText,
  Layers,
  Minus,
  Package,
  Plus,
  ShoppingCart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ProductIcon } from "@/components/product/product-icon"
import { SalesOrgBadge } from "@/components/product/sales-org-badge"
import { products } from "@/lib/data/products"
import { getBU, salesOrgs } from "@/lib/data/sales-orgs"
import { usePortal } from "@/lib/store/portal-context"
import { useCart } from "@/lib/store/cart-context"
import { formatCurrency } from "@/lib/format"
import type { SalesOrgCode } from "@/lib/types"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const product = products.find((p) => p.id === id)
  if (!product) notFound()

  const { availableSalesOrgs, defaultSalesOrg } = usePortal()
  const { addLine } = useCart()

  const buyableOptions = useMemo(
    () => product.availability.filter((a) => availableSalesOrgs.includes(a.salesOrg)),
    [product, availableSalesOrgs],
  )

  const initial =
    buyableOptions.find((o) => o.salesOrg === defaultSalesOrg) ?? buyableOptions[0] ?? product.availability[0]

  const [selectedOrg, setSelectedOrg] = useState<SalesOrgCode>(initial.salesOrg)
  const selected = product.availability.find((a) => a.salesOrg === selectedOrg) ?? initial

  const [qty, setQty] = useState<number>(selected.minOrderQty)
  const bu = getBU(selected.salesOrg)
  const so = salesOrgs[selected.salesOrg]
  const canBuy = availableSalesOrgs.includes(selected.salesOrg)

  function handleAdd() {
    if (!canBuy) {
      toast.error("Not entitled to this sales org for the active sold-to.")
      return
    }
    addLine(selected.salesOrg, {
      productId: product.id,
      sku: product.sku,
      name: product.name,
      qty,
      unitPrice: selected.listPrice,
      icon: product.icon,
    })
    toast.success(`Added to ${selected.salesOrg} cart`, {
      description: `${qty} × ${product.sku}`,
    })
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <Button asChild variant="ghost" size="sm" className="mb-4 gap-2">
        <Link href="/products">
          <ArrowLeft className="h-4 w-4" /> Back to products
        </Link>
      </Button>

      <div className="grid gap-8 md:grid-cols-[1fr_360px]">
        <div>
          <div
            className="mb-6 flex h-72 items-center justify-center rounded-xl border border-border"
            style={{
              background: `linear-gradient(135deg, color-mix(in oklab, var(--${bu.colorToken}) 14%, transparent), color-mix(in oklab, var(--${bu.colorToken}) 4%, transparent))`,
            }}
          >
            <ProductIcon
              name={product.icon}
              className="h-28 w-28 float-soft"
              style={{ color: `var(--${bu.colorToken})` }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono">{product.sku}</span>
            <span>·</span>
            <span>{product.category}</span>
            <span>·</span>
            <Badge variant="secondary">{product.type}</Badge>
          </div>
          <h1 className="mt-2 text-balance text-2xl font-semibold tracking-tight md:text-3xl">
            {product.name}
          </h1>
          <p className="mt-3 max-w-2xl text-pretty text-muted-foreground">{product.description}</p>

          <Tabs defaultValue="overview" className="mt-8">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="specs">Specs &amp; tags</TabsTrigger>
              <TabsTrigger value="visibility">Visibility logic</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {product.description} The unified storefront resolves visibility using <span className="font-mono">sales org + distribution channel + division + price row + L&amp;E</span>, sourced from the active sold-to&apos;s entitlements.
            </TabsContent>
            <TabsContent value="specs" className="mt-4">
              <div className="flex flex-wrap gap-2">
                {product.tags.map((t) => (
                  <Badge key={t} variant="secondary">{t}</Badge>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="visibility" className="mt-4">
              <Card className="p-4">
                <div className="text-sm font-medium">Why you can see this product</div>
                <ol className="mt-3 list-inside list-decimal space-y-1 text-sm text-muted-foreground">
                  <li>Active sold-to is extended to {availableSalesOrgs.join(", ")}.</li>
                  <li>Material is extended to {product.availability.map((a) => a.salesOrg).join(", ")}.</li>
                  <li>Distribution channel + Division checks pass.</li>
                  <li>Price row exists in at least one of the entitled sales orgs.</li>
                  <li>L&amp;E (Listing &amp; Exclusion) check passed.</li>
                </ol>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Buying options panel */}
        <div className="md:sticky md:top-20 md:h-fit">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Buying options
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] text-primary">
                <Layers className="h-3 w-3" /> {product.availability.length} available
              </span>
            </div>

            <div className="mt-3 flex flex-col gap-2">
              {product.availability.map((a) => {
                const entitled = availableSalesOrgs.includes(a.salesOrg)
                const active = selectedOrg === a.salesOrg
                return (
                  <button
                    key={a.salesOrg}
                    onClick={() => entitled && setSelectedOrg(a.salesOrg)}
                    disabled={!entitled}
                    className={cn(
                      "flex flex-col gap-2 rounded-md border bg-card px-3 py-2.5 text-left transition-colors",
                      active
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-border hover:border-foreground/20",
                      !entitled && "opacity-60",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <SalesOrgBadge code={a.salesOrg} />
                      <span className="font-mono text-sm font-semibold">
                        {formatCurrency(a.listPrice, salesOrgs[a.salesOrg].currency)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        {a.inStock ? (
                          <>
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" /> In stock
                          </>
                        ) : (
                          <>
                            <Clock3 className="h-3 w-3" /> On order
                          </>
                        )}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="h-3 w-3" /> {a.leadTimeDays}d lead
                      </span>
                      {!entitled && <span>Not entitled</span>}
                    </div>
                  </button>
                )
              })}
            </div>

            <Separator className="my-4" />

            <div className="flex items-baseline justify-between">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">List price</div>
              <div className="font-mono text-2xl font-semibold">
                {formatCurrency(selected.listPrice, so.currency)}
              </div>
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              {bu.name} &middot; {so.code} &middot; ERP: {so.erp}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="inline-flex items-center rounded-md border border-border">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQty((q) => Math.max(selected.minOrderQty, q - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-mono">{qty}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-muted-foreground">
                Min order qty {selected.minOrderQty}
              </span>
            </div>

            <Button className="mt-4 w-full gap-2" size="lg" onClick={handleAdd}>
              <ShoppingCart className="h-4 w-4" />
              Add to {selected.salesOrg} cart
            </Button>
            <Button asChild variant="outline" className="mt-2 w-full gap-2">
              <Link href="/cart">
                <FileText className="h-4 w-4" /> Request quote from cart
              </Link>
            </Button>

            <div className="mt-4 rounded-md bg-secondary/50 p-3 text-[11px] leading-relaxed text-muted-foreground">
              <Package className="mr-1 inline h-3 w-3" />
              Items from different sales orgs go into separate cart groups. At checkout the unified
              cart creates one split order per sales org.
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
