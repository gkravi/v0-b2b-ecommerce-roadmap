"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Lock04, Mail01, ArrowRight } from "@untitledui/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isOktaLoading, setIsOktaLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ?? "/"
  const authError = searchParams.get("error")

  const handleOktaLogin = async () => {
    setIsOktaLoading(true)
    setError(null)
    try {
      await signIn("okta", { callbackUrl })
    } catch {
      setError("Failed to initiate Okta login")
      setIsOktaLoading(false)
    }
  }

  const handleDemoLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // For demo purposes, we'll redirect to the app
    // In production, this would validate against Supabase auth
    if (email && password) {
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 500))
      window.location.href = callbackUrl
    } else {
      setError("Please enter email and password")
    }
    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Lock04 className="size-6" />
        </div>
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Error Messages */}
        {(error || authError) && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error || (authError === "OAuthCallback" ? "Authentication failed. Please try again." : authError)}
          </div>
        )}

        {/* Okta SSO Button */}
        <Button 
          variant="outline" 
          className="w-full gap-2 h-11"
          onClick={handleOktaLogin}
          disabled={isOktaLoading}
        >
          <svg className="size-5" viewBox="0 0 24 24" fill="none">
            <path 
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" 
              fill="currentColor"
            />
          </svg>
          {isOktaLoading ? "Redirecting to Okta..." : "Continue with Okta SSO"}
        </Button>

        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            or use demo credentials
          </span>
        </div>

        {/* Demo Email/Password Form */}
        <form onSubmit={handleDemoLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail01 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="miguel.patel1@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <span className="text-xs text-muted-foreground">
                Demo: any password works
              </span>
            </div>
            <div className="relative">
              <Lock04 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full gap-2" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in (Demo)"}
            <ArrowRight className="size-4" />
          </Button>
        </form>

        {/* Demo Users Info */}
        <div className="rounded-lg border border-border bg-secondary/30 p-4">
          <p className="text-xs font-medium text-foreground mb-2">Okta Users Available:</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>miguel.patel1@example.com (Buyer @ BlueRock)</li>
            <li>sarah.johnson2@example.com (Admin @ BlueRock)</li>
            <li>emma.williams4@example.com (Buyer @ Summit)</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-2">Password: BlueRock@2024! or Summit@2024!</p>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Need access?{" "}
          <Link href="/admin" className="text-primary hover:underline">
            Contact your administrator
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}

function LoginFormFallback() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Lock04 className="size-6" />
        </div>
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
