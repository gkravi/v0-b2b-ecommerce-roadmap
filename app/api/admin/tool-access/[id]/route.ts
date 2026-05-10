import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET - Get specific tool access request
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("tool_access")
      .select(`
        *,
        users:user_id(id, email, first_name, last_name),
        tools:tool_id(id, name, master_tool_id, description),
        organizations:organization_id(id, name)
      `)
      .eq("id", id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("[v0] Error fetching tool access:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH - Update tool access (approve/reject/revoke)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()
    
    const { action, approvedBy, reason } = body

    if (!["approve", "reject", "revoke"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'approve', 'reject', or 'revoke'" },
        { status: 400 }
      )
    }

    // Get current record
    const { data: current, error: fetchError } = await supabase
      .from("tool_access")
      .select("*, users:user_id(email), tools:tool_id(name)")
      .eq("id", id)
      .single()

    if (fetchError || !current) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 })
    }

    // Build update based on action
    const updates: Record<string, any> = {}
    let newStatus: string

    switch (action) {
      case "approve":
        newStatus = "Approved"
        updates.status = newStatus
        updates.approved_by = approvedBy
        updates.granted_date = new Date().toISOString()
        break
      case "reject":
        newStatus = "Rejected"
        updates.status = newStatus
        updates.approved_by = approvedBy
        break
      case "revoke":
        newStatus = "Revoked"
        updates.status = newStatus
        updates.revoked_date = new Date().toISOString()
        break
      default:
        newStatus = current.status
    }

    // Update the record
    const { data, error } = await supabase
      .from("tool_access")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log the action
    await supabase.from("authorization_logs").insert({
      user_id: current.user_id,
      action: `tool_access_${action}d`,
      resource: current.tool_id,
      decision: action === "approve" ? "allow" : "deny",
      context: {
        toolId: current.tool_id,
        toolName: current.tools?.name,
        previousStatus: current.status,
        newStatus,
        approvedBy,
        reason,
      },
    })

    return NextResponse.json({ 
      data,
      message: `Tool access ${action}d successfully` 
    })
  } catch (error) {
    console.error("[v0] Error updating tool access:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete tool access request
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { error } = await supabase
      .from("tool_access")
      .delete()
      .eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Tool access deleted successfully" })
  } catch (error) {
    console.error("[v0] Error deleting tool access:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
