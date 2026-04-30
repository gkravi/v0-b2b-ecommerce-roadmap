"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle2, ChevronRight, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/store/cart-context"
import { usePortal } from "@/lib/store/portal-context"
import { SalesOrgBadge } from "@/components/product/sales-org-badge"
import { formatCurrency } from "@/lib/format"
import { salesOrgs } from "@/lib/data/sales-orgs"
import { toast } from "sonner"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle, EmptyContent } from "@/components/ui/empty"

export default function CheckoutPage() {
  const router = useRouter()
  const { groups, totalValue, clearAll } = useCart()
  const { activeSoldTo, currency } = usePortal()
  const [shipToId, setShipToId] = useState(activeSoldTo.shipTos[0]?.id ?? "")
  const [submitted, setSubmitted] = useState(false)

  if (groups.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
        <Empty className="border border-border bg-card">
          <EmptyHeader>
            <EmptyMedia variant="icon"><ShoppingBag /></EmptyMedia>
            <EmptyTitle>Cart is empty</EmptyTitle>
            <EmptyDescription>Add products before continuing to checkout.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild><Link href="/products">Browse products</Link></Button>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
        <Card className="p-8 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-7 w-7" />
          </span>
          <h1 className="mt-4 text-2xl font-semibold">Orders placed successfully</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            The unified cart was split into {groups.length} ERP order(s) downstream. You can track
            them in your order history.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Button asChild><Link href="/orders">View order history</Link></Button>
            <Button asChild variant="outline"><Link href="/products">Continue shopping</Link></Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <h1 className="mb-2 text-2xl font-semibold tracking-tight md:text-3xl">Checkout</h1>
      <p className="mb-6 max-w-3xl text-sm text-muted-foreground">
        Review your sales-org groups. Each will create one order in its respective ERP.
      </p>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          <Card className="p-5">
            <div className="text-sm font-semibold">Ship to</div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="shipto">Address</FieldLabel>
                <Select value={shipToId} onValueChange={setShipToId}>
                  <SelectTrigger id="shipto"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {activeSoldTo.shipTos.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        <div className="flex flex-col text-left">
                          <span className="text-sm font-medium">{a.name}</span>
                          <span className="text-xs text-muted-foreground">{a.line1}, {a.city} {a.state}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="contact">Contact</FieldLabel>
                <Input id="contact" defaultValue="Priya Shah · priya.shah@acme-industries.com" />
              </Field>
            </div>
          </Card>

          {groups.map((g) => {
            const so = salesOrgs[g.salesOrg]
            const subtotal = g.lines.reduce((s, l) => s + l.qty * l.unitPrice, 0)
            return (
              <Card key={g.salesOrg} className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <SalesOrgBadge code={g.salesOrg} />
                    <div className="text-sm">
                      <div className="font-medium">{so.name}</div>
                      <div className="text-[11px] text-muted-foreground">PO: {g.poNumber || "—"}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Routes to</div>
                    <div className="font-mono text-xs">{so.erp}</div>
                  </div>
                </div>
                <Separator className="my-4" />
                <ul className="flex flex-col gap-2">
                  {g.lines.map((l) => (
                    <li key={l.productId} className="flex items-center justify-between gap-3 text-sm">
                      <div className="min-w-0">
                        <div className="line-clamp-1 font-medium">{l.name}</div>
                        <div className="font-mono text-[10px] text-muted-foreground">{l.sku} · qty {l.qty}</div>
                      </div>
                      <div className="font-mono">{formatCurrency(l.unitPrice * l.qty, so.currency)}</div>
                    </li>
                  ))}
                </ul>
                <Separator className="my-4" />
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">Subtotal</span>
                  <span className="font-mono text-base font-semibold">{formatCurrency(subtotal, so.currency)}</span>
                </div>
              </Card>
            )
          })}
        </div>

        <Card className="h-fit p-5 lg:sticky lg:top-20">
          <FieldGroup>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Payment
            </div>
            <Field>
              <FieldLabel htmlFor="terms">Terms</FieldLabel>
              <Input id="terms" defaultValue={activeSoldTo.paymentTerms} />
            </Field>
            <Field>
              <FieldLabel htmlFor="po">Master PO (optional)</FieldLabel>
              <Input id="po" placeholder="PO-ACME-XXXXX" />
            </Field>
          </FieldGroup>

          <Separator className="my-4" />

          <div className="flex items-baseline justify-between">
            <span className="text-sm">Estimated total</span>
            <span className="font-mono text-2xl font-semibold">{formatCurrency(totalValue, currency)}</span>
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            Will create {groups.length} split order{groups.length > 1 ? "s" : ""} downstream.
          </div>

          <Button
            className="mt-4 w-full gap-2"
            size="lg"
            onClick={() => {
              toast.success(`Placed ${groups.length} split order(s)`)
              setSubmitted(true)
              clearAll()
            }}
          >
            Place orders <ChevronRight className="h-4 w-4" />
          </Button>
        </Card>
      </div>
    </div>
  )
}
