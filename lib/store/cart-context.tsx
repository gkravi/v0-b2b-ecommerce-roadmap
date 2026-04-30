"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import type { CartGroup, CartLine, SalesOrgCode, SavedCart } from "@/lib/types"

type CartContextValue = {
  groups: CartGroup[]
  totalItems: number
  totalValue: number
  addLine: (salesOrg: SalesOrgCode, line: CartLine) => void
  updateQty: (salesOrg: SalesOrgCode, productId: string, qty: number) => void
  removeLine: (salesOrg: SalesOrgCode, productId: string) => void
  clearGroup: (salesOrg: SalesOrgCode) => void
  clearAll: () => void
  setPoNumber: (salesOrg: SalesOrgCode, po: string) => void
  setNotes: (salesOrg: SalesOrgCode, notes: string) => void
  bulkAdd: (entries: { salesOrg: SalesOrgCode; line: CartLine }[]) => void
  saved: SavedCart[]
  saveCurrentAs: (name: string) => void
  loadSaved: (id: string) => void
  deleteSaved: (id: string) => void
}

const CartContext = createContext<CartContextValue | null>(null)

const seed: CartGroup[] = [
  {
    salesOrg: "IA01",
    poNumber: "PO-ACME-88305",
    notes: "Q2 maintenance refresh - Houston plant",
    lines: [
      { productId: "p-ia-02", sku: "IA-SMV-800", name: "SmartLine Multivariable Transmitter", qty: 3, unitPrice: 3210, icon: "Gauge" },
      { productId: "p-ia-03", sku: "IA-RAD-VBR-500", name: "Vibration Monitoring Sensor 500", qty: 10, unitPrice: 1180, icon: "Activity" },
    ],
  },
  {
    salesOrg: "BA01",
    poNumber: "PO-ACME-88306",
    notes: "Midtown tower retrofit",
    lines: [
      { productId: "p-ba-01", sku: "BA-TST-T7-PRO", name: "T7 Pro Commercial Thermostat", qty: 24, unitPrice: 320, icon: "Thermometer" },
      { productId: "p-ba-02", sku: "BA-VAV-CTRL-V8", name: "VAV Controller V8", qty: 16, unitPrice: 540, icon: "Wind" },
    ],
  },
]

export function CartProvider({ children }: { children: ReactNode }) {
  const [groups, setGroups] = useState<CartGroup[]>(seed)
  const [saved, setSaved] = useState<SavedCart[]>([
    {
      id: "sc-1",
      name: "Quarterly Spares Kit - Houston",
      createdAt: "2026-04-15",
      groups: [
        {
          salesOrg: "IA01",
          lines: [
            { productId: "p-ia-02", sku: "IA-SMV-800", name: "SmartLine Multivariable Transmitter", qty: 6, unitPrice: 3210, icon: "Gauge" },
          ],
        },
      ],
    },
  ])

  const value = useMemo<CartContextValue>(() => {
    const totalItems = groups.reduce((s, g) => s + g.lines.reduce((ss, l) => ss + l.qty, 0), 0)
    const totalValue = groups.reduce(
      (s, g) => s + g.lines.reduce((ss, l) => ss + l.qty * l.unitPrice, 0),
      0,
    )

    function ensureGroup(prev: CartGroup[], salesOrg: SalesOrgCode): CartGroup[] {
      if (prev.some((g) => g.salesOrg === salesOrg)) return prev
      return [...prev, { salesOrg, lines: [] }]
    }

    return {
      groups,
      totalItems,
      totalValue,
      addLine(salesOrg, line) {
        setGroups((prev) => {
          const next = ensureGroup(prev, salesOrg)
          return next.map((g) => {
            if (g.salesOrg !== salesOrg) return g
            const existing = g.lines.find((l) => l.productId === line.productId)
            if (existing) {
              return {
                ...g,
                lines: g.lines.map((l) =>
                  l.productId === line.productId ? { ...l, qty: l.qty + line.qty } : l,
                ),
              }
            }
            return { ...g, lines: [...g.lines, line] }
          })
        })
      },
      updateQty(salesOrg, productId, qty) {
        setGroups((prev) =>
          prev.map((g) =>
            g.salesOrg === salesOrg
              ? {
                  ...g,
                  lines: g.lines.map((l) =>
                    l.productId === productId ? { ...l, qty: Math.max(0, qty) } : l,
                  ),
                }
              : g,
          ),
        )
      },
      removeLine(salesOrg, productId) {
        setGroups((prev) =>
          prev
            .map((g) =>
              g.salesOrg === salesOrg
                ? { ...g, lines: g.lines.filter((l) => l.productId !== productId) }
                : g,
            )
            .filter((g) => g.lines.length > 0),
        )
      },
      clearGroup(salesOrg) {
        setGroups((prev) => prev.filter((g) => g.salesOrg !== salesOrg))
      },
      clearAll() {
        setGroups([])
      },
      setPoNumber(salesOrg, po) {
        setGroups((prev) => prev.map((g) => (g.salesOrg === salesOrg ? { ...g, poNumber: po } : g)))
      },
      setNotes(salesOrg, notes) {
        setGroups((prev) => prev.map((g) => (g.salesOrg === salesOrg ? { ...g, notes } : g)))
      },
      bulkAdd(entries) {
        setGroups((prev) => {
          let next = prev
          for (const { salesOrg, line } of entries) {
            next = ensureGroup(next, salesOrg)
            next = next.map((g) => {
              if (g.salesOrg !== salesOrg) return g
              const existing = g.lines.find((l) => l.productId === line.productId)
              if (existing) {
                return {
                  ...g,
                  lines: g.lines.map((l) =>
                    l.productId === line.productId ? { ...l, qty: l.qty + line.qty } : l,
                  ),
                }
              }
              return { ...g, lines: [...g.lines, line] }
            })
          }
          return next
        })
      },
      saved,
      saveCurrentAs(name) {
        setSaved((prev) => [
          ...prev,
          {
            id: `sc-${Date.now()}`,
            name,
            createdAt: new Date().toISOString().slice(0, 10),
            groups: JSON.parse(JSON.stringify(groups)),
          },
        ])
      },
      loadSaved(id) {
        const found = saved.find((s) => s.id === id)
        if (found) setGroups(JSON.parse(JSON.stringify(found.groups)))
      },
      deleteSaved(id) {
        setSaved((prev) => prev.filter((s) => s.id !== id))
      },
    }
  }, [groups, saved])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used inside CartProvider")
  return ctx
}
