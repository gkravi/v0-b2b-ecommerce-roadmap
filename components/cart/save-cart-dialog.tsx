"use client"

import { useState } from "react"
import { Save, FolderOpen, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useCart } from "@/lib/store/cart-context"
import { toast } from "sonner"

export function SaveCartDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const { saveCurrentAs, saved, loadSaved, deleteSaved } = useCart()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Save className="h-4 w-4" /> Saved carts
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Saved carts</DialogTitle>
          <DialogDescription>
            Save the current cart as a reusable template, or load an existing one.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-border p-3">
          <Field>
            <FieldLabel htmlFor="sc-name">Save current cart as</FieldLabel>
            <div className="flex gap-2">
              <Input
                id="sc-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Quarterly spares - Houston"
              />
              <Button
                onClick={() => {
                  if (!name.trim()) {
                    toast.error("Please enter a name")
                    return
                  }
                  saveCurrentAs(name.trim())
                  setName("")
                  toast.success("Cart saved")
                }}
              >
                Save
              </Button>
            </div>
          </Field>
        </div>

        <div className="rounded-lg border border-border">
          <div className="border-b border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Existing saved carts
          </div>
          {saved.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">No saved carts yet.</div>
          ) : (
            <ul className="divide-y divide-border">
              {saved.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 px-3 py-2.5">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{s.name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      Saved {s.createdAt} · {s.groups.reduce((n, g) => n + g.lines.length, 0)} lines · {s.groups.length} sales org(s)
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1"
                      onClick={() => {
                        loadSaved(s.id)
                        toast.success("Saved cart loaded")
                        setOpen(false)
                      }}
                    >
                      <FolderOpen className="h-3.5 w-3.5" /> Load
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        deleteSaved(s.id)
                        toast.success("Saved cart deleted")
                      }}
                      aria-label={`Delete ${s.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <DialogFooter />
      </DialogContent>
    </Dialog>
  )
}
