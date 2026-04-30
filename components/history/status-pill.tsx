import { cn } from "@/lib/utils"

const orderTone: Record<string, string> = {
  Pending: "bg-amber-500/10 text-amber-700 ring-amber-500/30 dark:text-amber-400",
  Approved: "bg-blue-500/10 text-blue-700 ring-blue-500/30 dark:text-blue-400",
  Processing: "bg-violet-500/10 text-violet-700 ring-violet-500/30 dark:text-violet-400",
  Shipped: "bg-cyan-500/10 text-cyan-700 ring-cyan-500/30 dark:text-cyan-400",
  Delivered: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/30 dark:text-emerald-400",
  Cancelled: "bg-rose-500/10 text-rose-700 ring-rose-500/30 dark:text-rose-400",
}

const quoteTone: Record<string, string> = {
  Draft: "bg-muted text-muted-foreground ring-border",
  Submitted: "bg-blue-500/10 text-blue-700 ring-blue-500/30 dark:text-blue-400",
  "In Approval": "bg-amber-500/10 text-amber-700 ring-amber-500/30 dark:text-amber-400",
  Approved: "bg-cyan-500/10 text-cyan-700 ring-cyan-500/30 dark:text-cyan-400",
  "Customer Acceptance": "bg-violet-500/10 text-violet-700 ring-violet-500/30 dark:text-violet-400",
  Won: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/30 dark:text-emerald-400",
  Expired: "bg-zinc-500/10 text-zinc-700 ring-zinc-500/30 dark:text-zinc-400",
  Rejected: "bg-rose-500/10 text-rose-700 ring-rose-500/30 dark:text-rose-400",
}

export function StatusPill({
  status,
  kind = "order",
  className,
}: {
  status: string
  kind?: "order" | "quote"
  className?: string
}) {
  const tones = kind === "order" ? orderTone : quoteTone
  const tone = tones[status] ?? "bg-muted text-muted-foreground ring-border"
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        tone,
        className,
      )}
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-70"
        aria-hidden="true"
      />
      {status}
    </span>
  )
}
