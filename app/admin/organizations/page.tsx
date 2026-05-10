import { createClient } from "@/lib/supabase/server"
import { SearchMd, Plus, ChevronRight, Building07 } from "@untitledui/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

async function getOrganizations() {
  const supabase = await createClient()
  
  const { data: orgs, error } = await supabase
    .from("organizations")
    .select(`
      *,
      sold_tos (
        id,
        name,
        external_id
      ),
      user_organizations (
        id
      )
    `)
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching organizations:", error)
    return []
  }

  return orgs ?? []
}

function getTypeColor(type: string) {
  switch (type) {
    case "Distributor":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "Partner":
      return "bg-violet-50 text-violet-700 border-violet-200"
    case "Customer":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "Internal":
      return "bg-amber-50 text-amber-700 border-amber-200"
    default:
      return "bg-gray-50 text-gray-700 border-gray-200"
  }
}

export default async function OrganizationsPage() {
  const organizations = await getOrganizations()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Organizations
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage organizations, sold-to accounts, and sales areas
          </p>
        </div>
        <Button className="gap-2 w-fit">
          <Plus className="size-4" />
          Add Organization
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <SearchMd className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input 
          placeholder="Search organizations..." 
          className="pl-9"
        />
      </div>

      {/* Organizations Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {organizations.map((org) => (
          <Link key={org.id} href={`/admin/organizations/${org.id}`}>
            <Card className="hover:border-primary/30 hover:shadow-md transition-all cursor-pointer h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Building07 className="size-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-medium">
                        {org.name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground font-mono">
                        {org.external_id}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge 
                    variant="outline" 
                    className={`${getTypeColor(org.type)} text-[10px]`}
                  >
                    {org.type}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`text-[10px] ${org.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-50 text-gray-700 border-gray-200"}`}
                  >
                    {org.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{org.user_organizations?.length ?? 0} users</span>
                  <span>{org.sold_tos?.length ?? 0} sold-tos</span>
                </div>
                {org.line_of_business?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {org.line_of_business.slice(0, 2).map((lob: string) => (
                      <Badge key={lob} variant="secondary" className="text-[9px]">
                        {lob}
                      </Badge>
                    ))}
                    {org.line_of_business.length > 2 && (
                      <Badge variant="outline" className="text-[9px]">
                        +{org.line_of_business.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
