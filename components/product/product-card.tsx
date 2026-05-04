"use client"

import Link from "next/link"
import { ArrowRight, LayersTwo01, Clock } from "@untitledui/icons"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product, SalesOrgCode } from "@/lib/types"
import { ProductIcon } from "@/components/product/product-icon"
import { SalesOrgBadge } from "@/components/product/sales-org-badge"
import { formatCurrency } from "@/lib/format"
import { getBU } from "@/lib/data/sales-orgs"
import { cn } from "@/lib/utils"

export function ProductCard({
  product,
  defaultSalesOrg,
  availableSalesOrgs,
  viewMode = "grid",
}: {
  product: Product
  defaultSalesOrg: SalesOrgCode
  availableSalesOrgs: SalesOrgCode[]
  viewMode?: "grid" | "list"
}) {
  // pick the availability that matches the user's default sales org if possible,
  // otherwise the first sales org the customer has access to that the product is in.
  const visibleAvail =
    product.availability.find((a) => a.salesOrg === defaultSalesOrg) ??
    product.availability.find((a) => availableSalesOrgs.includes(a.salesOrg)) ??
    product.availability[0]

  const otherOptions = product.availability.filter((a) => a !== visibleAvail).length
  const bu = getBU(visibleAvail.salesOrg)

  if (viewMode === "list") {
    return (
      <Link 
        href={`/products/${product.id}`}
        className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md"
      >
        {/* Product Icon */}
        <div
          className="flex size-16 flex-shrink-0 items-center justify-center rounded-lg"
          style={{
            background: `linear-gradient(135deg, color-mix(in oklab, var(--${bu.colorToken}) 14%, transparent), color-mix(in oklab, var(--${bu.colorToken}) 6%, transparent))`,
          }}
        >
          <ProductIcon name={product.icon} className="size-8" style={{ color: `var(--${bu.colorToken})` } as React.CSSProperties} />
        </div>

        {/* Product Info */}
        <div className="flex flex-1 flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-muted-foreground">{product.sku}</span>
            <Badge variant="secondary" className="text-[9px] font-normal px-1.5 py-0">
              {product.type}
            </Badge>
          </div>
          <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1">{product.shortDescription}</p>
        </div>

        {/* Price & Options */}
        <div className="flex items-center gap-6 flex-shrink-0">
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">List price</div>
            <div className="font-mono text-base font-semibold text-foreground">
              {formatCurrency(visibleAvail.listPrice)}
            </div>
          </div>
          <SalesOrgBadge code={visibleAvail.salesOrg} />
          <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </div>
      </Link>
    )
  }

  // Grid view (default) - Untitled UI tile style
  return (
    <Link 
      href={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg"
    >
      {/* Product Image/Icon Area */}
      <div
        className="relative flex h-40 items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(145deg, color-mix(in oklab, var(--${bu.colorToken}) 12%, transparent), color-mix(in oklab, var(--${bu.colorToken}) 4%, transparent))`,
        }}
      >
        <ProductIcon 
          name={product.icon} 
          className="size-16 transition-transform group-hover:scale-105" 
          style={{ color: `var(--${bu.colorToken})` } as React.CSSProperties} 
        />
        
        {/* Badges - Untitled UI positioning */}
        <div className="absolute right-3 top-3">
          <SalesOrgBadge code={visibleAvail.salesOrg} />
        </div>
        <div className="absolute left-3 top-3">
          <Badge variant="secondary" className="text-[10px] font-normal bg-background/80 backdrop-blur-sm">
            {product.type}
          </Badge>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col gap-4 p-5">
        {/* Product Details */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-muted-foreground tracking-wide">{product.sku}</span>
          <h3 className="text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Price & Meta */}
        <div className="mt-auto flex items-end justify-between gap-3 pt-3 border-t border-border/50">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">List price</span>
            <span className="font-mono text-lg font-semibold text-foreground">
              {formatCurrency(visibleAvail.listPrice)}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            {otherOptions > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-primary">
                <LayersTwo01 className="size-3.5" />
                {otherOptions + 1} options
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <Clock className="size-3" />
                {visibleAvail.leadTimeDays}d lead
              </span>
            )}
          </div>
        </div>

        {/* CTA Button - Untitled UI style */}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-between group-hover:border-primary/50 group-hover:bg-primary/5 transition-all"
        >
          View options
          <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
    </Link>
  )
}
