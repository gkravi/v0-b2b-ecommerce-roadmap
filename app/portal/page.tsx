"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, KeyRound, Lock, ShieldCheck, User2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { customer } from "@/lib/data/customer"
import { usePortal } from "@/lib/store/portal-context"
import { SalesOrgBadge } from "@/components/product/sales-org-badge"
import { salesOrgs } from "@/lib/data/sales-orgs"
import { toast } from "sonner"

export default function PortalPage() {
  const router = useRouter()
  const { setActiveSoldToId, activeSoldTo } = usePortal()
  const [soldTo, setSoldTo] = useState<string>(activeSoldTo.id)

  const selected = customer.soldTos.find((s) => s.id === soldTo) ?? customer.soldTos[0]
  const currency = salesOrgs[selected.defaultSalesOrg].currency

  return (
    <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl gap-10 px-4 py-12 md:grid-cols-2 md:px-6">
      {/* Left - context explainer */}
      <div className="flex flex-col justify-center gap-6">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          Auth Engine (Okta) &middot; fine-grain access &middot; persona &middot; entitlements
        </div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          One login. Every business you&apos;re entitled to.
        </h1>
        <p className="text-pretty text-muted-foreground">
          The unified Auth Engine resolves your contact &amp; account relationships across IA, BA and
          PT &mdash; replacing today&apos;s &ldquo;pick a portal&rdquo; experience. After sign-in,
          your sold-to dropdown only shows accounts you can transact on, and the storefront seeds
          list price using the sold-to&apos;s default sales org.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: User2, label: "Persona-aware", desc: "Buyer / Approver / Admin" },
            { icon: Building2, label: "Multi sold-to", desc: "Across business units" },
            { icon: Lock, label: "Entitlements", desc: "Catalog, price row, L&E" },
            { icon: KeyRound, label: "Federated SSO", desc: "Okta / Azure AD / IdP" },
          ].map((f) => (
            <div key={f.label} className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
              <span className="grid h-8 w-8 place-items-center rounded-md bg-secondary">
                <f.icon className="h-4 w-4" />
              </span>
              <div>
                <div className="text-sm font-medium">{f.label}</div>
                <div className="text-xs text-muted-foreground">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right - login card */}
      <div className="flex items-center">
        <Card className="w-full p-6 md:p-8">
          <div className="mb-6 flex flex-col gap-1">
            <h2 className="text-xl font-semibold">Sign in to Unified Commerce</h2>
            <p className="text-sm text-muted-foreground">Demo session &mdash; no real credentials needed.</p>
          </div>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Work email</FieldLabel>
              <Input id="email" type="email" defaultValue={customer.email} />
            </Field>
            <Field>
              <FieldLabel htmlFor="pw">Password</FieldLabel>
              <Input id="pw" type="password" defaultValue="********" />
            </Field>

            <Field>
              <FieldLabel htmlFor="soldto">Sold-to</FieldLabel>
              <Select value={soldTo} onValueChange={setSoldTo}>
                <SelectTrigger id="soldto">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {customer.soldTos.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{s.name}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {s.id} &middot; {s.salesOrgs.join(" / ")}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>
                Resolved from your Salesforce contact-account relationships via the unified Auth Engine.
              </FieldDescription>
            </Field>

            <div className="rounded-lg border border-border bg-secondary/40 p-3">
              <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Resolved entitlements
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {selected.salesOrgs.map((so) => (
                  <SalesOrgBadge key={so} code={so} />
                ))}
                <span className="ml-auto rounded-md bg-card px-2 py-0.5 font-mono text-xs">
                  {currency}
                </span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Default sales org for list price: <span className="font-mono">{selected.defaultSalesOrg}</span>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full"
              onClick={() => {
                setActiveSoldToId(soldTo)
                toast.success(`Signed in as ${customer.name}`, {
                  description: `Active sold-to: ${selected.name}`,
                })
                router.push("/products")
              }}
            >
              Sign in &amp; continue
            </Button>
          </FieldGroup>
        </Card>
      </div>
    </div>
  )
}
