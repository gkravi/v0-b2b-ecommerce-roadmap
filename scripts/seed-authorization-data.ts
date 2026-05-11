/**
 * Seed script for Authorization Data
 * Creates 100+ users across 15 organizations with roles, tools, and sold-tos
 * 
 * Run with: npx tsx scripts/seed-authorization-data.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Sample data generators
const firstNames = [
  'Priya', 'Raj', 'Sarah', 'Michael', 'Emma', 'James', 'Aisha', 'Carlos',
  'Wei', 'Fatima', 'John', 'Maria', 'David', 'Lisa', 'Ahmed', 'Sophie',
  'Yuki', 'Hans', 'Anna', 'Roberto', 'Chen', 'Nina', 'Viktor', 'Isabella',
  'Omar', 'Lena', 'Kai', 'Marta', 'Dmitri', 'Elena', 'Kenji', 'Olga'
]

const lastNames = [
  'Sharma', 'Patel', 'Johnson', 'Williams', 'Brown', 'Garcia', 'Kim', 'Chen',
  'Singh', 'Kumar', 'Anderson', 'Martinez', 'Rodriguez', 'Lee', 'Walker', 'Hall',
  'Allen', 'Young', 'King', 'Wright', 'Lopez', 'Hill', 'Scott', 'Green',
  'Adams', 'Baker', 'Gonzalez', 'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts'
]

// Organizations data
const organizations = [
  { external_id: 'ORG-ACME-001', name: 'ACME Industries', type: 'Customer', line_of_business: ['IA', 'BA', 'PT'] },
  { external_id: 'ORG-GLOB-002', name: 'Global Manufacturing Corp', type: 'Customer', line_of_business: ['IA', 'PT'] },
  { external_id: 'ORG-TECH-003', name: 'TechSolutions Inc', type: 'Customer', line_of_business: ['BA'] },
  { external_id: 'ORG-DIST-004', name: 'Industrial Distributors LLC', type: 'Distributor', line_of_business: ['IA', 'BA', 'PT'] },
  { external_id: 'ORG-PART-005', name: 'Premier Partners', type: 'Partner', line_of_business: ['IA'] },
  { external_id: 'ORG-MEGA-006', name: 'MegaCorp International', type: 'Customer', line_of_business: ['IA', 'BA'] },
  { external_id: 'ORG-AUTO-007', name: 'AutoTech Systems', type: 'Customer', line_of_business: ['PT'] },
  { external_id: 'ORG-ENRG-008', name: 'Energy Solutions Group', type: 'Customer', line_of_business: ['IA', 'PT'] },
  { external_id: 'ORG-BUIL-009', name: 'BuildRight Construction', type: 'Customer', line_of_business: ['BA'] },
  { external_id: 'ORG-AERO-010', name: 'AeroSpace Dynamics', type: 'Customer', line_of_business: ['IA'] },
  { external_id: 'ORG-PHAR-011', name: 'PharmaTech Industries', type: 'Customer', line_of_business: ['PT', 'IA'] },
  { external_id: 'ORG-FOOD-012', name: 'FoodProcess Co', type: 'Customer', line_of_business: ['PT'] },
  { external_id: 'ORG-DIST-013', name: 'National Distribution Inc', type: 'Distributor', line_of_business: ['IA', 'BA'] },
  { external_id: 'ORG-INTL-014', name: 'Honeywell Internal', type: 'Internal', line_of_business: ['IA', 'BA', 'PT'] },
  { external_id: 'ORG-SMRT-015', name: 'SmartFactory Solutions', type: 'Partner', line_of_business: ['IA', 'BA'] },
]

// Roles data
const roles = [
  { name: 'SuperAdmin', description: 'Full system access', is_system_role: true },
  { name: 'OrgAdmin', description: 'Organization administrator', is_system_role: true },
  { name: 'Buyer', description: 'Can browse products, create orders', is_system_role: false },
  { name: 'Approver', description: 'Can approve orders and quotes', is_system_role: false },
  { name: 'Viewer', description: 'Read-only access', is_system_role: false },
  { name: 'QuoteManager', description: 'Can create and manage quotes', is_system_role: false },
  { name: 'OrderManager', description: 'Can manage orders', is_system_role: false },
  { name: 'InventoryViewer', description: 'Can view inventory levels', is_system_role: false },
  { name: 'PriceViewer', description: 'Can view pricing information', is_system_role: false },
  { name: 'SupportAgent', description: 'Customer support role', is_system_role: false },
]

// Tools/Applications data
const tools = [
  { master_tool_id: 'TOOL-PRODUCTS', name: 'Product Catalog', description: 'Browse and search products', icon: 'Package', route: '/products', requires_approval: false },
  { master_tool_id: 'TOOL-ORDERS', name: 'Order Management', description: 'View and manage orders', icon: 'ShoppingCart', route: '/orders', requires_approval: false },
  { master_tool_id: 'TOOL-QUOTES', name: 'Quote Management', description: 'Create and manage quotes', icon: 'FileText', route: '/quotes', requires_approval: true },
  { master_tool_id: 'TOOL-CART', name: 'Shopping Cart', description: 'Add items and checkout', icon: 'ShoppingBag', route: '/cart', requires_approval: false },
  { master_tool_id: 'TOOL-QUICKADD', name: 'Quick Add', description: 'Bulk add items to cart', icon: 'Zap', route: '/quick-add', requires_approval: false },
  { master_tool_id: 'TOOL-INVENTORY', name: 'Inventory Check', description: 'Check product availability', icon: 'Box', route: '/inventory', requires_approval: true },
  { master_tool_id: 'TOOL-PRICING', name: 'Pricing Calculator', description: 'Calculate pricing and discounts', icon: 'Calculator', route: '/pricing', requires_approval: true },
  { master_tool_id: 'TOOL-REPORTS', name: 'Reports', description: 'View reports and analytics', icon: 'BarChart', route: '/reports', requires_approval: true },
  { master_tool_id: 'TOOL-ADMIN', name: 'Admin Portal', description: 'User and access management', icon: 'Settings', route: '/admin', requires_approval: true },
  { master_tool_id: 'TOOL-SUPPORT', name: 'Support Center', description: 'Get help and support', icon: 'HelpCircle', route: '/support', requires_approval: false },
]

// Resources (pages/actions)
const resources = [
  { name: 'products', type: 'page', description: 'Product listing page' },
  { name: 'products.detail', type: 'page', description: 'Product detail page' },
  { name: 'orders', type: 'page', description: 'Order listing page' },
  { name: 'orders.create', type: 'action', description: 'Create new order' },
  { name: 'orders.cancel', type: 'action', description: 'Cancel order' },
  { name: 'quotes', type: 'page', description: 'Quote listing page' },
  { name: 'quotes.create', type: 'action', description: 'Create new quote' },
  { name: 'quotes.approve', type: 'action', description: 'Approve quote' },
  { name: 'cart', type: 'page', description: 'Shopping cart page' },
  { name: 'cart.checkout', type: 'action', description: 'Checkout cart' },
  { name: 'quick-add', type: 'page', description: 'Quick add page' },
  { name: 'inventory', type: 'page', description: 'Inventory page' },
  { name: 'pricing', type: 'page', description: 'Pricing page' },
  { name: 'reports', type: 'page', description: 'Reports page' },
  { name: 'admin', type: 'page', description: 'Admin portal' },
  { name: 'admin.users', type: 'page', description: 'User management' },
  { name: 'admin.roles', type: 'page', description: 'Role management' },
  { name: 'admin.tools', type: 'page', description: 'Tool access management' },
]

// Role permissions matrix
const rolePermissions: Record<string, { resource: string; permission: string }[]> = {
  'SuperAdmin': [
    { resource: '*', permission: 'admin' },
  ],
  'OrgAdmin': [
    { resource: 'products', permission: 'view' },
    { resource: 'products.detail', permission: 'view' },
    { resource: 'orders', permission: 'view' },
    { resource: 'orders', permission: 'create' },
    { resource: 'orders', permission: 'edit' },
    { resource: 'quotes', permission: 'view' },
    { resource: 'quotes', permission: 'create' },
    { resource: 'quotes', permission: 'approve' },
    { resource: 'cart', permission: 'view' },
    { resource: 'cart.checkout', permission: 'create' },
    { resource: 'admin', permission: 'view' },
    { resource: 'admin.users', permission: 'view' },
    { resource: 'admin.users', permission: 'edit' },
  ],
  'Buyer': [
    { resource: 'products', permission: 'view' },
    { resource: 'products.detail', permission: 'view' },
    { resource: 'orders', permission: 'view' },
    { resource: 'orders', permission: 'create' },
    { resource: 'cart', permission: 'view' },
    { resource: 'cart.checkout', permission: 'create' },
    { resource: 'quick-add', permission: 'view' },
  ],
  'Approver': [
    { resource: 'products', permission: 'view' },
    { resource: 'orders', permission: 'view' },
    { resource: 'orders', permission: 'approve' },
    { resource: 'quotes', permission: 'view' },
    { resource: 'quotes', permission: 'approve' },
  ],
  'Viewer': [
    { resource: 'products', permission: 'view' },
    { resource: 'products.detail', permission: 'view' },
    { resource: 'orders', permission: 'view' },
    { resource: 'quotes', permission: 'view' },
  ],
  'QuoteManager': [
    { resource: 'products', permission: 'view' },
    { resource: 'quotes', permission: 'view' },
    { resource: 'quotes', permission: 'create' },
    { resource: 'quotes', permission: 'edit' },
    { resource: 'pricing', permission: 'view' },
  ],
  'OrderManager': [
    { resource: 'products', permission: 'view' },
    { resource: 'orders', permission: 'view' },
    { resource: 'orders', permission: 'create' },
    { resource: 'orders', permission: 'edit' },
    { resource: 'inventory', permission: 'view' },
  ],
  'InventoryViewer': [
    { resource: 'products', permission: 'view' },
    { resource: 'inventory', permission: 'view' },
  ],
  'PriceViewer': [
    { resource: 'products', permission: 'view' },
    { resource: 'pricing', permission: 'view' },
  ],
  'SupportAgent': [
    { resource: 'products', permission: 'view' },
    { resource: 'orders', permission: 'view' },
    { resource: 'quotes', permission: 'view' },
  ],
}

// Sales org codes
const salesOrgs = ['US01', 'US02', 'CA01', 'MX01', 'DE01', 'FR01', 'UK01', 'CN01', 'IN01', 'JP01']
const currencies = { US01: 'USD', US02: 'USD', CA01: 'CAD', MX01: 'MXN', DE01: 'EUR', FR01: 'EUR', UK01: 'GBP', CN01: 'CNY', IN01: 'INR', JP01: 'JPY' }

async function seed() {
  console.log('Starting seed process...')

  // 1. Insert Organizations
  console.log('Creating organizations...')
  const { data: orgsData, error: orgsError } = await supabase
    .from('organizations')
    .upsert(organizations.map(org => ({
      ...org,
      account_number: `ACC-${org.external_id.split('-')[2]}`,
      erp_number: `ERP-${Math.floor(Math.random() * 900000) + 100000}`,
    })), { onConflict: 'external_id' })
    .select()

  if (orgsError) {
    console.error('Error creating organizations:', orgsError)
    return
  }
  console.log(`Created ${orgsData?.length} organizations`)

  // Fetch organizations for reference
  const { data: allOrgs } = await supabase.from('organizations').select('*')
  const orgMap = new Map(allOrgs?.map(o => [o.external_id, o.id]) || [])

  // 2. Insert Roles
  console.log('Creating roles...')
  const { data: rolesData, error: rolesError } = await supabase
    .from('roles')
    .upsert(roles, { onConflict: 'name' })
    .select()

  if (rolesError) {
    console.error('Error creating roles:', rolesError)
    return
  }
  console.log(`Created ${rolesData?.length} roles`)

  const roleMap = new Map(rolesData?.map(r => [r.name, r.id]) || [])

  // 3. Insert Tools
  console.log('Creating tools...')
  const { data: toolsData, error: toolsError } = await supabase
    .from('tools')
    .upsert(tools, { onConflict: 'master_tool_id' })
    .select()

  if (toolsError) {
    console.error('Error creating tools:', toolsError)
    return
  }
  console.log(`Created ${toolsData?.length} tools`)

  const toolMap = new Map(toolsData?.map(t => [t.master_tool_id, t.id]) || [])

  // 4. Insert Resources
  console.log('Creating resources...')
  const { data: resourcesData, error: resourcesError } = await supabase
    .from('resources')
    .upsert(resources as any[], { onConflict: 'name' })
    .select()

  if (resourcesError) {
    console.error('Error creating resources:', resourcesError)
    return
  }
  console.log(`Created ${resourcesData?.length} resources`)

  const resourceMap = new Map(resourcesData?.map(r => [r.name, r.id]) || [])

  // 5. Insert Role Permissions
  console.log('Creating role permissions...')
  const permissionsToInsert: any[] = []
  for (const [roleName, perms] of Object.entries(rolePermissions)) {
    const roleId = roleMap.get(roleName)
    if (!roleId) continue

    for (const perm of perms) {
      const resourceId = resourceMap.get(perm.resource)
      if (!resourceId && perm.resource !== '*') continue

      // For wildcard, create a special resource
      if (perm.resource === '*') {
        const { data: wildcardResource } = await supabase
          .from('resources')
          .upsert({ name: '*', type: 'page', description: 'All resources' }, { onConflict: 'name' })
          .select()
          .single()

        if (wildcardResource) {
          permissionsToInsert.push({
            role_id: roleId,
            resource_id: wildcardResource.id,
            permission: perm.permission,
          })
        }
      } else {
        permissionsToInsert.push({
          role_id: roleId,
          resource_id: resourceId,
          permission: perm.permission,
        })
      }
    }
  }

  const { error: permError } = await supabase
    .from('role_permissions')
    .upsert(permissionsToInsert, { onConflict: 'role_id,resource_id,permission', ignoreDuplicates: true })

  if (permError) {
    console.error('Error creating role permissions:', permError)
  } else {
    console.log(`Created ${permissionsToInsert.length} role permissions`)
  }

  // 6. Create Sold-Tos for each organization
  console.log('Creating sold-to accounts...')
  const soldTosToInsert: any[] = []
  const orgsList = Array.from(orgMap.entries())

  for (const [extId, orgId] of orgsList) {
    // 1-3 sold-tos per organization
    const numSoldTos = Math.floor(Math.random() * 3) + 1
    for (let i = 0; i < numSoldTos; i++) {
      soldTosToInsert.push({
        external_id: `ST-${extId.split('-')[2]}-${String(i + 1).padStart(3, '0')}`,
        name: `${organizations.find(o => o.external_id === extId)?.name} - Site ${i + 1}`,
        organization_id: orgId,
        is_primary: i === 0,
        is_default: i === 0,
        status: 'Active',
      })
    }
  }

  const { data: soldTosData, error: soldTosError } = await supabase
    .from('sold_tos')
    .upsert(soldTosToInsert, { onConflict: 'external_id' })
    .select()

  if (soldTosError) {
    console.error('Error creating sold-tos:', soldTosError)
    return
  }
  console.log(`Created ${soldTosData?.length} sold-to accounts`)

  // 7. Create Sales Areas for each Sold-To
  console.log('Creating sales areas...')
  const salesAreasToInsert: any[] = []
  for (const soldTo of soldTosData || []) {
    // 1-4 sales areas per sold-to
    const numAreas = Math.floor(Math.random() * 4) + 1
    const selectedOrgs = salesOrgs.slice(0, numAreas)
    
    for (const salesOrg of selectedOrgs) {
      salesAreasToInsert.push({
        sold_to_id: soldTo.id,
        sales_org: salesOrg,
        currency: currencies[salesOrg as keyof typeof currencies],
        distribution_channel: '10',
        division: '00',
        sales_area_code: `${salesOrg}-10-00`,
      })
    }
  }

  const { error: salesAreasError } = await supabase
    .from('sales_areas')
    .upsert(salesAreasToInsert, { onConflict: 'sold_to_id,sales_area_code', ignoreDuplicates: true })

  if (salesAreasError) {
    console.error('Error creating sales areas:', salesAreasError)
  } else {
    console.log(`Created ${salesAreasToInsert.length} sales areas`)
  }

  // 8. Create 100+ Users
  console.log('Creating users...')
  const usersToInsert: any[] = []
  const userOrgAssignments: any[] = []
  const userRoleAssignments: any[] = []
  const userSoldToAssignments: any[] = []
  const userToolAccess: any[] = []

  // Create special admin user
  usersToInsert.push({
    email: 'admin@honeywell.com',
    okta_id: 'okta-admin-001',
    hon_id: 'HON-ADMIN-001',
    first_name: 'System',
    last_name: 'Administrator',
    phone: '+1-555-000-0001',
    is_super_user: true,
    status: 'Active',
  })

  // Generate 120 users across organizations
  let userIndex = 0
  for (const [extId, orgId] of orgsList) {
    // 6-10 users per organization
    const numUsers = Math.floor(Math.random() * 5) + 6
    
    for (let i = 0; i < numUsers; i++) {
      userIndex++
      const firstName = firstNames[userIndex % firstNames.length]
      const lastName = lastNames[(userIndex * 7) % lastNames.length]
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${userIndex}@${extId.toLowerCase().replace('org-', '').replace(/-\d+$/, '')}.com`
      
      usersToInsert.push({
        email,
        okta_id: `okta-user-${String(userIndex).padStart(4, '0')}`,
        hon_id: `HON-USER-${String(userIndex).padStart(4, '0')}`,
        first_name: firstName,
        last_name: lastName,
        phone: `+1-555-${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        is_super_user: false,
        status: Math.random() > 0.1 ? 'Active' : 'Inactive',
      })
    }
  }

  const { data: usersData, error: usersError } = await supabase
    .from('users')
    .upsert(usersToInsert, { onConflict: 'email' })
    .select()

  if (usersError) {
    console.error('Error creating users:', usersError)
    return
  }
  console.log(`Created ${usersData?.length} users`)

  // 9. Assign users to organizations and roles
  console.log('Assigning users to organizations and roles...')
  const allUsers = usersData || []
  const roleNames = ['Buyer', 'Approver', 'Viewer', 'QuoteManager', 'OrderManager', 'InventoryViewer', 'PriceViewer', 'OrgAdmin']
  const allSoldTos = soldTosData || []
  const allTools = toolsData || []

  // Admin user assignments
  const adminUser = allUsers.find(u => u.email === 'admin@honeywell.com')
  if (adminUser) {
    const internalOrg = allOrgs?.find(o => o.type === 'Internal')
    if (internalOrg) {
      userOrgAssignments.push({
        user_id: adminUser.id,
        organization_id: internalOrg.id,
        is_primary: true,
        persona: 'Administrator',
        portal_status: 'Active',
      })

      userRoleAssignments.push({
        user_id: adminUser.id,
        role_id: roleMap.get('SuperAdmin'),
        organization_id: internalOrg.id,
      })
    }
  }

  // Assign other users
  let orgIndex = 0
  for (const user of allUsers.filter(u => !u.is_super_user)) {
    const orgId = Array.from(orgMap.values())[orgIndex % orgMap.size]
    
    // Primary organization
    userOrgAssignments.push({
      user_id: user.id,
      organization_id: orgId,
      is_primary: true,
      persona: roleNames[Math.floor(Math.random() * roleNames.length)],
      portal_status: 'Active',
    })

    // 20% of users have secondary org
    if (Math.random() < 0.2) {
      const secondaryOrgId = Array.from(orgMap.values())[(orgIndex + 1) % orgMap.size]
      if (secondaryOrgId !== orgId) {
        userOrgAssignments.push({
          user_id: user.id,
          organization_id: secondaryOrgId,
          is_primary: false,
          persona: 'Viewer',
          portal_status: 'Active',
        })
      }
    }

    // Assign 1-3 roles
    const numRoles = Math.floor(Math.random() * 3) + 1
    const shuffledRoles = [...roleNames].sort(() => Math.random() - 0.5)
    for (let r = 0; r < numRoles; r++) {
      userRoleAssignments.push({
        user_id: user.id,
        role_id: roleMap.get(shuffledRoles[r]),
        organization_id: orgId,
      })
    }

    // Assign sold-tos
    const orgSoldTos = allSoldTos.filter(st => st.organization_id === orgId)
    for (const soldTo of orgSoldTos) {
      userSoldToAssignments.push({
        user_id: user.id,
        sold_to_id: soldTo.id,
        is_default: soldTo.is_primary,
      })
    }

    // Assign tool access (3-7 tools)
    const numTools = Math.floor(Math.random() * 5) + 3
    const shuffledTools = [...allTools].sort(() => Math.random() - 0.5)
    for (let t = 0; t < Math.min(numTools, shuffledTools.length); t++) {
      userToolAccess.push({
        user_id: user.id,
        tool_id: shuffledTools[t].id,
        organization_id: orgId,
        status: shuffledTools[t].requires_approval ? (Math.random() > 0.3 ? 'Approved' : 'Pending') : 'Approved',
        requested_date: new Date().toISOString(),
        granted_date: shuffledTools[t].requires_approval ? (Math.random() > 0.3 ? new Date().toISOString() : null) : new Date().toISOString(),
      })
    }

    orgIndex++
  }

  // Insert assignments
  const { error: orgAssignError } = await supabase
    .from('user_organizations')
    .upsert(userOrgAssignments, { onConflict: 'user_id,organization_id', ignoreDuplicates: true })
  if (orgAssignError) console.error('Error assigning orgs:', orgAssignError)
  else console.log(`Assigned ${userOrgAssignments.length} user-org relationships`)

  const { error: roleAssignError } = await supabase
    .from('user_roles')
    .upsert(userRoleAssignments, { onConflict: 'user_id,role_id,organization_id', ignoreDuplicates: true })
  if (roleAssignError) console.error('Error assigning roles:', roleAssignError)
  else console.log(`Assigned ${userRoleAssignments.length} user-role relationships`)

  const { error: soldToAssignError } = await supabase
    .from('user_sold_tos')
    .upsert(userSoldToAssignments, { onConflict: 'user_id,sold_to_id', ignoreDuplicates: true })
  if (soldToAssignError) console.error('Error assigning sold-tos:', soldToAssignError)
  else console.log(`Assigned ${userSoldToAssignments.length} user-sold-to relationships`)

  const { error: toolAccessError } = await supabase
    .from('tool_access')
    .upsert(userToolAccess, { onConflict: 'user_id,tool_id,organization_id', ignoreDuplicates: true })
  if (toolAccessError) console.error('Error assigning tools:', toolAccessError)
  else console.log(`Assigned ${userToolAccess.length} tool access records`)

  console.log('\nSeed completed successfully!')
  console.log('Summary:')
  console.log(`- ${organizations.length} organizations`)
  console.log(`- ${roles.length} roles`)
  console.log(`- ${tools.length} tools`)
  console.log(`- ${resources.length} resources`)
  console.log(`- ${usersToInsert.length} users`)
}

seed().catch(console.error)
