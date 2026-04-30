"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import { customer } from "@/lib/data/customer"
import type { Customer, SalesOrgCode, SoldTo } from "@/lib/types"
import { salesOrgs } from "@/lib/data/sales-orgs"

type PortalContextValue = {
  customer: Customer
  activeSoldTo: SoldTo
  setActiveSoldToId: (id: string) => void
  /** Sales orgs available to the current sold-to */
  availableSalesOrgs: SalesOrgCode[]
  /** Default sales org used to seed product list price */
  defaultSalesOrg: SalesOrgCode
  /** Currency tied to the default sales org */
  currency: "USD" | "EUR" | "GBP" | "SGD"
  isAuthenticated: boolean
  setAuthenticated: (b: boolean) => void
}

const PortalContext = createContext<PortalContextValue | null>(null)

export function PortalProvider({ children }: { children: ReactNode }) {
  const [activeSoldToId, setActiveSoldToId] = useState<string>(customer.soldTos[2].id) // enterprise account by default
  const [isAuthenticated, setAuthenticated] = useState<boolean>(true) // default to true so demo is browsable

  const value = useMemo<PortalContextValue>(() => {
    const activeSoldTo = customer.soldTos.find((s) => s.id === activeSoldToId) ?? customer.soldTos[0]
    const defaultSalesOrg = activeSoldTo.defaultSalesOrg
    const currency = salesOrgs[defaultSalesOrg].currency
    return {
      customer,
      activeSoldTo,
      setActiveSoldToId,
      availableSalesOrgs: activeSoldTo.salesOrgs,
      defaultSalesOrg,
      currency,
      isAuthenticated,
      setAuthenticated,
    }
  }, [activeSoldToId, isAuthenticated])

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
}

export function usePortal() {
  const ctx = useContext(PortalContext)
  if (!ctx) throw new Error("usePortal must be used inside PortalProvider")
  return ctx
}
