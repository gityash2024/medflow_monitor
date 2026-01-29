import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

const mockSettings = {
  general: {
    siteName: 'DICOM Pipeline Monitor',
    timezone: 'UTC',
    language: 'English',
  },
  pipeline: {
    autoRetry: true,
    maxRetries: 3,
    retryDelay: 300,
    xnatServer: 'https://xnat.hospital.local',
  },
  notifications: {
    emailNotifications: true,
    slackNotifications: false,
    notifyOnFailure: true,
    notifyOnCompletion: false,
  },
  security: {
    sessionTimeout: 3600,
    requireMFA: false,
    allowedIPs: '192.168.0.0/16',
  },
}

export default function SettingsPage() {
  const [settings, setSettings] = useState(mockSettings)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success('Settings saved successfully')
    }, 1000)
  }

  const updateSetting = (category, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
        <p className="text-sm md:text-base text-muted-foreground">Configure system settings and preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="w-full flex overflow-x-auto">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline Configuration</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.general.siteName}
                  onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                  id="timezone"
                  value={settings.general.timezone}
                  onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Input
                  id="language"
                  value={settings.general.language}
                  onChange={(e) => updateSetting('general', 'language', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5 flex-1">
                  <Label>Auto Retry Failed Studies</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Automatically retry failed studies
                  </p>
                </div>
                <Switch
                  checked={settings.pipeline.autoRetry}
                  onCheckedChange={(checked) => updateSetting('pipeline', 'autoRetry', checked)}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="maxRetries">Max Retries</Label>
                <Input
                  id="maxRetries"
                  type="number"
                  value={settings.pipeline.maxRetries}
                  onChange={(e) => updateSetting('pipeline', 'maxRetries', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="retryDelay">Retry Delay (seconds)</Label>
                <Input
                  id="retryDelay"
                  type="number"
                  value={settings.pipeline.retryDelay}
                  onChange={(e) => updateSetting('pipeline', 'retryDelay', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="xnatServer">XNAT Server URL</Label>
                <Input
                  id="xnatServer"
                  value={settings.pipeline.xnatServer}
                  onChange={(e) => updateSetting('pipeline', 'xnatServer', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5 flex-1">
                  <Label>Email Notifications</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Send email notifications for important events
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.emailNotifications}
                  onCheckedChange={(checked) => updateSetting('notifications', 'emailNotifications', checked)}
                />
              </div>
              <Separator />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5 flex-1">
                  <Label>Slack Notifications</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Send notifications to Slack
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.slackNotifications}
                  onCheckedChange={(checked) => updateSetting('notifications', 'slackNotifications', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notify on Failure</Label>
                  <p className="text-sm text-muted-foreground">
                    Send notification when a study fails
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.notifyOnFailure}
                  onCheckedChange={(checked) => updateSetting('notifications', 'notifyOnFailure', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notify on Completion</Label>
                  <p className="text-sm text-muted-foreground">
                    Send notification when a study completes
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.notifyOnCompletion}
                  onCheckedChange={(checked) => updateSetting('notifications', 'notifyOnCompletion', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (seconds)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require MFA</Label>
                  <p className="text-sm text-muted-foreground">
                    Require multi-factor authentication
                  </p>
                </div>
                <Switch
                  checked={settings.security.requireMFA}
                  onCheckedChange={(checked) => updateSetting('security', 'requireMFA', checked)}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="allowedIPs">Allowed IP Ranges</Label>
                <Input
                  id="allowedIPs"
                  value={settings.security.allowedIPs}
                  onChange={(e) => updateSetting('security', 'allowedIPs', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="sticky bottom-0 flex justify-end border-t border-border bg-background p-3 md:p-4">
        <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </motion.div>
  )
}



