import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, LogIn, LogOut, Eye, ExternalLink, Download } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { mockAuditLogs } from '@/mock/mockAuditLogs'
import { AUDIT_ACTIONS } from '@/utils/constants'

const getActionIcon = (iconName) => {
  const icons = {
    'log-in': LogIn,
    'log-out': LogOut,
    eye: Eye,
    'external-link': ExternalLink,
    download: Download,
  }
  return icons[iconName] || Eye
}

const getActionColor = (action) => {
  if (action.includes('Login')) return 'success'
  if (action.includes('Logout')) return 'outline'
  if (action.includes('Viewer')) return 'default'
  if (action.includes('Study')) return 'secondary'
  if (action.includes('Report')) return 'accent'
  return 'outline'
}

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [actionFilter, setActionFilter] = useState('all')

  const filteredLogs = useMemo(() => {
    return mockAuditLogs.filter((log) => {
      const matchesSearch =
        log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.resource && log.resource.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesAction =
        actionFilter === 'all' || log.action.toLowerCase().includes(actionFilter.toLowerCase())
      return matchesSearch && matchesAction
    })
  }, [searchQuery, actionFilter])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <p className="text-muted-foreground">Monitor user activities and system events</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user or resource..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {AUDIT_ACTIONS.map((action) => (
                  <SelectItem key={action} value={action.toLowerCase()}>
                    {action}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredLogs.length} of {mockAuditLogs.length} events
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredLogs.map((log, index) => {
              const Icon = getActionIcon(log.icon)
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative flex gap-4"
                >
                  <div className="flex flex-col items-center">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      getActionColor(log.action) === 'success' ? 'bg-success/20' :
                      getActionColor(log.action) === 'default' ? 'bg-primary/20' :
                      getActionColor(log.action) === 'secondary' ? 'bg-secondary/20' :
                      getActionColor(log.action) === 'accent' ? 'bg-accent/20' :
                      'bg-muted/20'
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        getActionColor(log.action) === 'success' ? 'text-success' :
                        getActionColor(log.action) === 'default' ? 'text-primary' :
                        getActionColor(log.action) === 'secondary' ? 'text-secondary' :
                        getActionColor(log.action) === 'accent' ? 'text-accent' :
                        'text-muted-foreground'
                      }`} />
                    </div>
                    {index < filteredLogs.length - 1 && (
                      <div className="mt-2 h-12 w-0.5 bg-border" />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{log.user}</p>
                          <Badge variant={getActionColor(log.action)}>
                            {log.action}
                          </Badge>
                        </div>
                        {log.resource && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            Resource: {log.resource}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-muted-foreground">
                          IP: {log.ip}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {log.timestamp}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

