import Link from "next/link"
import { Github, Linkedin, Twitter } from "lucide-react"

const footerLinks = [
  {
    label: "Product",
    links: [
      { href: "/architecture", label: "Architecture" },
      { href: "/roadmap", label: "Roadmap" },
      { href: "/comparison", label: "Old vs New" },
      { href: "/portal", label: "Portal Demo" },
    ],
  },
  {
    label: "Resources",
    links: [
      { href: "/products", label: "Products" },
      { href: "/orders", label: "Orders" },
      { href: "/quotes", label: "Quotes" },
      { href: "/quick-add", label: "Quick Add" },
    ],
  },
  {
    label: "Connect",
    links: [
      { href: "#", label: "GitHub", external: true },
      { href: "#", label: "LinkedIn", external: true },
      { href: "#", label: "Twitter", external: true },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 mb-8">
          {/* Branding Column */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold text-sm">
                UC
              </div>
              <div className="flex flex-col leading-tight">
                <div className="text-sm font-semibold text-foreground">Unified</div>
                <div className="text-[10px] text-muted-foreground">Commerce</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Composable MACH storefront for cross-business B2B journeys.
            </p>
          </div>

          {/* Footer Link Columns */}
          {footerLinks.map((section) => (
            <div key={section.label} className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                {section.label}
              </h3>
              <ul className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Divider */}
        <div className="border-t border-border pt-8">
          {/* Bottom Row */}
          <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4">
            {/* Copyright */}
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Unified Commerce. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                aria-label="GitHub"
              >
                <BrandGithub className="size-4" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                aria-label="LinkedIn"
              >
                <BrandLinkedin className="size-4" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                aria-label="Twitter"
              >
                <BrandTwitter className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

