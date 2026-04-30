import { cn } from "@/lib/utils"
import { getBU, getSalesOrg } from "@/lib/data/sales-orgs"
import type { SalesOrgCode } from "@/lib/types"

const tokenBg: Record<string, string> = {
  "chart-1": "bg-[var(--chart-1)]/10 text-[var(--chart-1)] ring-[var(--chart-1)]/30",
  "chart-2": "bg-[var(--chart-2)]/10 text-[var(--chart-2)] ring-[var(--chart-2)]/30",
  "chart-3": "bg-[var(--chart-3)]/10 text-[var(--chart-3)] ring-[var(--chart-3)]/30",
}

export function SalesOrgBadge({
  code,
  variant = "default",
  className,
}: {
  code: SalesOrgCode
  variant?: "default" | "dot"
  className?: string
}) {
  const bu = getBU(code)
  const so = getSalesOrg(code)
  const colors = tokenBg[bu.colorToken] ?? tokenBg["chart-1"]

  if (variant === "dot") {
    return (
      <span className={cn("inline-flex items-center gap-2 text-xs font-medium", className)}>
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ background: `var(--${bu.colorToken})` }}
          aria-hidden="true"
        />
        <span className="text-foreground">{bu.shortName}</span>
        <span className="text-muted-foreground">{so.code}</span>
      </span>
    )
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        colors,
        className,
      )}
    >
      <span className="font-semibold">{bu.shortName}</span>
      <span className="opacity-60">·</span>
      <span>{so.code}</span>
    </span>
  )
}
