"use client"

import { useMemo, useState } from "react"
import { SearchMd, XClose, FilterLines, Grid01, List } from "@untitledui/icons"
import { ProductCard } from "@/components/product/product-card"
import { PLPFiltersPanel, type PLPFilters } from "@/components/product/plp-filters"
import { products } from "@/lib/data/products"
import { usePortal } from "@/lib/store/portal-context"
import type { Product } from "@/lib/types"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { PackageSearch } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function ProductsPage() {
  const { availableSalesOrgs, defaultSalesOrg } = usePortal()
  const [q, setQ] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showMobileFilters, setShowMobileFilters] = useState(false)
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

  const activeFilterCount = filters.salesOrgs.length + filters.types.length + filters.categories.length

  const clearAllFilters = () => {
    setQ("")
    setFilters({ salesOrgs: [], types: [], categories: [] })
  }

  return (
    <div className="px-4 py-8 md:px-6">
      {/* Page Header - Untitled UI style */}
      <div className="mb-8 border-b border-border pb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Products
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed">
            Browse our cross-business catalog. Prices shown for your default sales org{" "}
            <Badge variant="secondary" className="font-mono text-[10px] mx-1">{defaultSalesOrg}</Badge>
          </p>
        </div>
      </div>

      {/* Search and Controls Bar - Untitled UI style */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input - Untitled UI pattern */}
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchMd className="size-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <XClose className="size-4" />
            </button>
          )}
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-3">
          {/* Results count */}
          <span className="text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
          </span>

          {/* Mobile filter toggle */}
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden gap-2"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <FilterLines className="size-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 size-5 p-0 flex items-center justify-center text-[10px]">
                {activeFilterCount}
              </Badge>
            )}
          </Button>

          {/* View mode toggle - Untitled UI style */}
          <div className="hidden sm:flex items-center rounded-lg border border-border p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "flex items-center justify-center size-8 rounded-md transition-colors",
                viewMode === "grid"
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label="Grid view"
            >
              <Grid01 className="size-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "flex items-center justify-center size-8 rounded-md transition-colors",
                viewMode === "list"
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label="List view"
            >
              <List className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters Pills - Untitled UI style */}
      {activeFilterCount > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {filters.salesOrgs.map((org) => (
            <Badge
              key={org}
              variant="secondary"
              className="gap-1 pr-1 cursor-pointer hover:bg-secondary/80"
              onClick={() => setFilters({ ...filters, salesOrgs: filters.salesOrgs.filter((s) => s !== org) })}
            >
              {org}
              <XClose className="size-3" />
            </Badge>
          ))}
          {filters.types.map((type) => (
            <Badge
              key={type}
              variant="secondary"
              className="gap-1 pr-1 cursor-pointer hover:bg-secondary/80"
              onClick={() => setFilters({ ...filters, types: filters.types.filter((t) => t !== type) })}
            >
              {type}
              <XClose className="size-3" />
            </Badge>
          ))}
          {filters.categories.map((cat) => (
            <Badge
              key={cat}
              variant="secondary"
              className="gap-1 pr-1 cursor-pointer hover:bg-secondary/80"
              onClick={() => setFilters({ ...filters, categories: filters.categories.filter((c) => c !== cat) })}
            >
              {cat}
              <XClose className="size-3" />
            </Badge>
          ))}
          <button
            onClick={clearAllFilters}
            className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Filters Sidebar - Untitled UI style */}
        <div className={cn(
          "lg:block",
          showMobileFilters ? "block" : "hidden"
        )}>
          <PLPFiltersPanel
            availableSalesOrgs={availableSalesOrgs}
            allCategories={allCategories}
            allTypes={allTypes}
            filters={filters}
            onChange={setFilters}
          />
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <Empty className="border border-border bg-card rounded-xl">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <PackageSearch />
              </EmptyMedia>
              <EmptyTitle>No products found</EmptyTitle>
              <EmptyDescription>
                Try adjusting your search or filter criteria.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" onClick={clearAllFilters}>
                Clear all filters
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <div className={cn(
            "grid gap-5",
            viewMode === "grid" 
              ? "sm:grid-cols-2 xl:grid-cols-3"
              : "grid-cols-1"
          )}>
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                defaultSalesOrg={defaultSalesOrg}
                availableSalesOrgs={availableSalesOrgs}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
