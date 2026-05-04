import Link from "next/link"
import { Github, Linkedin, Twitter, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const footerSections = [
  {
    title: "Product",
    links: [
      { label: "Architecture", href: "/architecture" },
      { label: "Roadmap", href: "/roadmap" },
      { label: "Comparison", href: "/comparison" },
      { label: "Demo", href: "/portal" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Products", href: "/products" },
      { label: "Orders", href: "/orders" },
      { label: "Quotes", href: "/quotes" },
      { label: "Quick Add", href: "/quick-add" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Settings", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:py-20">
        <div className="grid gap-12 lg:gap-16">
          {/* Brand Section and Links Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand Column */}
            <div className="flex flex-col gap-6 md:col-span-2 lg:col-span-1">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 w-fit group">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm transition-transform group-hover:scale-105">
                  UC
                </div>
                <div className="flex flex-col leading-tight">
                  <div className="text-sm font-semibold text-foreground">Unified</div>
                  <div className="text-[10px] text-muted-foreground">Commerce</div>
                </div>
              </Link>
              
              {/* Brand Description */}
              <p className="text-sm leading-relaxed text-muted-foreground max-w-sm">
                Composable MACH storefront enabling unified B2B commerce across business units, sales organizations, and personas.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="size-5" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="size-5" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="size-5" />
                </a>
              </div>
            </div>

            {/* Link Columns */}
            {footerSections.map((section) => (
              <div key={section.title} className="flex flex-col gap-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  {section.title}
                </h3>
                <ul className="flex flex-col gap-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2 group"
                      >
                        {link.label}
                        <ArrowRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Bottom Section - CTA Band (Untitled UI Brand Style) */}
          <div className="rounded-2xl border border-border/50 bg-gradient-to-r from-secondary to-secondary/50 p-8 md:p-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              {/* Left Content */}
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Ready to explore the demo?
                </h3>
                <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                  Walk through cross-business cart, split orders, quote-to-cash, and real-time inventory across sales organizations.
                </p>
              </div>

              {/* CTA Button */}
              <Button asChild className="gap-2 w-fit">
                <Link href="/products">
                  Get started
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Footer Bottom - Copyright & Legal */}
          <div className="flex flex-col gap-4 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Unified Commerce. All rights reserved.
            </p>
            
            <div className="flex flex-wrap items-center gap-6">
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}


