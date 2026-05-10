import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET - List users with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search")
    const status = searchParams.get("status")
    const organizationId = searchParams.get("organizationId")

    const offset = (page - 1) * limit

    let query = supabase
      .from("users")
      .select(`
        *,
        user_organizations(
          organization_id,
          is_primary,
          organizations(id, name)
        ),
        user_roles(
          role_id,
          roles(id, name)
        )
      `, { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (search) {
      query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`)
    }
    if (status) {
      query = query.eq("status", status)
    }

    const { data, count, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // If filtering by organization, filter in memory (Supabase doesn't support deep joins easily)
    let filteredData = data
    if (organizationId && data) {
      filteredData = data.filter(user => 
        user.user_organizations?.some((uo: any) => uo.organization_id === organizationId)
      )
    }

    return NextResponse.json({
      data: filteredData,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create a new user
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    const { 
      email, 
      firstName, 
      lastName, 
      phone,
      organizationId,
      roleId,
      status = "Pending"
    } = body

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      )
    }

    // Create user
    const { data: user, error: userError } = await supabase
      .from("users")
      .insert({
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
        status,
      })
      .select()
      .single()

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 })
    }

    // Add organization membership if provided
    if (organizationId) {
      await supabase.from("user_organizations").insert({
        user_id: user.id,
        organization_id: organizationId,
        is_primary: true,
      })
    }

    // Add role if provided
    if (roleId) {
      await supabase.from("user_roles").insert({
        user_id: user.id,
        role_id: roleId,
        organization_id: organizationId || null,
      })
    }

    // Log the creation
    await supabase.from("authorization_logs").insert({
      user_id: user.id,
      action: "user_created",
      resource: "users",
      decision: "allow",
      context: { email, organizationId, roleId },
    })

    return NextResponse.json({ data: user }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
