"use client"

import { Checkbox } from "@/components/ui/checkbox"
import type { Product, SalesOrgCode } from "@/lib/types"
import { SalesOrgBadge } from "@/components/product/sales-org-badge"
import { cn } from "@/lib/utils"

export type PLPFilters = {
  salesOrgs: SalesOrgCode[]
  types: Product["type"][]
  categories: string[]
}

export function PLPFiltersPanel({
  availableSalesOrgs,
  allCategories,
  allTypes,
  filters,
  onChange,
}: {
  availableSalesOrgs: SalesOrgCode[]
  allCategories: string[]
  allTypes: Product["type"][]
  filters: PLPFilters
  onChange: (next: PLPFilters) => void
}) {
  function toggleSalesOrg(code: SalesOrgCode) {
    onChange({
      ...filters,
      salesOrgs: filters.salesOrgs.includes(code)
        ? filters.salesOrgs.filter((c) => c !== code)
        : [...filters.salesOrgs, code],
    })
  }
  function toggleType(t: Product["type"]) {
    onChange({
      ...filters,
      types: filters.types.includes(t)
        ? filters.types.filter((x) => x !== t)
        : [...filters.types, t],
    })
  }
  function toggleCategory(c: string) {
    onChange({
      ...filters,
      categories: filters.categories.includes(c)
        ? filters.categories.filter((x) => x !== c)
        : [...filters.categories, c],
    })
  }

  return (
    <aside className="sticky top-20 flex h-fit flex-col rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border bg-secondary/30">
        <h3 className="text-sm font-semibold text-foreground">Filters</h3>
      </div>

      {/* Filter Sections */}
      <div className="flex flex-col">
        {/* Sales Organization */}
        <FilterSection
          title="Sales Organization"
          description="Filter by available sales orgs"
        >
          <div className="flex flex-col gap-2.5">
            {availableSalesOrgs.map((code) => (
              <label 
                key={code} 
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                  "hover:bg-secondary/50",
                  filters.salesOrgs.includes(code) && "bg-secondary"
                )}
              >
                <Checkbox
                  checked={filters.salesOrgs.includes(code)}
                  onCheckedChange={() => toggleSalesOrg(code)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <SalesOrgBadge code={code} variant="dot" />
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Product Type */}
        <FilterSection title="Product Type">
          <div className="flex flex-col gap-2">
            {allTypes.map((t) => (
              <label 
                key={t} 
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors text-sm",
                  "hover:bg-secondary/50",
                  filters.types.includes(t) && "bg-secondary"
                )}
              >
                <Checkbox
                  checked={filters.types.includes(t)}
                  onCheckedChange={() => toggleType(t)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <span className="text-foreground">{t}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Category */}
        <FilterSection title="Category" isLast>
          <div className="flex flex-col gap-2">
            {allCategories.map((c) => (
              <label 
                key={c} 
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors text-sm",
                  "hover:bg-secondary/50",
                  filters.categories.includes(c) && "bg-secondary"
                )}
              >
                <Checkbox
                  checked={filters.categories.includes(c)}
                  onCheckedChange={() => toggleCategory(c)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <span className="text-foreground">{c}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>
    </aside>
  )
}

// Reusable filter section component - Untitled UI collapsible style
function FilterSection({
  title,
  description,
  children,
  isLast = false,
}: {
  title: string
  description?: string
  children: React.ReactNode
  isLast?: boolean
}) {
  return (
    <div className={cn(
      "px-5 py-4",
      !isLast && "border-b border-border"
    )}>
      <div className="mb-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h4>
        {description && (
          <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  )
}
