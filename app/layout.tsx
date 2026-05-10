import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

import { PortalProvider } from "@/lib/store/portal-context"
import { CartProvider } from "@/lib/store/cart-context"
import { SessionProvider } from "@/components/auth/session-provider"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
})
const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono"
})

export const metadata: Metadata = {
  title: "Unified Commerce - B2B MACH Storefront Demo",
  description:
    "End-to-end unified B2B commerce demo: cross-business cart, split orders, quote-to-cash, MACH architecture and phased adoption roadmap.",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#5b3be3",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} bg-background`}>
      <body className="min-h-screen font-sans antialiased">
        <SessionProvider>
          <PortalProvider>
            <CartProvider>
              <div className="flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-1">
                  <div className="mx-auto w-full max-w-7xl">
                    {children}
                  </div>
                </main>
                <SiteFooter />
              </div>
              <Toaster richColors position="top-right" />
            </CartProvider>
          </PortalProvider>
        </SessionProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
