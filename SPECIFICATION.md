# Unified Commerce B2B Platform - Complete Specification

**Project Name:** Honeywell Unified Commerce B2B Portal  
**Status:** In Development (Authentication Phase - Okta Integration)  
**Last Updated:** May 2026  

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Technical Stack](#technical-stack)
3. [Architecture](#architecture)
4. [Database Schema](#database-schema)
5. [Authentication Flow](#authentication-flow)
6. [Authorization Model](#authorization-model)
7. [API Endpoints](#api-endpoints)
8. [User Roles & Personas](#user-roles--personas)
9. [Features & Workflows](#features--workflows)
10. [Test Data](#test-data)
11. [Environment Variables](#environment-variables)
12. [Deployment](#deployment)
13. [Known Issues & Solutions](#known-issues--solutions)

---

## Executive Summary

### What This Application Does
A **multi-tenant B2B e-commerce platform** for Honeywell that enables:
- **Distributors, Partners, and Customers** to browse, quote, and order Honeywell products
- **Role-based access control** with enterprise hierarchy support
- **Fine-grained authorization** using Okta FGA (Relationship-Based Access Control)
- **Cross-SBG (Strategic Business Group) order management** with region/sales area awareness
- **Admin portal** for user and organization management

### Key Differentiators
- Multi-organization support with nested hierarchies (Organization → Sold-To Account → Sales Area)
- Flexible persona system (Admin, Buyer, Approver, Viewer)
- Enterprise authorization using OpenFGA for scalable permission management
- Okta SSO integration for centralized authentication
- Full audit trail and authorization logging

---

## Technical Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **UI Framework:** React 19.2
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui
- **Language:** TypeScript 5+
- **State Management:** SWR for data fetching, React Context for auth

### Backend
- **Runtime:** Node.js (Next.js server)
- **ORM/Query Builder:** Direct SQL via Supabase client (no ORM)
- **Database:** Supabase (PostgreSQL 14+)
- **Authentication:** Okta OIDC + NextAuth v5
- **Authorization:** Okta FGA (OpenFGA)

### Infrastructure
- **Hosting:** Vercel (Next.js optimized)
- **Database:** Supabase (hosted PostgreSQL)
- **Authentication Provider:** Okta.com
- **Authorization Service:** Okta FGA (or self-hosted OpenFGA)
- **File Storage:** Vercel Blob (future: for invoices, documents)

### Development Tools
- **Package Manager:** pnpm
- **Testing:** Jest + React Testing Library (planned)
- **Linting:** ESLint + Prettier
- **Version Control:** Git + GitHub

---

## Architecture

### High-Level Flow
```
User → Okta Login → NextAuth Session → Supabase User Lookup → FGA Authorization Check → App Access
```

### Component Architecture
```
app/
├── (auth)/
│   ├── login/
│   ├── callback/
│   └── logout/
├── admin/                    # Admin portal (protected)
│   ├── users/
│   ├── organizations/
│   ├── roles/
│   └── audit/
├── (app)/                    # Main app (protected)
│   ├── products/
│   ├── orders/
│   ├── quotes/
│   └── cart/
└── api/
    └── auth/[...nextauth]/   # NextAuth handlers

lib/
├── auth/
│   ├── auth.config.ts        # NextAuth config with Okta provider
│   ├── auth.ts               # Session helpers
│   └── middleware.ts         # Auth middleware
├── supabase/
│   ├── client.ts             # Browser client
│   └── server.ts             # Server client
├── fga/
│   ├── client.ts             # OpenFGA client
│   └── authorization.ts      # FGA helper functions
└── okta/
    └── config.ts             # Okta settings

components/
├── auth/
│   ├── login-form.tsx
│   └── user-menu.tsx
├── admin/
│   ├── user-table.tsx
│   ├── org-form.tsx
│   └── permission-matrix.tsx
└── common/
    ├── protected-route.tsx
    └── unauthorized.tsx

hooks/
├── use-authorization.ts      # Client-side authorization check
├── use-session.ts            # Session data hook
└── use-user-context.ts       # User profile hook
```

---

## Database Schema

### Core Tables

#### organizations
```sql
id: UUID (PK)
external_id: TEXT UNIQUE        -- "001ACC001", "001ACC002", etc.
name: TEXT                       -- "BlueRock Holdings", "Summit Distribution"
type: TEXT                       -- "Distributor", "Partner", "Customer", "Internal"
line_of_business: TEXT[]        -- ["Fire", "HBS", "IA/BA/PT"]
account_number: TEXT            -- ERP account number
erp_number: TEXT                -- ERP identifier
status: TEXT                    -- "Active", "Inactive"
created_at: TIMESTAMPTZ
```

#### users
```sql
id: UUID (PK)
okta_id: TEXT UNIQUE            -- From Okta "sub" claim
hon_id: TEXT UNIQUE             -- Honeywell employee ID (e.g., "h125001")
email: TEXT UNIQUE
first_name: TEXT
last_name: TEXT
phone: TEXT
language_iso: TEXT              -- "en", "de", "fr", etc.
is_super_user: BOOLEAN          -- System admin
status: TEXT                    -- "Active", "Suspended", "Inactive"
created_at: TIMESTAMPTZ
```

#### user_organizations
```sql
id: UUID (PK)
user_id: UUID (FK → users)
organization_id: UUID (FK → organizations)
is_primary: BOOLEAN             -- Primary org for the user
persona: TEXT                   -- "Buyer", "Admin", "Viewer", "Approver"
portal_status: TEXT             -- "Active", "Suspended"
created_at: TIMESTAMPTZ
UNIQUE(user_id, organization_id)
```

#### roles
```sql
id: UUID (PK)
name: TEXT UNIQUE               -- "Super Admin", "Org Admin", "Buyer", "Approver", "Viewer"
description: TEXT
created_at: TIMESTAMPTZ
```

#### user_roles
```sql
id: UUID (PK)
user_id: UUID (FK → users)
role_id: UUID (FK → roles)
organization_id: UUID (FK → organizations)
created_at: TIMESTAMPTZ
UNIQUE(user_id, role_id, organization_id)
```

#### sold_tos
```sql
id: UUID (PK)
external_id: TEXT UNIQUE        -- "001ACC001-ST1", "001ACC001-ST2"
name: TEXT                       -- "BlueRock Holdings - Location 1"
organization_id: UUID (FK → organizations)
is_primary: BOOLEAN
is_default: BOOLEAN
status: TEXT                    -- "Active", "Inactive"
created_at: TIMESTAMPTZ
```

#### sales_areas
```sql
id: UUID (PK)
sold_to_id: UUID (FK → sold_tos)
sales_org: TEXT                 -- "US01", "CA01", "EU01"
currency: TEXT                  -- "USD", "EUR", "GBP"
distribution_channel: TEXT      -- "10"
division: TEXT                  -- "FI" (Fire and Integrated)
sales_area_code: TEXT           -- "US01_10_FI"
created_at: TIMESTAMPTZ
UNIQUE(sold_to_id, sales_area_code)
```

#### tools
```sql
id: UUID (PK)
master_tool_id: TEXT UNIQUE     -- "TOOL_ECOMMERCE", "TOOL_ORDERS"
name: TEXT                       -- "e-Commerce", "Order Status"
description: TEXT
icon: TEXT                       -- Icon name/URL
requires_approval: BOOLEAN      -- Requires admin approval
route: TEXT                     -- "/products", "/orders"
created_at: TIMESTAMPTZ
```

#### tool_access
```sql
id: UUID (PK)
user_id: UUID (FK → users)
tool_id: UUID (FK → tools)
organization_id: UUID (FK → organizations)
status: TEXT                    -- "Approved", "Pending", "Rejected"
requested_date: TIMESTAMPTZ
granted_date: TIMESTAMPTZ
created_at: TIMESTAMPTZ
UNIQUE(user_id, tool_id, organization_id)
```

#### resources
```sql
id: UUID (PK)
name: TEXT UNIQUE               -- "products:view", "orders:create", "admin:access"
type: TEXT                      -- "page", "action", "data"
description: TEXT
created_at: TIMESTAMPTZ
```

#### role_permissions
```sql
id: UUID (PK)
role_id: UUID (FK → roles)
resource_id: UUID (FK → resources)
permission: TEXT                -- "view", "create", "edit", "delete", "approve"
created_at: TIMESTAMPTZ
UNIQUE(role_id, resource_id, permission)
```

#### authorization_logs
```sql
id: UUID (PK)
user_id: UUID (FK → users)
action: TEXT                    -- "login", "view", "create", "delete"
resource: TEXT                  -- "orders", "quotes", "admin"
decision: TEXT                  -- "allow", "deny"
context: JSONB                  -- {soldToId, salesArea, reason}
created_at: TIMESTAMPTZ
```

---

## Authentication Flow

### Step-by-Step

1. **User clicks "Sign in with Okta SSO"**
   - Redirects to `/api/auth/signin?callbackUrl=/dashboard`

2. **NextAuth redirects to Okta**
   ```
   https://integrator-8933100.okta.com/oauth2/default/v1/authorize?
   client_id=0oa1345e2ngyFrsPR698
   redirect_uri=https://hon-unified-commerce.vercel.app/api/auth/callback/okta
   response_type=code
   scope=openid+profile+email
   ```

3. **User authenticates with Okta**
   - Enters email + password
   - Completes MFA if required

4. **Okta redirects back with authorization code**
   ```
   /api/auth/callback/okta?code=ABC123&state=XYZ789
   ```

5. **NextAuth exchanges code for tokens**
   - Backend calls Okta token endpoint
   - Receives: access_token, id_token, refresh_token

6. **SignIn callback (custom)**
   - Validates Okta user has email
   - Looks up user in Supabase by email
   - Updates okta_id field
   - Returns true/false

7. **JWT callback (custom)**
   - Extracts user data from tokens
   - Stores in JWT: oktaId, email, name, accessToken
   - Signed with AUTH_SECRET

8. **Session callback (custom)**
   - Returns session object with user data
   - User can access via `useSession()` hook

9. **User redirected to `/dashboard`**
   - Session established
   - Can now access protected routes

### Key Files

**`lib/auth/auth.config.ts`**
- NextAuth configuration
- Okta provider setup
- SignIn, JWT, Session callbacks

**`app/api/auth/[...nextauth]/route.ts`**
- NextAuth catch-all handler
- Provides `/api/auth/signin`, `/api/auth/callback/okta`, etc.

**`lib/auth/middleware.ts`**
- Runs on every request
- Checks auth status
- Redirects unauthenticated users to login

---

## Authorization Model

### Three-Layer Authorization

#### Layer 1: Role-Based Access Control (RBAC)
```
User → Role (Admin, Buyer, Approver, Viewer)
      ↓
      Permissions (view, create, edit, delete)
```

#### Layer 2: Relationship-Based Access Control (ReBAC)
```
User → Organization → Sold-To Account → Sales Area
```

User can only access resources within their org hierarchy.

#### Layer 3: Attribute-Based Access Control (ABAC)
```
Context: {region: "US", salesArea: "US01", currency: "USD"}
Decision: Allow if user's sales area matches context
```

### Authorization Checks

**Client-Side (UI-level)**
```tsx
const { canAccess } = useAuthorization({
  resource: 'orders:view',
  context: { soldToId, salesArea }
});

if (canAccess) {
  return <OrderList />;
}
return <Unauthorized />;
```

**Server-Side (API-level)**
```ts
const authorized = await checkAuthorization({
  userId,
  action: 'create',
  resource: 'quote',
  context: { soldToId, orgId }
});

if (!authorized) {
  return new Response('Unauthorized', { status: 403 });
}
```

### OpenFGA Model (DSL)

```dsl
model
  schema 1.1

type user

type organization
  relations
    define member: [user]
    define admin: [user, user:*]

type sold_to
  relations
    define entitled_org: [organization]
    define can_order: admin from entitled_org or member from entitled_org

type tool
  relations
    define allowed_role: [role#assignee]
    define can_access: allowed_role

type role
  relations
    define assignee: [user]
    define has_permission: [resource]

type resource
  relations
    define owned_by_role: [role]
    define can_view: assignee from owned_by_role
    define can_edit: assignee from owned_by_role or owner
    define owner: [user]
```

---

## API Endpoints

### Authentication Endpoints
```
POST   /api/auth/signin                    # Login
GET    /api/auth/callback/okta             # Okta callback
POST   /api/auth/logout                    # Logout
GET    /api/auth/session                   # Get current session
GET    /api/auth/providers                 # List auth providers
```

### Authorization Endpoints
```
POST   /api/auth/check-access              # Check if user can access resource
GET    /api/auth/permissions               # Get user's permissions
GET    /api/auth/organizations             # Get user's organizations
```

### Admin Endpoints (Protected)
```
GET    /api/admin/users                    # List all users
GET    /api/admin/users/[id]               # Get user details
POST   /api/admin/users                    # Create user
PUT    /api/admin/users/[id]               # Update user
DELETE /api/admin/users/[id]               # Delete user

GET    /api/admin/organizations            # List organizations
POST   /api/admin/organizations            # Create org
PUT    /api/admin/organizations/[id]       # Update org

GET    /api/admin/roles                    # List roles
POST   /api/admin/roles                    # Create role
PUT    /api/admin/roles/[id]               # Update role

GET    /api/admin/tools                    # List tools
POST   /api/admin/tools/[id]/grant         # Grant tool access
DELETE /api/admin/tools/[id]/revoke        # Revoke tool access

GET    /api/admin/audit                    # Get authorization logs
```

### e-Commerce Endpoints
```
GET    /api/products                       # List products
GET    /api/products/[id]                  # Get product details
GET    /api/cart                           # Get user's cart
POST   /api/cart/items                     # Add to cart
DELETE /api/cart/items/[id]                # Remove from cart

GET    /api/orders                         # List user's orders
GET    /api/orders/[id]                    # Get order details
POST   /api/orders                         # Create order

GET    /api/quotes                         # List quotes
POST   /api/quotes                         # Create quote
PUT    /api/quotes/[id]/approve            # Approve quote
```

---

## User Roles & Personas

### System Roles

| Role | Level | Permissions | Can Access |
|------|-------|-------------|------------|
| **Super Admin** | System | All | All tools, all orgs, all users |
| **Org Admin** | Organization | Create users, manage roles, view audit | Admin portal, all org tools |
| **Buyer** | Organization | Create orders/quotes, view products | e-Commerce, Orders, Quotes, Cart |
| **Approver** | Organization | Approve quotes/orders | Quotes (approve), Orders (view) |
| **Viewer** | Organization | Read-only | Product Catalog, Order Status (view) |

### Okta Personas

| Persona | Mapping | Tools |
|---------|---------|-------|
| GBE (Honeywell Employee) | Super Admin, Org Admin | All |
| Distributor Admin | Org Admin | e-Commerce, Quotes, Orders, Support |
| Distributor Buyer | Buyer | e-Commerce, Quotes, Orders, Cart |
| Partner Admin | Org Admin | e-Commerce, Quotes, Orders |
| Customer Buyer | Buyer | e-Commerce, Orders, Quotes |
| Approver | Approver | Quote Approval, Order Approval |

---

## Features & Workflows

### Feature Set (MVP)

#### Authentication & Authorization
- ✅ Okta SSO login/logout
- ✅ Session management
- ✅ Role-based access control
- ✅ Multi-organization support
- ⏳ Fine-grained authorization (OpenFGA)

#### Admin Portal
- ⏳ User management (CRUD)
- ⏳ Organization management
- ⏳ Role and permission management
- ⏳ Tool access control
- ⏳ Authorization audit logs
- ⏳ User import/export

#### e-Commerce
- ⏳ Product catalog (with sold-to/sales area filtering)
- ⏳ Product search & filtering
- ⏳ Shopping cart
- ⏳ Quick order entry
- ⏳ Checkout flow

#### Order Management
- ⏳ Order history
- ⏳ Order status tracking
- ⏳ Order details with line items
- ⏳ Repeat orders

#### Quotes
- ⏳ Create quotes from cart
- ⏳ Quote status tracking
- ⏳ Quote approval workflow
- ⏳ Quote to order conversion

#### Invoices & Billing
- ⏳ Invoice history
- ⏳ Invoice download (PDF)
- ⏳ Invoice filtering by date/amount

---

## Test Data

### Organizations (11 Total)

| External ID | Name | Type | Line of Business |
|-------------|------|------|------------------|
| 001ACC001 | BlueRock Holdings | Distributor | Fire |
| 001ACC002 | Summit Distribution | Partner | HBS, Fire |
| 001ACC003 | Pacific Partners LLC | Customer | IA/BA/PT |
| 001ACC004 | Northern Electric Co | Distributor | Fire, HBS |
| 001ACC005 | Midwest Solutions | Partner | IA/BA/PT |
| 001ACC006 | Eastern Distributors | Distributor | Fire |
| 001ACC007 | Western Partners | Customer | HBS, Fire |
| 001ACC008 | Central Commerce | Partner | Fire, HBS |
| 001ACC009 | Global Enterprises | Customer | IA/BA/PT, Fire |
| 001ACC010 | Prime Industries | Distributor | HBS |
| 001ACC011 | Honeywell Internal | Internal | Fire, HBS, IA/BA/PT |

### Test Users (26 Total)

#### Admin Users (8)
- `sarah.johnson2@example.com` - Sarah Johnson (Org Admin)
- `david.garcia5@example.com` - David Garcia (Org Admin)
- `sophia.davis8@example.com` - Sophia Davis (Org Admin)
- `admin.super@honeywell.com` - System Administrator (Super Admin)

#### Buyer Users (10)
- `miguel.patel1@example.com` - Miguel Patel
- `emma.williams4@example.com` - Emma Williams
- `william.brown7@example.com` - William Brown
- `alexander.wilson9@example.com` - Alexander Wilson
- `lucas.robinson21@example.com` - Lucas Robinson
- `henry.rodriguez23@example.com` - Henry Rodriguez
- Plus 4 more

#### Viewer Users (5)
- `james.chen3@example.com` - James Chen
- `olivia.martinez6@example.com` - Olivia Martinez
- Plus 3 more

#### Approver Users (3)
- Various users with Approver role

### Test Credentials

All test users in Okta were created with passwords matching their organization:
```
BlueRock@2024!        # BlueRock Holdings users
Summit@2024!          # Summit Distribution users
Pacific@2024!         # Pacific Partners users
```

**Login Flow:**
1. Go to `https://hon-unified-commerce.vercel.app/auth/login`
2. Click "Continue with Okta SSO"
3. Enter: `miguel.patel1@example.com` / `BlueRock@2024!`
4. Should redirect to dashboard

---

## Environment Variables

### Required for Production

```env
# Okta Configuration
OKTA_ISSUER=https://integrator-8933100.okta.com/oauth2/default
OKTA_CLIENT_ID=0oa1345e2ngyFrsPR698
OKTA_CLIENT_SECRET=LW_hQ8yKQ8h8Bu18pLOXbfpsDEG-PnYp3SkWisjyPrTxFbm7W5TisASr4aZBzIXt

# NextAuth Configuration
AUTH_SECRET=Kx7vZ9mQ2nR4sT6wY8aB0cD1eF3gH5iJ
AUTH_TRUST_HOST=true
NEXTAUTH_URL=https://hon-unified-commerce.vercel.app

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://gterodqhfcizfbiqmtrn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenFGA Configuration (Optional - if using FGA)
FGA_API_URL=https://api.us1.fga.dev
FGA_STORE_ID=01HZ...
FGA_AUTHORIZATION_MODEL_ID=01HZ...
FGA_API_TOKEN_ISSUER=https://auth.fga.dev
FGA_API_AUDIENCE=https://api.us1.fga.dev/
FGA_CLIENT_ID=...
FGA_CLIENT_SECRET=...

# Application Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=Unified Commerce
```

### Development Variables

Same as production, but with `localhost` URLs:
```env
NEXTAUTH_URL=http://localhost:3000
```

---

## Deployment

### Current Deployment
- **URL:** https://hon-unified-commerce.vercel.app
- **Platform:** Vercel
- **Database:** Supabase (hosted)
- **Branch:** main
- **Automatic Deployments:** Enabled from GitHub

### Vercel Project Configuration
```
Project Name: v0-b2b-ecommerce-roadmap-8yok
Domains: 
  - hon-unified-commerce.vercel.app (Primary)
  - v0-b2b-ecommerce-roadmap-8yok.vercel.app (307 redirect)
```

### Deployment Steps

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Vercel Auto-Deploys**
   - Runs build: `pnpm run build`
   - Deploys to production

3. **Verify Deployment**
   ```bash
   curl https://hon-unified-commerce.vercel.app/health
   ```

### Build Configuration
```json
{
  "buildCommand": "pnpm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "nodeVersion": "20.x"
}
```

---

## Known Issues & Solutions

### Issue 1: Okta "You are not allowed to access this app"
**Cause:** User not assigned to app or app access policies blocking

**Solution:**
1. Go to Okta Admin Console
2. Find app: `Applications → One Commerce` (Client ID: `0oa1345e2ngyFrsPR698`)
3. Click **Assignments** tab
4. Assign users to app OR enable "Allow everyone in your organization"
5. Verify **Sign On** tab has correct redirect URIs:
   - `https://hon-unified-commerce.vercel.app/api/auth/callback/okta`

### Issue 2: NextAuth Configuration Error
**Cause:** Missing `AUTH_SECRET` or `AUTH_TRUST_HOST` environment variable

**Solution:**
1. Update Vercel project environment variables
2. Set `AUTH_SECRET` to a random 32+ character string
3. Set `AUTH_TRUST_HOST=true`
4. Redeploy: `vercel deploy --prod`

### Issue 3: Supabase Connection Error
**Cause:** Missing or incorrect Supabase keys

**Solution:**
1. Get keys from: https://app.supabase.com/project/gterodqhfcizfbiqmtrn/settings/api
2. Update env vars:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`

### Issue 4: User Not Found After Okta Login
**Cause:** okta_id field not updated or user not seeded in database

**Solution:**
1. Verify user exists in Supabase: 
   ```sql
   SELECT * FROM users WHERE email = 'miguel.patel1@example.com';
   ```
2. If not found, run seed script:
   ```bash
   pnpm ts-node scripts/seed-db.ts
   ```
3. Check `okta_id` is populated

### Issue 5: CORS or Redirect URL Errors
**Cause:** Okta app settings don't match app domain

**Solution:**
1. Update Okta app settings:
   - **Sign-in redirect URIs:** `https://hon-unified-commerce.vercel.app/api/auth/callback/okta`
   - **Sign-out redirect URIs:** `https://hon-unified-commerce.vercel.app`
   - Verify **Client ID** matches `OKTA_CLIENT_ID` env var

---

## Restart from Another Context

### Step 1: Clone Repository
```bash
git clone https://github.com/gkravi/v0-b2b-ecommerce-roadmap.git
cd v0-b2b-ecommerce-roadmap
```

### Step 2: Set Up Environment Variables
Create `.env.local`:
```bash
cp .env.example .env.local
# Then fill in all required variables from the Environment Variables section above
```

### Step 3: Install Dependencies
```bash
pnpm install
```

### Step 4: Set Up Database
```bash
# Create tables and seed data
pnpm ts-node scripts/seed-db.ts

# Or run migrations if available
pnpm run migrate
```

### Step 5: Start Development Server
```bash
pnpm dev
# Opens http://localhost:3000
```

### Step 6: Test Authentication
1. Navigate to http://localhost:3000/auth/login
2. Click "Continue with Okta SSO"
3. Enter test credentials: `miguel.patel1@example.com` / `BlueRock@2024!`

### Step 7: Verify Database Connection
```bash
curl http://localhost:3000/api/health
# Should return: {"status":"ok","database":"connected"}
```

---

## Next Steps / Roadmap

### Immediate (Phase 1 - Current)
- ✅ Database schema created
- ✅ Test data seeded
- ✅ Okta integration started
- 🔴 **Fix Okta app access policy issue**
- ⏳ Complete auth callback flow

### Short Term (Phase 2)
- ⏳ Admin portal MVP
- ⏳ User management (CRUD)
- ⏳ Role/permission management
- ⏳ Tool access control

### Medium Term (Phase 3)
- ⏳ e-Commerce pages (products, cart, checkout)
- ⏳ Order management
- ⏳ Quote management
- ⏳ Fine-grained authorization (FGA) integration

### Long Term (Phase 4+)
- ⏳ Invoice management
- ⏳ Advanced reporting
- ⏳ Custom integrations (ERP, CRM, etc.)
- ⏳ Mobile app

---

## Support & Documentation

- **Okta Setup:** https://developer.okta.com/docs/guides/implement-oauth-for-okta/main/
- **NextAuth Docs:** https://next-auth.js.org/
- **Supabase Docs:** https://supabase.com/docs
- **OpenFGA Docs:** https://openfga.dev/docs
- **Next.js Docs:** https://nextjs.org/docs

---

**Document Version:** 1.0  
**Last Updated:** May 18, 2026  
**Created By:** v0 AI  
**Status:** Complete - Ready for Development
