import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Activity, Calendar, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function MockViewerPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const studyId = searchParams.get('study')

  // Mock patient data
  const patientData = {
    name: 'John Doe',
    id: 'P-12345678',
    dob: '1985-04-12',
    sex: 'Male',
    age: 39
  }

  // Mock study details
  const studyData = {
    accessionNumber: 'ACC-2023-001',
    referringPhysician: 'Dr. Sarah Smith',
    studyDate: '2023-10-26',
    modality: 'CT',
    description: 'CT Brain w/o Contrast'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 container mx-auto p-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Study Viewer</h1>
            {studyId && (
              <Badge variant="outline" className="mt-1">
                Study ID: {studyId}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Info & Analysis */}
        <div className="lg:col-span-1 space-y-6">

          {/* Patient Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-medium">{patientData.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Patient ID</p>
                  <p className="font-medium">{patientData.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">DOB</p>
                  <p className="font-medium">{patientData.dob}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Sex</p>
                  <p className="font-medium">{patientData.sex}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Study Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Study Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Accession #</span>
                  <span className="font-medium">{studyData.accessionNumber}</span>
                </div>
                <div className="flex justify-between text-right">
                  <span className="text-muted-foreground">Referring Phys.</span>
                  <span className="font-medium">{studyData.referringPhysician}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{studyData.studyDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Modality</span>
                  <span className="font-medium">{studyData.modality}</span>
                </div>
                <div className="pt-2 border-t border-border">
                  <p className="text-muted-foreground text-xs mb-1">Description</p>
                  <p className="font-medium">{studyData.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-secondary" />
                AI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="success">Normal</Badge>
                  <span className="text-sm text-muted-foreground">No anomalies detected</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-success w-[95%]" />
                </div>
                <p className="text-xs text-muted-foreground">Confidence Score: 95%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Visualization Placeholder */}
        <div className="lg:col-span-2">
          <Card className="h-full min-h-[500px] flex flex-col">
            <CardHeader className="border-b border-border">
              <div className="flex justify-between items-center">
                <CardTitle>Image Viewer Preview</CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">2D</Button>
                  <Button size="sm" variant="outline">3D</Button>
                  <Button size="sm" variant="outline">MPR</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center bg-black/5 relative overflow-hidden p-0">
              <div className="absolute inset-0 grid place-items-center opacity-10 pointer-events-none">
                <Activity className="h-64 w-64" />
              </div>
              <div className="text-center z-10">
                <p className="text-lg font-medium text-muted-foreground">DICOM Viewer Placeholder</p>
                <p className="text-sm text-muted-foreground mt-2">Interactive viewer would load here</p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </motion.div>
  )
}
