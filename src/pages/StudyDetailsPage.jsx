import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, RefreshCw, ExternalLink, CheckCircle2, XCircle, Clock, AlertCircle, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { studyDetails, failedStudyDetails, mockStudies } from '@/mock/mockStudies'
import { PIPELINE_STAGES } from '@/utils/constants'

export default function StudyDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const study = mockStudies.find((s) => s.id === parseInt(id))
  const details = study?.status === 'failed' ? failedStudyDetails : studyDetails

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'running':
        return 'default'
      case 'failed':
        return 'destructive'
      default:
        return 'outline'
    }
  }

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

  const getStageIcon = (log) => {
    if (log.status === 'complete') {
      return <CheckCircle2 className="h-5 w-5 text-success" />
    }
    if (log.status === 'failed') {
      return <XCircle className="h-5 w-5 text-destructive" />
    }
    return <Clock className="h-5 w-5 text-muted-foreground" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/studies')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Study Details</h1>
            <p className="text-muted-foreground">{details.studyUID}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {details.status === 'failed' && (
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          )}
          {details.status === 'completed' && (
            <Button>
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Viewer
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant={getStatusColor(details.status)} className="text-sm">
          {details.status}
        </Badge>
        <Badge variant={getModalityColor(details.modality)}>
          {details.modality}
        </Badge>
      </div>

      {/* Pipeline Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {PIPELINE_STAGES.map((stage, index) => {
              const log = details.pipelineLogs?.find((l) => l.stage === stage)
              const isCompleted = log?.status === 'complete'
              const isFailed = log?.status === 'failed'
              const isCurrent = index === details.currentStage - 1 && !isCompleted && !isFailed
              
              return (
                <div key={stage} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-border bg-card">
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : isFailed ? (
                      <XCircle className="h-5 w-5 text-destructive" />
                    ) : isCurrent ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    ) : (
                      <div className="h-5 w-5 rounded-full bg-muted" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{stage}</p>
                    {log && (
                      <p className="text-sm text-muted-foreground">
                        {log.timestamp} • {log.server}
                      </p>
                    )}
                  </div>
                  {index < PIPELINE_STAGES.length - 1 && (
                    <div className={`h-12 w-0.5 ${isCompleted ? 'bg-success' : isFailed ? 'bg-destructive' : 'bg-border'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="logs">Pipeline Logs</TabsTrigger>
          <TabsTrigger value="viewer">Viewer</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Study Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Modality</p>
                  <p className="font-medium">{details.modality}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Patient ID</p>
                  <p className="font-medium">{details.patientID}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-medium">{details.description}</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Study Date</p>
                  <p className="font-medium">{details.studyDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Received</p>
                  <p className="font-medium">{details.received}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">{details.lastUpdated}</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Duration</p>
                  <p className="font-medium">{details.totalDuration || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Stage</p>
                  <p className="font-medium">{PIPELINE_STAGES[details.currentStage - 1] || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {details.pipelineLogs?.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="mt-1">{getStageIcon(log)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{log.stage}</p>
                        <Badge variant={log.status === 'complete' ? 'success' : 'destructive'}>
                          {log.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {log.timestamp} • {log.server}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="viewer" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ExternalLink className="mb-4 h-16 w-16 text-muted-foreground" />
                <h3 className="mb-2 text-xl font-semibold">OHIF Viewer Integration</h3>
                <p className="mb-6 text-muted-foreground">
                  Select a study from the Studies page to view it in the integrated OHIF DICOM viewer
                </p>
                <Button onClick={() => navigate('/viewer')}>
                  Open in OHIF Viewer
                </Button>
                <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-border p-4">
                    <h4 className="mb-2 font-semibold">Multi-Format Support</h4>
                    <p className="text-sm text-muted-foreground">
                      View CT, MR, XR, US, and other DICOM modalities
                    </p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <h4 className="mb-2 font-semibold">Measurement Tools</h4>
                    <p className="text-sm text-muted-foreground">
                      Built-in measurement and annotation tools
                    </p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <h4 className="mb-2 font-semibold">Secure Access</h4>
                    <p className="text-sm text-muted-foreground">
                      Token-based authentication ensures secure access
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
            </CardHeader>
            <CardContent>
              {details.report ? (
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{details.report.filename}</p>
                      <p className="text-sm text-muted-foreground">
                        Generated: {details.report.generated}
                      </p>
                    </div>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">No reports generated yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

