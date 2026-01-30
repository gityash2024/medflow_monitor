import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, LogIn, LogOut, Eye, ExternalLink, Download, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Copy } from 'lucide-react'
import { toast } from 'sonner'
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
import { Button } from '@/components/ui/button' // Added import
import { DataLoader } from '@/components/ui/DataLoader'
import { mockAuditLogs } from '@/mock/mockAuditLogs'
import { AUDIT_ACTIONS } from '@/utils/constants'

// Styles for the modern table
const tableStyles = {
  header: "text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-4",
  cell: "py-3 px-4 text-sm border-b border-border/50",
  row: "hover:bg-muted/50 transition-colors"
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
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [actionFilter, setActionFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Initial loading delay for mock data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

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

  // Pagination logic
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleCopyIP = async (ipAddress) => {
    try {
      await navigator.clipboard.writeText(ipAddress)
      toast.success(`IP address ${ipAddress} copied to clipboard`)
    } catch (err) {
      toast.error('Failed to copy IP address')
    }
  }

  // Show loader while loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <DataLoader message="Loading audit logs..." />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Audit Logs</h1>
        <p className="text-sm md:text-base text-muted-foreground">Monitor user activities and system events</p>
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
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1) // Reset to page 1 on search
                }}
              />
            </div>
            <Select value={actionFilter} onValueChange={(val) => {
              setActionFilter(val)
              setCurrentPage(1) // Reset to page 1 on filter
            }}>
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
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>System Activity</CardTitle>
            <div className="text-sm text-muted-foreground">
              Showing {paginatedLogs.length} of {filteredLogs.length} events
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className={tableStyles.header}>User</th>
                  <th className={tableStyles.header}>Action</th>
                  <th className={tableStyles.header}>Resource</th>
                  <th className={tableStyles.header}>IP Address</th>
                  <th className={tableStyles.header}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-muted-foreground">
                      No logs found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedLogs.map((log, index) => (
                    <motion.tr
                      key={log.id}
                      className={tableStyles.row}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className={tableStyles.cell}>
                        <div className="font-medium">{log.user}</div>
                      </td>
                      <td className={tableStyles.cell}>
                        <Badge variant={getActionColor(log.action)} className="font-normal text-xs">
                          {log.action}
                        </Badge>
                      </td>
                      <td className={tableStyles.cell}>
                        <span className="text-muted-foreground font-mono text-xs">{log.resource || '-'}</span>
                      </td>
                      <td className={tableStyles.cell}>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs">{log.ip}</span>
                          <button
                            onClick={() => handleCopyIP(log.ip)}
                            className="p-1 hover:bg-muted/50 rounded transition-colors cursor-pointer"
                            title="Copy IP address"
                          >
                            <Copy className="h-3.5 w-3.5" style={{ color: '#be5b6f' }} />
                          </button>
                        </div>
                      </td>
                      <td className={tableStyles.cell}>
                        <span className="text-muted-foreground text-xs whitespace-nowrap">{log.timestamp}</span>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-4 border-t border-border">
              <div className="flex-1 text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Simple logic: show current page num */}
                <Button variant="ghost" size="sm" className="h-8 pointer-events-none">
                  {currentPage}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
