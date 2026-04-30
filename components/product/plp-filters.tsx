"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import type { Product, SalesOrgCode } from "@/lib/types"
import { SalesOrgBadge } from "@/components/product/sales-org-badge"

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
    <aside className="sticky top-20 flex h-fit flex-col gap-5 rounded-lg border border-border bg-card p-5">
      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Sales organization
        </div>
        <div className="flex flex-col gap-2">
          {availableSalesOrgs.map((code) => (
            <label key={code} className="flex cursor-pointer items-center gap-2">
              <Checkbox
                checked={filters.salesOrgs.includes(code)}
                onCheckedChange={() => toggleSalesOrg(code)}
              />
              <SalesOrgBadge code={code} variant="dot" />
            </label>
          ))}
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          Show materials available to the selected sales orgs only. With none selected, all sales
          orgs the customer is entitled to are shown.
        </p>
      </div>

      <Separator />

      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Product type
        </div>
        <div className="flex flex-col gap-2">
          {allTypes.map((t) => (
            <label key={t} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={filters.types.includes(t)}
                onCheckedChange={() => toggleType(t)}
              />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Category
        </div>
        <div className="flex flex-col gap-2">
          {allCategories.map((c) => (
            <label key={c} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={filters.categories.includes(c)}
                onCheckedChange={() => toggleCategory(c)}
              />
              <span>{c}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  )
}
