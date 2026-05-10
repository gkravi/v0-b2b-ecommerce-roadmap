"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft, Upload, FileText, Check, X, AlertTriangle, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ImportUser {
  email: string
  firstName: string
  lastName: string
  organization: string
  role: string
  status: "pending" | "valid" | "error"
  errorMessage?: string
}

const sampleCSV = `email,firstName,lastName,organization,role
john.doe@example.com,John,Doe,ACME Industries,Buyer
jane.smith@example.com,Jane,Smith,Global Tech Solutions,Admin
bob.wilson@example.com,Bob,Wilson,Premium Distribution,Approver`

export default function BulkImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [users, setUsers] = useState<ImportUser[]>([])
  const [isValidating, setIsValidating] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importResult, setImportResult] = useState<{ success: number; failed: number } | null>(null)

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0]
    if (!uploadedFile) return

    setFile(uploadedFile)
    setIsValidating(true)
    setImportResult(null)

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const lines = text.split("\n").filter(line => line.trim())
      const headers = lines[0].split(",").map(h => h.trim().toLowerCase())

      const parsedUsers: ImportUser[] = lines.slice(1).map(line => {
        const values = line.split(",").map(v => v.trim())
        const user: ImportUser = {
          email: values[headers.indexOf("email")] || "",
          firstName: values[headers.indexOf("firstname")] || "",
          lastName: values[headers.indexOf("lastname")] || "",
          organization: values[headers.indexOf("organization")] || "",
          role: values[headers.indexOf("role")] || "",
          status: "pending",
        }

        // Validate
        if (!user.email || !user.email.includes("@")) {
          user.status = "error"
          user.errorMessage = "Invalid email address"
        } else if (!user.firstName || !user.lastName) {
          user.status = "error"
          user.errorMessage = "First and last name required"
        } else if (!user.organization) {
          user.status = "error"
          user.errorMessage = "Organization required"
        } else {
          user.status = "valid"
        }

        return user
      })

      setUsers(parsedUsers)
      setIsValidating(false)
    }
    reader.readAsText(uploadedFile)
  }, [])

  const handleImport = async () => {
    const validUsers = users.filter(u => u.status === "valid")
    if (validUsers.length === 0) return

    setIsImporting(true)
    setImportProgress(0)

    let success = 0
    let failed = 0

    for (let i = 0; i < validUsers.length; i++) {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // In production, this would call an API endpoint
      const isSuccess = Math.random() > 0.1 // 90% success rate for demo
      if (isSuccess) {
        success++
      } else {
        failed++
      }

      setImportProgress(Math.round(((i + 1) / validUsers.length) * 100))
    }

    setImportResult({ success, failed })
    setIsImporting(false)
  }

  const downloadTemplate = () => {
    const blob = new Blob([sampleCSV], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "user_import_template.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const validCount = users.filter(u => u.status === "valid").length
  const errorCount = users.filter(u => u.status === "error").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/users">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bulk Import Users</h1>
          <p className="text-sm text-muted-foreground">
            Import multiple users from a CSV file
          </p>
        </div>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upload">Upload CSV</TabsTrigger>
          <TabsTrigger value="template">Template & Instructions</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          {/* Upload Area */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload CSV File</CardTitle>
              <CardDescription>
                Select a CSV file with user data. The file should include email, firstName, lastName, organization, and role columns.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="flex flex-col items-center gap-4 cursor-pointer"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                    <Upload className="size-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {file ? file.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      CSV files only, max 10MB
                    </p>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Validation Results */}
          {users.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Validation Results</CardTitle>
                    <CardDescription>
                      {users.length} users found in file
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="gap-1">
                      <Check className="size-3" />
                      {validCount} valid
                    </Badge>
                    {errorCount > 0 && (
                      <Badge variant="destructive" className="gap-1">
                        <X className="size-3" />
                        {errorCount} errors
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isValidating ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                      <p className="mt-2 text-sm text-muted-foreground">Validating users...</p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Status</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Organization</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Error</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.slice(0, 10).map((user, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              {user.status === "valid" ? (
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">
                                  <Check className="size-3" />
                                </div>
                              ) : (
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600">
                                  <X className="size-3" />
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="font-mono text-xs">{user.email}</TableCell>
                            <TableCell>{user.firstName} {user.lastName}</TableCell>
                            <TableCell>{user.organization}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{user.role}</Badge>
                            </TableCell>
                            <TableCell className="text-destructive text-xs">
                              {user.errorMessage}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {users.length > 10 && (
                      <div className="p-4 border-t text-center text-sm text-muted-foreground">
                        Showing 10 of {users.length} users
                      </div>
                    )}
                  </div>
                )}

                {/* Import Progress */}
                {isImporting && (
                  <div className="mt-4 space-y-2">
                    <Progress value={importProgress} />
                    <p className="text-sm text-muted-foreground text-center">
                      Importing users... {importProgress}%
                    </p>
                  </div>
                )}

                {/* Import Result */}
                {importResult && (
                  <div className="mt-4 rounded-lg bg-secondary/50 p-4">
                    <div className="flex items-center gap-2">
                      <Check className="size-5 text-green-600" />
                      <span className="font-medium">Import Complete</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {importResult.success} users imported successfully
                      {importResult.failed > 0 && `, ${importResult.failed} failed`}
                    </p>
                  </div>
                )}

                {/* Actions */}
                {!isImporting && !importResult && validCount > 0 && (
                  <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setUsers([])}>
                      Cancel
                    </Button>
                    <Button onClick={handleImport}>
                      Import {validCount} Users
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="template" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">CSV Template</CardTitle>
              <CardDescription>
                Download and use this template for bulk user imports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="gap-2" onClick={downloadTemplate}>
                <Download className="size-4" />
                Download Template
              </Button>

              <div className="rounded-lg border bg-secondary/30 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="size-4 text-muted-foreground" />
                  <span className="font-medium text-sm">Required Columns</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                  <li><code className="bg-secondary px-1 rounded">email</code> - User email address (required)</li>
                  <li><code className="bg-secondary px-1 rounded">firstName</code> - First name (required)</li>
                  <li><code className="bg-secondary px-1 rounded">lastName</code> - Last name (required)</li>
                  <li><code className="bg-secondary px-1 rounded">organization</code> - Organization name (required)</li>
                  <li><code className="bg-secondary px-1 rounded">role</code> - Role name (optional, defaults to Viewer)</li>
                </ul>
              </div>

              <div className="rounded-lg border bg-amber-500/10 border-amber-500/20 p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="size-4 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-amber-900">Important Notes</p>
                    <ul className="text-sm text-amber-800/80 space-y-1 mt-1 list-disc ml-4">
                      <li>Organization must exist in the system before importing users</li>
                      <li>Duplicate emails will be skipped</li>
                      <li>Users will receive an email invitation to set their password</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
