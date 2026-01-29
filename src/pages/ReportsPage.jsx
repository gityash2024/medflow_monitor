import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Eye, Download } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mockReports } from '@/mock/mockReports'

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredReports = useMemo(() => {
    return mockReports.filter((report) => {
      return (
        report.studyUID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.patientID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.reportFilename.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
  }, [searchQuery])

  const getModalityColor = (modality) => {
    const colors = {
      CT: 'default',
      MR: 'secondary',
      XR: 'success',
      US: 'warning',
      NM: 'accent',
      PT: 'outline',
    }
    return colors[modality] || 'outline'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">View and download generated reports</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredReports.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No reports found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="flex items-center justify-between rounded-lg border border-black/10 dark:border-white/20 bg-card/30 backdrop-blur-sm p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <Badge variant={getModalityColor(report.modality)}>
                      {report.modality}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{report.reportFilename}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        Study: {report.studyUID}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Patient ID: {report.patientID}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {report.generated}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}


