"use client"

import { useState } from "react"
import { FileUp, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { products } from "@/lib/data/products"
import { useCart } from "@/lib/store/cart-context"
import { usePortal } from "@/lib/store/portal-context"
import { toast } from "sonner"
import type { CartLine, SalesOrgCode } from "@/lib/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const sample = `# SKU,QTY (one per line)
IA-EXP-C300-PM,2
IA-SMV-800,4
BA-TST-T7-PRO,12
BA-VAV-CTRL-V8,8
PT-CAT-RFG-X12,1500`

export function BulkUploadDialog() {
  const [open, setOpen] = useState(false)
  const [csv, setCsv] = useState(sample)
  const [poText, setPoText] = useState(
    `# Paste PO line list (SKU and qty)
IA-RAD-VBR-500    10
BA-FIRE-NFXI-3030  1
BA-SEC-PROWATCH    2`,
  )
  const { bulkAdd } = useCart()
  const { availableSalesOrgs } = usePortal()

  function parseAndAdd(text: string) {
    const entries: { salesOrg: SalesOrgCode; line: CartLine }[] = []
    const skipped: string[] = []
    for (const raw of text.split(/\r?\n/)) {
      const line = raw.trim()
      if (!line || line.startsWith("#")) continue
      const parts = line.split(/[, \t]+/).filter(Boolean)
      if (parts.length < 2) {
        skipped.push(line)
        continue
      }
      const sku = parts[0]
      const qty = Number.parseInt(parts[1], 10)
      if (!Number.isFinite(qty) || qty <= 0) {
        skipped.push(line)
        continue
      }
      const product = products.find((p) => p.sku.toLowerCase() === sku.toLowerCase())
      if (!product) {
        skipped.push(`${sku} (unknown SKU)`)
        continue
      }
      const avail =
        product.availability.find((a) => availableSalesOrgs.includes(a.salesOrg)) ??
        product.availability[0]
      if (!availableSalesOrgs.includes(avail.salesOrg)) {
        skipped.push(`${sku} (not entitled)`)
        continue
      }
      entries.push({
        salesOrg: avail.salesOrg,
        line: {
          productId: product.id,
          sku: product.sku,
          name: product.name,
          qty,
          unitPrice: avail.listPrice,
          icon: product.icon,
        },
      })
    }

    if (entries.length > 0) bulkAdd(entries)

    toast[entries.length ? "success" : "error"](
      entries.length ? `${entries.length} line(s) added across ${new Set(entries.map((e) => e.salesOrg)).size} sales org(s)` : "No valid lines parsed",
      skipped.length ? { description: `Skipped: ${skipped.slice(0, 4).join(", ")}${skipped.length > 4 ? ` +${skipped.length - 4} more` : ""}` } : undefined,
    )
    if (entries.length > 0) setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Upload className="h-4 w-4" /> Bulk upload
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileUp className="h-4 w-4" /> Bulk add to cart
          </DialogTitle>
          <DialogDescription>
            Paste a CSV (SKU, qty) or PO line list. The storefront auto-routes each SKU to its
            sales org and creates split cart groups.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="csv">
          <TabsList>
            <TabsTrigger value="csv">CSV</TabsTrigger>
            <TabsTrigger value="po">PO line list</TabsTrigger>
          </TabsList>
          <TabsContent value="csv" className="mt-3 flex flex-col gap-3">
            <Textarea
              value={csv}
              onChange={(e) => setCsv(e.target.value)}
              className="min-h-[180px] font-mono text-xs"
              spellCheck={false}
            />
            <Alert>
              <AlertTitle>How it works</AlertTitle>
              <AlertDescription>
                Lines starting with <code>#</code> are ignored. Format: <code>SKU,QTY</code> per line.
              </AlertDescription>
            </Alert>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button onClick={() => parseAndAdd(csv)}>Add to cart</Button>
            </DialogFooter>
          </TabsContent>
          <TabsContent value="po" className="mt-3 flex flex-col gap-3">
            <Textarea
              value={poText}
              onChange={(e) => setPoText(e.target.value)}
              className="min-h-[180px] font-mono text-xs"
              spellCheck={false}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button onClick={() => parseAndAdd(poText)}>Add to cart</Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
