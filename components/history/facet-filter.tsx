"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export type Facet = {
  key: string
  label: string
  count: number
}

export function FacetGroup({
  title,
  facets,
  selected,
  onToggle,
  renderLabel,
}: {
  title: string
  facets: Facet[]
  selected: Set<string>
  onToggle: (key: string) => void
  renderLabel?: (f: Facet) => React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <div className="flex flex-col gap-2">
        {facets.length === 0 ? (
          <p className="text-xs text-muted-foreground">No filters available.</p>
        ) : (
          facets.map((f) => {
            const id = `${title}-${f.key}`
            const checked = selected.has(f.key)
            return (
              <div key={f.key} className="flex items-center gap-2">
                <Checkbox
                  id={id}
                  checked={checked}
                  onCheckedChange={() => onToggle(f.key)}
                />
                <Label
                  htmlFor={id}
                  className={cn(
                    "flex flex-1 cursor-pointer items-center justify-between text-sm font-normal",
                    checked && "font-medium",
                  )}
                >
                  <span className="flex items-center gap-2">
                    {renderLabel ? renderLabel(f) : f.label}
                  </span>
                  <span className="text-xs text-muted-foreground">{f.count}</span>
                </Label>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
