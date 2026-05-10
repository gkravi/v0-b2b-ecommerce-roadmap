import { NextResponse, type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

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
  "/architecture",
  "/roadmap",
  "/comparison",
  "/portal",
  "/auth",
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Update Supabase session
  const response = await updateSession(request)

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )

  // For now, allow all routes since we're building the auth system
  // In production, you would check the session and redirect unauthorized users
  
  // Example of how to protect routes (uncomment when auth is configured):
  /*
  if (isProtectedRoute) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      const loginUrl = new URL("/auth/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Check admin access
    if (isAdminRoute) {
      const { data: userData } = await supabase
        .from("users")
        .select("is_super_user")
        .eq("okta_id", user.id)
        .single()

      if (!userData?.is_super_user) {
        return NextResponse.redirect(new URL("/", request.url))
      }
    }
  }
  */

  return response
}

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
