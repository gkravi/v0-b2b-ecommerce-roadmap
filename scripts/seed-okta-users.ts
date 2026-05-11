/**
 * Seed Okta Users Script
 * 
 * This script creates users in Okta that match the users in the Supabase database.
 * 
 * Prerequisites:
 * 1. Create an API token in Okta Admin Console:
 *    - Go to Security → API → Tokens
 *    - Click "Create Token"
 *    - Copy the token value
 * 
 * 2. Set environment variables:
 *    - OKTA_DOMAIN=trial-1074223.okta.com
 *    - OKTA_API_TOKEN=your_api_token_here
 * 
 * Usage:
 *    npx tsx scripts/seed-okta-users.ts
 */

// Clean up domain - remove -admin suffix if present, ensure no protocol
let OKTA_DOMAIN = process.env.OKTA_DOMAIN || 'trial-1074223.okta.com'
OKTA_DOMAIN = OKTA_DOMAIN.replace('https://', '').replace('http://', '').replace('-admin', '').replace(/\/$/, '')
const OKTA_API_TOKEN = process.env.OKTA_API_TOKEN

if (!OKTA_API_TOKEN) {
  console.error('❌ OKTA_API_TOKEN environment variable is required')
  console.log('')
  console.log('To create an API token:')
  console.log('1. Go to https://trial-1074223-admin.okta.com/admin/access/api/tokens')
  console.log('2. Click "Create Token"')
  console.log('3. Give it a name like "User Seed Script"')
  console.log('4. Copy the token and set it as OKTA_API_TOKEN')
  console.log('')
  console.log('Then run:')
  console.log('OKTA_API_TOKEN=your_token npx tsx scripts/seed-okta-users.ts')
  process.exit(1)
}

const OKTA_BASE_URL = `https://${OKTA_DOMAIN}/api/v1`

// Users to create in Okta (matching Supabase database)
const users = [
  // Super Admins (Honeywell Internal)
  {
    profile: {
      firstName: 'System',
      lastName: 'Administrator',
      email: 'admin.super@honeywell.com',
      login: 'admin.super@honeywell.com',
      organization: 'Honeywell Internal',
      userType: 'Super Admin'
    },
    credentials: {
      password: { value: 'Honeywell@2024!' }
    }
  },
  {
    profile: {
      firstName: 'Support',
      lastName: 'Agent',
      email: 'support.agent@honeywell.com',
      login: 'support.agent@honeywell.com',
      organization: 'Honeywell Internal',
      userType: 'Support Agent'
    },
    credentials: {
      password: { value: 'Honeywell@2024!' }
    }
  },
  
  // BlueRock Holdings users
  {
    profile: {
      firstName: 'Miguel',
      lastName: 'Patel',
      email: 'miguel.patel1@example.com',
      login: 'miguel.patel1@example.com',
      organization: 'BlueRock Holdings',
      userType: 'Buyer'
    },
    credentials: {
      password: { value: 'BlueRock@2024!' }
    }
  },
  {
    profile: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson2@example.com',
      login: 'sarah.johnson2@example.com',
      organization: 'BlueRock Holdings',
      userType: 'Org Admin'
    },
    credentials: {
      password: { value: 'BlueRock@2024!' }
    }
  },
  {
    profile: {
      firstName: 'James',
      lastName: 'Chen',
      email: 'james.chen3@example.com',
      login: 'james.chen3@example.com',
      organization: 'BlueRock Holdings',
      userType: 'Viewer'
    },
    credentials: {
      password: { value: 'BlueRock@2024!' }
    }
  },
  
  // Summit Distribution users
  {
    profile: {
      firstName: 'Emma',
      lastName: 'Williams',
      email: 'emma.williams4@example.com',
      login: 'emma.williams4@example.com',
      organization: 'Summit Distribution',
      userType: 'Buyer'
    },
    credentials: {
      password: { value: 'Summit@2024!' }
    }
  },
  {
    profile: {
      firstName: 'David',
      lastName: 'Garcia',
      email: 'david.garcia5@example.com',
      login: 'david.garcia5@example.com',
      organization: 'Summit Distribution',
      userType: 'Org Admin'
    },
    credentials: {
      password: { value: 'Summit@2024!' }
    }
  },
  {
    profile: {
      firstName: 'Olivia',
      lastName: 'Martinez',
      email: 'olivia.martinez6@example.com',
      login: 'olivia.martinez6@example.com',
      organization: 'Summit Distribution',
      userType: 'Viewer'
    },
    credentials: {
      password: { value: 'Summit@2024!' }
    }
  },
  
  // Pacific Partners LLC users
  {
    profile: {
      firstName: 'William',
      lastName: 'Brown',
      email: 'william.brown7@example.com',
      login: 'william.brown7@example.com',
      organization: 'Pacific Partners LLC',
      userType: 'Buyer'
    },
    credentials: {
      password: { value: 'Pacific@2024!' }
    }
  },
  {
    profile: {
      firstName: 'Sophia',
      lastName: 'Davis',
      email: 'sophia.davis8@example.com',
      login: 'sophia.davis8@example.com',
      organization: 'Pacific Partners LLC',
      userType: 'Org Admin'
    },
    credentials: {
      password: { value: 'Pacific@2024!' }
    }
  },
  
  // Northern Electric Co users
  {
    profile: {
      firstName: 'Alexander',
      lastName: 'Wilson',
      email: 'alexander.wilson9@example.com',
      login: 'alexander.wilson9@example.com',
      organization: 'Northern Electric Co',
      userType: 'Buyer'
    },
    credentials: {
      password: { value: 'Northern@2024!' }
    }
  },
  {
    profile: {
      firstName: 'Isabella',
      lastName: 'Moore',
      email: 'isabella.moore10@example.com',
      login: 'isabella.moore10@example.com',
      organization: 'Northern Electric Co',
      userType: 'Org Admin'
    },
    credentials: {
      password: { value: 'Northern@2024!' }
    }
  },
  {
    profile: {
      firstName: 'Michael',
      lastName: 'Taylor',
      email: 'michael.taylor11@example.com',
      login: 'michael.taylor11@example.com',
      organization: 'Northern Electric Co',
      userType: 'Viewer'
    },
    credentials: {
      password: { value: 'Northern@2024!' }
    }
  },
  
  // Midwest Safety Systems users
  {
    profile: {
      firstName: 'Charlotte',
      lastName: 'Anderson',
      email: 'charlotte.anderson12@example.com',
      login: 'charlotte.anderson12@example.com',
      organization: 'Midwest Safety Systems',
      userType: 'Buyer'
    },
    credentials: {
      password: { value: 'Midwest@2024!' }
    }
  },
  {
    profile: {
      firstName: 'Daniel',
      lastName: 'Thomas',
      email: 'daniel.thomas13@example.com',
      login: 'daniel.thomas13@example.com',
      organization: 'Midwest Safety Systems',
      userType: 'Viewer'
    },
    credentials: {
      password: { value: 'Midwest@2024!' }
    }
  },
  
  // Atlantic Security Group users
  {
    profile: {
      firstName: 'Amelia',
      lastName: 'Jackson',
      email: 'amelia.jackson14@example.com',
      login: 'amelia.jackson14@example.com',
      organization: 'Atlantic Security Group',
      userType: 'Buyer'
    },
    credentials: {
      password: { value: 'Atlantic@2024!' }
    }
  },
  {
    profile: {
      firstName: 'Matthew',
      lastName: 'White',
      email: 'matthew.white15@example.com',
      login: 'matthew.white15@example.com',
      organization: 'Atlantic Security Group',
      userType: 'Org Admin'
    },
    credentials: {
      password: { value: 'Atlantic@2024!' }
    }
  },
]

async function createUser(user: typeof users[0]): Promise<{ success: boolean; email: string; error?: string }> {
  try {
    const response = await fetch(`${OKTA_BASE_URL}/users?activate=true`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `SSWS ${OKTA_API_TOKEN}`
      },
      body: JSON.stringify(user)
    })

    if (response.ok) {
      return { success: true, email: user.profile.email }
    }

    const error = await response.json()
    
    // Check if user already exists
    if (error.errorCode === 'E0000001' && error.errorCauses?.[0]?.errorSummary?.includes('already exists')) {
      return { success: true, email: user.profile.email, error: 'Already exists' }
    }

    return { 
      success: false, 
      email: user.profile.email, 
      error: error.errorSummary || error.errorCauses?.[0]?.errorSummary || 'Unknown error'
    }
  } catch (err) {
    return { 
      success: false, 
      email: user.profile.email, 
      error: err instanceof Error ? err.message : 'Network error'
    }
  }
}

async function assignUserToApp(userId: string, appId: string): Promise<boolean> {
  try {
    const response = await fetch(`${OKTA_BASE_URL}/apps/${appId}/users`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `SSWS ${OKTA_API_TOKEN}`
      },
      body: JSON.stringify({ id: userId })
    })
    return response.ok
  } catch {
    return false
  }
}

async function main() {
  console.log('🚀 Starting Okta User Seed Script')
  console.log(`📡 Okta Domain: ${OKTA_DOMAIN}`)
  console.log(`📡 API Base URL: ${OKTA_BASE_URL}`)
  console.log('')

  let successCount = 0
  let skipCount = 0
  let errorCount = 0

  for (const user of users) {
    const result = await createUser(user)
    
    if (result.success) {
      if (result.error === 'Already exists') {
        console.log(`⏭️  ${result.email} - Already exists (skipped)`)
        skipCount++
      } else {
        console.log(`✅ ${result.email} - Created successfully`)
        successCount++
      }
    } else {
      console.log(`❌ ${result.email} - Failed: ${result.error}`)
      errorCount++
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200))
  }

  console.log('')
  console.log('📊 Summary:')
  console.log(`   ✅ Created: ${successCount}`)
  console.log(`   ⏭️  Skipped: ${skipCount}`)
  console.log(`   ❌ Failed: ${errorCount}`)
  console.log('')
  
  if (successCount > 0 || skipCount > 0) {
    console.log('🔐 Test Credentials:')
    console.log('')
    console.log('   Super Admin:')
    console.log('   Email: admin.super@honeywell.com')
    console.log('   Password: Honeywell@2024!')
    console.log('')
    console.log('   Buyer (BlueRock):')
    console.log('   Email: miguel.patel1@example.com')
    console.log('   Password: BlueRock@2024!')
    console.log('')
    console.log('   Org Admin (Summit):')
    console.log('   Email: david.garcia5@example.com')
    console.log('   Password: Summit@2024!')
  }
}

main().catch(console.error)
