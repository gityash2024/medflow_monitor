import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Eye, Download, ExternalLink } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataLoader } from '@/components/ui/DataLoader'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { mockReports } from '@/mock/mockReports'
import sampleReportHtml from '@/assets/sample.htm?raw'

export default function ReportsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedReport, setSelectedReport] = useState(null)

  const handleViewReport = (report) => {
    setSelectedReport(report)
  }

  const handleDownloadReport = (report) => {
    const element = document.createElement("a");
    const file = new Blob([sampleReportHtml], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `report_${report.reportFilename}.html`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
  }

  const handleOpenInNewTab = (report) => {
    const blob = new Blob([sampleReportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const newWindow = window.open(url, '_blank');
    if (newWindow) {
      newWindow.onload = () => {
        URL.revokeObjectURL(url);
      };
    }
  }

  // Initial loading delay for mock data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

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

  // Show loader while loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <DataLoader message="Loading reports..." />
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
        <h1 className="text-2xl md:text-3xl font-bold">Reports</h1>
        <p className="text-sm md:text-base text-muted-foreground">View and download generated reports</p>
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
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-black/10 dark:border-white/20 bg-card/30 backdrop-blur-sm p-3 md:p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 flex-1 min-w-0">
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
                    <div className="text-xs text-muted-foreground whitespace-nowrap hidden sm:block">
                      {report.generated}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleViewReport(report)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDownloadReport(report)}>
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

      <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <DialogTitle>Report Preview</DialogTitle>
            {selectedReport && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleOpenInNewTab(selectedReport)}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Open in New Tab</span>
              </Button>
            )}
          </DialogHeader>
          <div className="flex-1 overflow-auto border rounded-md p-4 bg-white">
            <iframe
              srcDoc={sampleReportHtml}
              className="w-full h-full border-none"
              title="Report Preview"
            />
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}




