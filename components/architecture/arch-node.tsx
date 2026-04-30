"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

export function ArchNode({
  icon: Icon,
  title,
  subtitle,
  tone = "neutral",
  delay = 0,
}: {
  icon: LucideIcon
  title: string
  subtitle?: string
  tone?: "neutral" | "primary" | "accent" | "muted"
  delay?: number
}) {
  const tones: Record<string, string> = {
    neutral: "border-border bg-card",
    primary: "border-primary/40 bg-primary/5",
    accent: "border-accent/40 bg-accent/5",
    muted: "border-dashed border-border bg-muted/30",
  }
  const iconTones: Record<string, string> = {
    neutral: "text-foreground",
    primary: "text-primary",
    accent: "text-accent",
    muted: "text-muted-foreground",
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay }}
      className={`flex min-w-[140px] flex-1 items-center gap-3 rounded-lg border px-3 py-2.5 ${tones[tone]}`}
    >
      <div
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-md bg-background ${iconTones[tone]}`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold leading-tight">{title}</div>
        {subtitle ? (
          <div className="truncate text-[11px] text-muted-foreground">{subtitle}</div>
        ) : null}
      </div>
    </motion.div>
  )
}

export function ArchLayer({
  label,
  description,
  children,
  tone = "neutral",
}: {
  label: string
  description?: string
  children: React.ReactNode
  tone?: "neutral" | "primary" | "accent" | "muted"
}) {
  const headerTones: Record<string, string> = {
    neutral: "text-foreground",
    primary: "text-primary",
    accent: "text-accent",
    muted: "text-muted-foreground",
  }
  return (
    <div className="rounded-xl border border-border/70 bg-background/40 p-4">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <div className={`text-xs font-semibold uppercase tracking-[0.18em] ${headerTones[tone]}`}>
          {label}
        </div>
        {description ? (
          <div className="text-xs text-muted-foreground">{description}</div>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-3">{children}</div>
    </div>
  )
}
