import { Settings01, Key01, Shield01, Bell01, Database01, Globe02 } from "@untitledui/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          System configuration and integration settings
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Okta Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Key01 className="size-4" />
              Okta Configuration
            </CardTitle>
            <CardDescription>
              Configure Okta SSO integration settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="okta-domain">Okta Domain</Label>
              <Input 
                id="okta-domain" 
                placeholder="your-domain.okta.com" 
                defaultValue={process.env.OKTA_DOMAIN ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="okta-client-id">Client ID</Label>
              <Input 
                id="okta-client-id" 
                placeholder="0oa..." 
                type="password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="okta-client-secret">Client Secret</Label>
              <Input 
                id="okta-client-secret" 
                placeholder="••••••••" 
                type="password"
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Enable Okta SSO</p>
                <p className="text-xs text-muted-foreground">
                  Require Okta authentication for all users
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* FGA Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield01 className="size-4" />
              Fine-Grained Authorization
            </CardTitle>
            <CardDescription>
              Configure FGA model and authorization settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fga-store-id">FGA Store ID</Label>
              <Input 
                id="fga-store-id" 
                placeholder="01H..." 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fga-model-id">Authorization Model ID</Label>
              <Input 
                id="fga-model-id" 
                placeholder="01H..." 
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Enable FGA Checks</p>
                <p className="text-xs text-muted-foreground">
                  Use FGA for all authorization decisions
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Audit All Decisions</p>
                <p className="text-xs text-muted-foreground">
                  Log all authorization checks to audit log
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell01 className="size-4" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure admin notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">New User Registrations</p>
                <p className="text-xs text-muted-foreground">
                  Notify when new users sign up
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Tool Access Requests</p>
                <p className="text-xs text-muted-foreground">
                  Notify when users request tool access
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Authorization Denials</p>
                <p className="text-xs text-muted-foreground">
                  Notify on repeated access denials
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Weekly Summary</p>
                <p className="text-xs text-muted-foreground">
                  Receive weekly access control summary
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Database Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Database01 className="size-4" />
              Data Management
            </CardTitle>
            <CardDescription>
              Database and data retention settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="audit-retention">Audit Log Retention (days)</Label>
              <Input 
                id="audit-retention" 
                type="number"
                defaultValue="90"
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Auto-cleanup Inactive Users</p>
                <p className="text-xs text-muted-foreground">
                  Deactivate users after 90 days of inactivity
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Export User Data</p>
                <p className="text-xs text-muted-foreground">
                  Allow bulk export of user data
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button>Save Settings</Button>
      </div>
    </div>
  )
}
