import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="text-xs text-muted-foreground">
          Unified Commerce Demo &middot; Composable MACH storefront for cross-business B2B journeys.
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <Link href="/architecture" className="hover:text-foreground">Architecture</Link>
          <Link href="/roadmap" className="hover:text-foreground">Roadmap</Link>
          <Link href="/comparison" className="hover:text-foreground">Old vs New</Link>
          <Link href="/portal" className="hover:text-foreground">Portal</Link>
        </div>
      </div>
    </footer>
  )
}
