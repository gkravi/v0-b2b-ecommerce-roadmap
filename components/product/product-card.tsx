"use client"

import Link from "next/link"
import { ChevronRight, Layers } from "lucide-react"
import { Card } from "@/components/ui/card"
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
}: {
  product: Product
  defaultSalesOrg: SalesOrgCode
  availableSalesOrgs: SalesOrgCode[]
}) {
  // pick the availability that matches the user's default sales org if possible,
  // otherwise the first sales org the customer has access to that the product is in.
  const visibleAvail =
    product.availability.find((a) => a.salesOrg === defaultSalesOrg) ??
    product.availability.find((a) => availableSalesOrgs.includes(a.salesOrg)) ??
    product.availability[0]

  const otherOptions = product.availability.filter((a) => a !== visibleAvail).length
  const bu = getBU(visibleAvail.salesOrg)

  return (
    <Card className="group flex flex-col overflow-hidden p-0 transition-shadow hover:shadow-md">
      <div
        className={cn(
          "relative flex h-36 items-center justify-center overflow-hidden border-b border-border",
        )}
        style={{
          background: `linear-gradient(135deg, color-mix(in oklab, var(--${bu.colorToken}) 14%, transparent), color-mix(in oklab, var(--${bu.colorToken}) 4%, transparent))`,
        }}
      >
        <ProductIcon name={product.icon} className="h-14 w-14" style={{ color: `var(--${bu.colorToken})` } as React.CSSProperties} />
        <div className="absolute right-2 top-2">
          <SalesOrgBadge code={visibleAvail.salesOrg} />
        </div>
        <div className="absolute left-2 top-2">
          <Badge variant="secondary" className="text-[10px] font-normal">
            {product.type}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-col gap-1">
          <div className="text-[11px] font-mono text-muted-foreground">{product.sku}</div>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{product.name}</h3>
          <p className="line-clamp-2 text-xs text-muted-foreground">{product.shortDescription}</p>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">List price</span>
            <span className="font-mono text-base font-semibold">
              {formatCurrency(visibleAvail.listPrice)}
            </span>
          </div>
          <div className="flex flex-col items-end">
            {otherOptions > 0 ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary">
                <Layers className="h-3 w-3" />
                {otherOptions + 1} buying option{otherOptions + 1 > 1 ? "s" : ""}
              </span>
            ) : (
              <span className="text-[11px] text-muted-foreground">
                Lead time {visibleAvail.leadTimeDays}d
              </span>
            )}
          </div>
        </div>

        <Button asChild variant="outline" size="sm" className="mt-1 justify-between">
          <Link href={`/products/${product.id}`}>
            View buying options
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </Card>
  )
}
