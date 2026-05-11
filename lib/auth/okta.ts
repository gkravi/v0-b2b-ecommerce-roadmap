import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserByOktaId, getUserByEmail, buildSessionUser, updateLastLogin } from './authorization'
import type { OktaClaims, SessionUser } from './types'

// Okta configuration
const OKTA_ISSUER = process.env.OKTA_ISSUER || ''
const OKTA_CLIENT_ID = process.env.OKTA_CLIENT_ID || ''
const OKTA_CLIENT_SECRET = process.env.OKTA_CLIENT_SECRET || ''
const OKTA_REDIRECT_URI = process.env.OKTA_REDIRECT_URI || ''

// Session cookie name
const SESSION_COOKIE = 'auth_session'

interface OktaTokenResponse {
  access_token: string
  id_token: string
  token_type: string
  expires_in: number
  scope: string
  refresh_token?: string
}

/**
 * Generate Okta authorization URL
 */
export function getOktaAuthUrl(state?: string): string {
  const params = new URLSearchParams({
    client_id: OKTA_CLIENT_ID,
    response_type: 'code',
    scope: 'openid profile email groups',
    redirect_uri: OKTA_REDIRECT_URI,
    state: state || crypto.randomUUID(),
  })

  return `${OKTA_ISSUER}/v1/authorize?${params.toString()}`
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(code: string): Promise<OktaTokenResponse | null> {
  try {
    const response = await fetch(`${OKTA_ISSUER}/v1/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${OKTA_CLIENT_ID}:${OKTA_CLIENT_SECRET}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: OKTA_REDIRECT_URI,
      }),
    })

    if (!response.ok) {
      console.error('Token exchange failed:', await response.text())
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Token exchange error:', error)
    return null
  }
}

/**
 * Verify and decode ID token
 */
export async function verifyIdToken(idToken: string): Promise<OktaClaims | null> {
  try {
    // Fetch Okta JWKS
    const jwksResponse = await fetch(`${OKTA_ISSUER}/v1/keys`)
    const jwks = await jwksResponse.json()

    // Decode token (in production, use a proper JWT library with signature verification)
    const [, payload] = idToken.split('.')
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString())

    // Basic validation
    if (decoded.iss !== OKTA_ISSUER) {
      console.error('Invalid issuer')
      return null
    }

    if (decoded.aud !== OKTA_CLIENT_ID) {
      console.error('Invalid audience')
      return null
    }

    if (decoded.exp < Date.now() / 1000) {
      console.error('Token expired')
      return null
    }

    return {
      sub: decoded.sub,
      email: decoded.email,
      email_verified: decoded.email_verified,
      name: decoded.name,
      given_name: decoded.given_name,
      family_name: decoded.family_name,
      groups: decoded.groups,
      hon_id: decoded.hon_id,
    }
  } catch (error) {
    console.error('ID token verification error:', error)
    return null
  }
}

/**
 * Handle Okta callback and create session
 */
export async function handleOktaCallback(code: string): Promise<SessionUser | null> {
  // Exchange code for tokens
  const tokens = await exchangeCodeForTokens(code)
  if (!tokens) {
    return null
  }

  // Verify ID token
  const claims = await verifyIdToken(tokens.id_token)
  if (!claims) {
    return null
  }

  // Find or create user in our database
  let user = await getUserByOktaId(claims.sub)
  
  if (!user) {
    // Try to find by email
    user = await getUserByEmail(claims.email)
    
    if (user) {
      // Link Okta ID to existing user
      const supabase = await createClient()
      await supabase
        .from('users')
        .update({ okta_id: claims.sub })
        .eq('id', user.id)
    }
  }

  if (!user) {
    console.error('User not found in database:', claims.email)
    return null
  }

  // Update last login
  await updateLastLogin(user.id)

  // Build session user
  const sessionUser = await buildSessionUser(user.id)
  if (!sessionUser) {
    return null
  }

  // Set session cookie
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, JSON.stringify({
    userId: user.id,
    oktaId: claims.sub,
    accessToken: tokens.access_token,
    expiresAt: Date.now() + (tokens.expires_in * 1000),
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: tokens.expires_in,
    path: '/',
  })

  return sessionUser
}

/**
 * Get current session user
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE)

  if (!sessionCookie?.value) {
    return null
  }

  try {
    const session = JSON.parse(sessionCookie.value)
    
    // Check if session expired
    if (session.expiresAt < Date.now()) {
      await signOut()
      return null
    }

    return await buildSessionUser(session.userId)
  } catch {
    return null
  }
}

/**
 * Sign out - clear session
 */
export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

/**
 * Get Okta logout URL
 */
export function getOktaLogoutUrl(postLogoutRedirectUri: string): string {
  const params = new URLSearchParams({
    post_logout_redirect_uri: postLogoutRedirectUri,
  })

  return `${OKTA_ISSUER}/v1/logout?${params.toString()}`
}

/**
 * Require authentication - redirect if not logged in
 */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getSessionUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  return user
}

/**
 * Require specific permission
 */
export async function requirePermission(
  resource: string,
  action: 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'admin'
): Promise<SessionUser> {
  const user = await requireAuth()

  // Check if user has the required permission
  const permissionKey = `${resource}:${action}`
  const hasPermission = user.is_super_user || 
    user.permissions.includes(permissionKey) ||
    user.permissions.includes(`${resource}:admin`) ||
    user.permissions.includes('*:admin')

  if (!hasPermission) {
    redirect('/auth/unauthorized')
  }

  return user
}
