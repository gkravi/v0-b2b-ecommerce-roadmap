"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { ProductCard } from "@/components/product/product-card"
import { PLPFiltersPanel, type PLPFilters } from "@/components/product/plp-filters"
import { products } from "@/lib/data/products"
import { usePortal } from "@/lib/store/portal-context"
import type { Product } from "@/lib/types"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { PackageSearch } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProductsPage() {
  const { availableSalesOrgs, defaultSalesOrg } = usePortal()
  const [q, setQ] = useState("")
  const [filters, setFilters] = useState<PLPFilters>({
    salesOrgs: [],
    types: [],
    categories: [],
  })

  // Only products that are available to at least one sales org the customer is entitled to
  const entitled = useMemo(
    () =>
      products.filter((p) =>
        p.availability.some((a) => availableSalesOrgs.includes(a.salesOrg)),
      ),
    [availableSalesOrgs],
  )

  const allCategories = useMemo(
    () => Array.from(new Set(entitled.map((p) => p.category))).sort(),
    [entitled],
  )
  const allTypes = useMemo(
    () => Array.from(new Set(entitled.map((p) => p.type))) as Product["type"][],
    [entitled],
  )

  const filtered = useMemo(() => {
    return entitled.filter((p) => {
      if (q) {
        const haystack = `${p.name} ${p.sku} ${p.tags.join(" ")} ${p.category}`.toLowerCase()
        if (!haystack.includes(q.toLowerCase())) return false
      }
      if (filters.salesOrgs.length > 0) {
        if (!p.availability.some((a) => filters.salesOrgs.includes(a.salesOrg))) return false
      }
      if (filters.types.length > 0 && !filters.types.includes(p.type)) return false
      if (filters.categories.length > 0 && !filters.categories.includes(p.category)) return false
      return true
    })
  }, [entitled, q, filters])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">All products</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Cross-business catalog. List prices below are seeded from your default sales org{" "}
          <span className="font-mono">{defaultSalesOrg}</span>. Click any product to choose a
          different sales org via &ldquo;View buying options&rdquo;.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <InputGroup className="max-w-md flex-1">
          <InputGroupAddon>
            <Search className="h-4 w-4 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search SKU, name, tag..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </InputGroup>
        <span className="text-xs text-muted-foreground">
          {filtered.length} of {entitled.length} products
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <PLPFiltersPanel
          availableSalesOrgs={availableSalesOrgs}
          allCategories={allCategories}
          allTypes={allTypes}
          filters={filters}
          onChange={setFilters}
        />

        {filtered.length === 0 ? (
          <Empty className="border border-border bg-card">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <PackageSearch />
              </EmptyMedia>
              <EmptyTitle>No products match</EmptyTitle>
              <EmptyDescription>
                Try clearing filters or searching a different SKU/keyword.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" onClick={() => { setQ(""); setFilters({ salesOrgs: [], types: [], categories: [] }) }}>
                Clear all filters
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                defaultSalesOrg={defaultSalesOrg}
                availableSalesOrgs={availableSalesOrgs}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
