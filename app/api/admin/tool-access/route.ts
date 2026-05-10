import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET - List tool access requests
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const status = searchParams.get("status") // Pending, Approved, Rejected, Revoked
    const userId = searchParams.get("userId")
    const toolId = searchParams.get("toolId")

    let query = supabase
      .from("tool_access")
      .select(`
        *,
        users:user_id(id, email, first_name, last_name),
        tools:tool_id(id, name, master_tool_id),
        organizations:organization_id(id, name)
      `)
      .order("created_at", { ascending: false })

    if (status) {
      query = query.eq("status", status)
    }
    if (userId) {
      query = query.eq("user_id", userId)
    }
    if (toolId) {
      query = query.eq("tool_id", toolId)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("[v0] Error fetching tool access:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Request tool access
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    const { userId, toolId, organizationId, requestedBy } = body

    if (!userId || !toolId) {
      return NextResponse.json(
        { error: "userId and toolId are required" },
        { status: 400 }
      )
    }

    // Check if access already exists
    const { data: existing } = await supabase
      .from("tool_access")
      .select("id, status")
      .eq("user_id", userId)
      .eq("tool_id", toolId)
      .eq("organization_id", organizationId || null)
      .single()

    if (existing) {
      if (existing.status === "Approved") {
        return NextResponse.json(
          { error: "User already has access to this tool" },
          { status: 409 }
        )
      }
      if (existing.status === "Pending") {
        return NextResponse.json(
          { error: "A pending request already exists" },
          { status: 409 }
        )
      }
    }

    // Create new access request
    const { data, error } = await supabase
      .from("tool_access")
      .insert({
        user_id: userId,
        tool_id: toolId,
        organization_id: organizationId || null,
        status: "Pending",
        requested_by: requestedBy || userId,
        requested_date: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log the request
    await supabase.from("authorization_logs").insert({
      user_id: userId,
      action: "tool_access_requested",
      resource: toolId,
      decision: "allow",
      context: { toolId, organizationId, requestedBy },
    })

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating tool access request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
