"use client"

import { motion } from "framer-motion"

/**
 * Animated vertical connector with flowing particles between two architecture layers.
 * Renders as a thin vertical track with 3 dots that travel from top to bottom on a loop.
 */
export function FlowLine({
  delay = 0,
  count = 3,
  height = 48,
  className = "",
}: {
  delay?: number
  count?: number
  height?: number
  className?: string
}) {
  return (
    <div
      className={`relative mx-auto w-px ${className}`}
      style={{ height }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-border via-primary/40 to-border" />
      {Array.from({ length: count }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute -left-[3px] block h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]"
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: height, opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 2.4,
            ease: "linear",
            repeat: Infinity,
            delay: delay + (i * 2.4) / count,
          }}
        />
      ))}
    </div>
  )
}

/**
 * Horizontal animated flow connecting two cards on the same layer.
 */
export function FlowLineHorizontal({
  delay = 0,
  width = 64,
  className = "",
}: {
  delay?: number
  width?: number
  className?: string
}) {
  return (
    <div
      className={`relative my-auto h-px ${className}`}
      style={{ width }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-border via-accent/50 to-border" />
      <motion.span
        className="absolute -top-[3px] block h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]"
        initial={{ x: 0, opacity: 0 }}
        animate={{ x: width, opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 2,
          ease: "linear",
          repeat: Infinity,
          delay,
        }}
      />
    </div>
  )
}
