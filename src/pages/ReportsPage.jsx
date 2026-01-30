import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Eye, Download } from 'lucide-react'
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

const SAMPLE_REPORT_HTML = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .patient-info { background: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .section { margin-bottom: 20px; }
        h2 { color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 0.9em; text-align: center; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>RADIOLOGY REPORT</h1>
        <p><strong>Medical Imaging Center</strong></p>
    </div>
    
    <div class="patient-info">
        <div><strong>Patient Name:</strong> John Doe</div>
        <div><strong>Patient ID:</strong> P-12345678</div>
        <div><strong>Exam Date:</strong> Oct 26, 2025</div>
        <div><strong>Modality:</strong> CT Scan</div>
    </div>

    <div class="section">
        <h2>Clinical History</h2>
        <p>Persistent headache for 2 weeks. Rule out intracranial pathology.</p>
    </div>

    <div class="section">
        <h2>Technique</h2>
        <p>Axial CT images of the brain were obtained without contrast administration.</p>
    </div>

    <div class="section">
        <h2>Findings</h2>
        <p>The ventricles and sulci are normal in size and configuration for the patient's age. There is no evidence of intracranial hemorrhage, mass effect, or midline shift. The grey-white matter differentiation is preserved. No osseous abnormalities are identified.</p>
    </div>

    <div class="section">
        <h2>Impression</h2>
        <p>Normal CT Brain. No acute intracranial abnormality identified.</p>
    </div>

    <div class="footer">
        <p>Electronically signed by: Dr. Sarah Chen, MD</p>
    </div>
</body>
</html>
`

export default function ReportsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedReport, setSelectedReport] = useState(null)

  const handleViewReport = (report) => {
    setSelectedReport(report)
  }

  const handleDownloadReport = (report) => {
    const element = document.createElement("a");
    const file = new Blob([SAMPLE_REPORT_HTML], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `report_${report.reportFilename}.html`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
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
          <DialogHeader>
            <DialogTitle>Report Preview</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto border rounded-md p-4 bg-white">
            <iframe
              srcDoc={SAMPLE_REPORT_HTML}
              className="w-full h-full border-none"
              title="Report Preview"
            />
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}




