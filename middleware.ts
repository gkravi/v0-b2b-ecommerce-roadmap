import { NextResponse, type NextRequest } from "next/server"
import { auth } from "@/lib/auth/auth"

// Routes that require authentication
const protectedRoutes = [
  "/admin",
  "/orders",
  "/quotes",
  "/cart",
  "/checkout",
  "/account",
]

// Routes that require admin role
const adminRoutes = ["/admin"]

// Public routes that don't require auth
const publicRoutes = [
  "/",
  "/products",
  "/quick-add",
  "/architecture",
  "/roadmap",
  "/comparison",
  "/portal",
  "/auth",
  "/api/auth",
]

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // Check route types
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )
  const isApiRoute = pathname.startsWith("/api")

  // Allow public routes and API routes
  if (isPublicRoute || (isApiRoute && !pathname.startsWith("/api/admin"))) {
    return NextResponse.next()
  }

  // Protected routes require authentication
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/auth/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Admin routes require authentication (role check is done in the page)
  if (isAdminRoute && !isLoggedIn) {
    const loginUrl = new URL("/auth/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
