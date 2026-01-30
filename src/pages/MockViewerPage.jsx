import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Activity, Calendar, User, Monitor, Layout, Maximize2, Minimize2, ZoomIn, Move, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DicomViewer } from '@/components/DicomViewer/DicomViewer'
import { useState, useMemo, useEffect } from 'react'

// Import all DICOM samples dynamically
const dicomFiles = import.meta.glob('/src/assets/dicom_samples/*.dic', { eager: true, as: 'url' })
const sampleImageIds = Object.values(dicomFiles).map(url => `wadouri:${url}`)

export default function MockViewerPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const studyId = searchParams.get('study')
  const initialIndexParam = searchParams.get('index')
  const initialIndex = initialIndexParam ? parseInt(initialIndexParam) : 0

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeTool, setActiveTool] = useState('Wwwc') // 'Wwwc', 'Pan', 'Zoom'

  // Mock data (same as before)
  const patientData = { name: 'John Doe', id: 'P-12345678', dob: '1985-04-12', sex: 'Male', age: 39 }
  const studyData = { accessionNumber: 'ACC-2023-001', referringPhysician: 'Dr. Sarah Smith', studyDate: '2023-10-26', modality: 'CT', description: 'CT Brain w/o Contrast' }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => console.log(e))
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  return (
    <div className="flex h-screen w-screen bg-black text-foreground overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence mode='wait'>
        {isSidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0, x: -20 }}
            animate={{ width: 320, opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex-shrink-0 h-full border-r border-slate-800 bg-card z-20 flex flex-col overflow-hidden"
          >
            <div className="w-[320px] h-full flex flex-col"> {/* Fixed width content container to prevent content squish during anim */}
              <div className="p-4 border-b border-slate-800 flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="overflow-hidden">
                  <h2 className="font-semibold truncate">Study Viewer</h2>
                  <p className="text-xs text-muted-foreground truncate">{studyId || 'Demo Study'}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Patient Info */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <User className="h-3 w-3" /> Patient
                  </h3>
                  <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name</span>
                      <span className="font-medium">{patientData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID</span>
                      <span className="font-medium">{patientData.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sex</span>
                      <span className="font-medium">{patientData.sex}</span>
                    </div>
                  </div>
                </div>

                {/* Study Info */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="h-3 w-3" /> Study
                  </h3>
                  <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium">{studyData.studyDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Modality</span>
                      <span className="font-medium">{studyData.modality}</span>
                    </div>
                    <div className="pt-2 border-t border-border mt-2">
                      <p className="text-xs text-muted-foreground mb-1">Description</p>
                      <p className="font-medium leading-tight">{studyData.description}</p>
                    </div>
                  </div>
                </div>

                {/* AI Analysis */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Activity className="h-3 w-3" /> AI Analysis
                  </h3>
                  <div className="bg-muted/50 rounded-lg p-3 space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="success" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/50">Normal</Badge>
                      <span className="text-xs text-muted-foreground">No anomalies</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Confidence</span>
                        <span>95%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[95%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-slate-800 text-xs text-center text-muted-foreground">
                Use mouse buttons to interact
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Viewer Area */}
      <div className="flex-1 flex flex-col h-full bg-black relative min-w-0 overflow-hidden">
        {/* Floating Toolbar */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 p-1.5 rounded-full flex items-center gap-1 shadow-2xl transition-all hover:bg-slate-900">
          <Button
            variant="ghost"
            size="icon"
            className={`h-9 w-9 rounded-full ${isSidebarOpen ? 'text-primary bg-primary/10' : 'text-slate-400 hover:text-white'}`}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            title="Toggle Sidebar"
          >
            <Layout className="h-5 w-5" />
          </Button>
          <div className="w-px h-5 bg-slate-700 mx-2" />

          <Button
            variant="ghost"
            size="icon"
            className={`h-9 w-9 rounded-full ${activeTool === 'Wwwc' ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white'}`}
            onClick={() => setActiveTool('Wwwc')}
            title="Levels (Window/Width)"
          >
            <Sun className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-9 w-9 rounded-full ${activeTool === 'Pan' ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white'}`}
            onClick={() => setActiveTool('Pan')}
            title="Pan"
          >
            <Move className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-9 w-9 rounded-full ${activeTool === 'Zoom' ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white'}`}
            onClick={() => setActiveTool('Zoom')}
            title="Zoom"
          >
            <ZoomIn className="h-5 w-5" />
          </Button>

          <div className="w-px h-5 bg-slate-700 mx-2" />

          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400 hover:text-white" title="Layout 1x1">
            <Monitor className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400 hover:text-white" title="Maximize" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </Button>
        </div>

        {/* Viewer Content */}
        <div className="flex-1 w-full h-full relative overflow-hidden">
          <DicomViewer
            imageIds={sampleImageIds}
            activeTool={activeTool}
            initialIndex={initialIndex}
          />
          {/* Overlay Info */}
          <div className="absolute top-4 right-4 text-right text-xs space-y-1 pointer-events-none font-mono text-slate-300">
            <p className="font-bold text-white">Series 1: Demo</p>
            <p>Img: {initialIndex + 1} / {sampleImageIds.length}</p>
            <p className="text-blue-400">Tool: {activeTool}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
